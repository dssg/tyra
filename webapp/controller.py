from flask import render_template, request, jsonify
from webapp import app
from webapp import query
from webapp.model_ranking import ranked_models
from collections import defaultdict
from sklearn.metrics import precision_recall_curve, roc_curve
import yaml
import datetime

# filter user-passed metrics through this list
METRIC_WHITELIST = set([
    "precision",
    "recall",
    "auc",
    "true positives",
    "true negatives",
    "false positives",
    "false negatives"
])

with open('parameters.yaml') as f:
    PARAMETERS = yaml.load(f)


@app.route('/')
@app.route('/evaluations')
def index():
    return render_template('index.html', parameters=PARAMETERS)


@app.route('/testing')
def testing():
    return render_template('testing.html', parameters=PARAMETERS)


def dbify_metric_param(param):
    cleaned_param = param[len('Top '):]
    if cleaned_param.endswith('%'):
        return cleaned_param.replace('%', '_pct')
    else:
        return cleaned_param + '_abs'


def prettify_metric_param(param):
    if param.endswith('_abs'):
        return 'top {}'.format(param.replace('_abs', ''))
    elif param.endswith('_pct'):
        return 'top {}'.format(param.replace('_pct', '%'))
    else:
        return param


def prettify_metric(metric):
    m, param = metric.split('@')
    pretty_param = prettify_metric_param(param)
    return '{}@{}'.format(m, pretty_param)


def flatten_metric_query(form):
    flattened_query = defaultdict(dict)
    for key in form.keys():
        if 'parameter' in key:
            flattened_query[key.strip('parameter')]['parameter'] = \
                dbify_metric_param(form[key])
        elif 'metric' in key:
            if form[key] in METRIC_WHITELIST:
                flattened_query[key.strip('metric')]['metric'] = form[key]
    return flattened_query


@app.route('/evaluations/search_models', methods=['POST'])
def search_models():
    f = request.form
    output = query.get_metrics_over_time(
        flatten_metric_query(f),
        'run_time > %(ts)s',
        {'ts': f['timestamp']},
        index=['model_id']
    )
    try:
        n = output.to_dict('records')
        ranked = ranked_models(n, 'mse'),
        print('ranked')
        print(ranked)
        series = next(iter(
            [v for k, v in ranked.items() if isinstance(v, dict)]
        ), None)
        if not series:
            raise ValueError('No metric time series found')
        as_of_date = series.keys()[0]
        return jsonify(
            results=(output),
            as_of_date=as_of_date
        )
    except Exception as e:
        print(e)
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/model_result/<as_of_date>',
    methods=['GET', 'POST']
)
def get_model_result(model_id, as_of_date):
    query_arg = {'model_id': model_id, 'as_of_date': as_of_date}
    output = query.get_model_prediction(query_arg)
    try:
        output = output.to_dict('records')
        return jsonify(results=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/feature_importance',
    methods=['GET', 'POST']
)
def feature_importance(model_id, num=10):
    query_arg = {'model_id': model_id, 'num': num}
    f_importance = query.get_feature_importance(query_arg)
    try:
        f_importance = f_importance.to_dict('records')
        output = [{'key': 'Model'+str(model_id),
                   'color': '#d67777',
                   'values': f_importance}]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/threshold_precision_recall/<as_of_date>',
    methods=['GET', 'POST']
)
def get_threshold_precision_recall(model_id, as_of_date):
    as_of_date = datetime.datetime.strptime(as_of_date, "%Y-%m-%d").date()
    query_arg = {'model_id': model_id, 'as_of_date': as_of_date}
    precision = query.get_precision(query_arg)
    recall = query.get_recall(query_arg)
    try:
        precision = precision.to_dict('records')
        recall = recall.to_dict('records')
        precision = [[p['parameter'], p['value']] for p in precision]
        recall = [[r['parameter'], r['value']] for r in recall]
        print(precision)
        output = [{'key': 'Precision', 'values': precision},
                  {'key': 'Recall', 'values': recall}]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/simple_precision_recall/<as_of_date>',
    methods=['GET', 'POST']
)
def get_simple_precision_recall(model_id, as_of_date):
    query_arg = {'model_id': model_id, 'as_of_date': as_of_date}
    pred = query.get_model_prediction(query_arg)
    precision, recall, threshold = precision_recall_curve(pred['label_value'],
                                                          pred['score'])
    output = [{'key': 'precision_recall',
               'values': list(zip(precision, recall))}]
    try:
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/roc/<as_of_date>',
    methods=['GET', 'POST']
)
def get_roc(model_id, as_of_date):
    query_arg = {'model_id': model_id, 'as_of_date': as_of_date}
    pred = query.get_model_prediction(query_arg)
    fpr, tpr, threshold = roc_curve(pred['label_value'], pred['score'])
    output = [{'key': 'roc', 'values': list(zip(fpr, tpr))},
              {'key': 'random', 'values': [[0, 0], [1, 1]]}]
    try:
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/metric_overtime',
    methods=['GET', 'POST']
)
def get_metric_over_time(model_id):
    f = request.form
    metric_query = flatten_metric_query(f)
    df = query.get_metrics_over_time(
        metric_query,
        'model_id = %(model_id)s',
        {'model_id': model_id}
    )
    output = df.to_dict()
    data = sorted([
        {
            'key': prettify_metric(key),
            'values': sorted([
                (str(dt), value)
                for dt, value in series.items()
            ])
        }
        for key, series in output.items() if key != 'model_id'
    ], key=lambda series: series['key'])
    data.append({'key': 'model ' + str(model_id),
                 'values': [(data[0]['values'][-1][0], 0.0),
                            (data[0]['values'][-1][0], int(model_id))]})
    try:
        return jsonify(results=data)
    except Exception:
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/within_model', methods=['GET', 'POST'])
def within_model():
    return render_template('within_model.html')


@app.route('/evaluations/between_models', methods=['GET', 'POST'])
def between_models():
    return render_template('between_models.html')
