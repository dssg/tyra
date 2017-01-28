from flask import render_template, request, jsonify
from webapp import app
from webapp import query
from collections import defaultdict
from sklearn.metrics import precision_recall_curve, roc_curve

# filter user-passed metrics through this list
METRIC_WHITELIST = set([
    "precision",
    "recall",
    "auc",
    "f1",
    "true positives",
    "true negatives",
    "false positives",
    "false negatives"
])


@app.route('/')
@app.route('/evaluations')
def index():
    return render_template('index.html')


@app.route('/testing')
def testing():
    return render_template('testing.html')


@app.route('/evaluations/search_models', methods=['POST'])
def search_models():
    f = request.form
    #print(f)
    query_arg = {}
    flattened_query = defaultdict(dict)
    for key in f.keys():
        if 'parameter' in key:
            flattened_query[key.strip('parameter')]['parameter'] = \
                float(f[key])
        elif 'metric' in key:
            if f[key] in METRIC_WHITELIST:
                flattened_query[key.strip('metric')]['metric'] = f[key]
    query_arg['timestamp'] = f['timestamp']
    query_arg['metrics'] = flattened_query
    output, test_end_date = query.get_models(query_arg)
    #query_arg['model_id'] = 10
    #print(query.get_metrics_over_time(query_arg))
    try:
        output = output.to_dict('records')
        return jsonify(results=(output), as_of_date=test_end_date)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/model_result', methods=['GET', 'POST'])
def get_model_result(model_id):
    query_arg = {'model_id': model_id}
    output = query.get_model_prediction(query_arg)
    try:
        output = output.to_dict('records')
        return jsonify(results=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/feature_importance', methods=['GET','POST'])
def feature_importance(model_id, num=10):
    query_arg = {'model_id':model_id, 'num':num}
    f_importance = query.get_feature_importance(query_arg)
    #print(f_importance)
    try:
        f_importance = f_importance.to_dict('records')
        output = [{'key': 'Model'+str(model_id),
                   'color': '#d67777',
                   'values': f_importance}]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/threshold_precision_recall', methods=['GET', 'POST'])
def get_threshold_precision_recall(model_id):
    query_arg = {'model_id': model_id}
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


@app.route('/evaluations/<int:model_id>/simple_precision_recall', methods=['GET', 'POST'])
def get_simple_precision_recall(model_id):
    query_arg = {'model_id': model_id}
    pred = query.get_model_prediction(query_arg)
    precision, recall, threshold = precision_recall_curve(pred['label_value'],
                                                          pred['unit_score'])
    output = [{'key': 'precision_recall',
               'values': list(zip(precision, recall))}]
    try:
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/roc', methods=['GET', 'POST'])
def get_roc(model_id):
    query_arg = {'model_id': model_id}
    pred = query.get_model_prediction(query_arg)
    fpr, tpr, threshold = roc_curve(pred['label_value'], pred['unit_score'])
    output = [{'key': 'roc', 'values': list(zip(fpr, tpr))},
              {'key': 'random', 'values': [[0, 0], [1, 1]]}]
    try:
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/metric_overtime', methods=['GET','POST'])
def get_metric_over_time(model_id):
    f = request.form
    print(f)
    query_arg = {}
    flattened_query = defaultdict(dict)
    for key in f.keys():
        if 'parameter' in key:
            flattened_query[key.strip('parameter')]['parameter'] = \
                float(f[key])
        elif 'metric' in key:
            if f[key] in METRIC_WHITELIST:
                flattened_query[key.strip('metric')]['metric'] = f[key]
    query_arg['metrics'] = flattened_query
    query_arg['model_id'] = model_id
    df = query.get_metrics_over_time(query_arg)
    print(df)
    output = df.to_dict('records')
    print(output)
    try:
        return jsonify(results="success")
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/within_model', methods=['GET', 'POST'])
def within_model():
    return render_template('within_model.html')


@app.route('/evaluations/between_models', methods=['GET', 'POST'])
def between_models():
    return render_template('between_models.html')

