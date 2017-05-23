from flask import render_template, request, jsonify, redirect, url_for, flash
import flask_login
from webapp import app
from webapp import query
from webapp.model_ranking import ranked_models
from collections import defaultdict
from sklearn.metrics import precision_recall_curve, roc_curve
import yaml
import datetime
from webapp import users, login_manager

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



@app.route('/evaluations')
@flask_login.login_required
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


@app.route('/evaluations/search_models', methods=['GET', 'POST'])
def search_models():
    f = request.form
    query_arg = {}
    flattened_query = defaultdict(dict)
    for key in f.keys():
        if 'parameter' in key:
            flattened_query[key.strip('parameter')]['parameter'] = \
                dbify_metric_param(f[key])
        elif 'metric' in key:
            if f[key] in METRIC_WHITELIST:
                flattened_query[key.strip('metric')]['metric'] = f[key]
    query_arg['timestamp'] = f['timestamp']
    query_arg['metrics'] = flattened_query
    output, test_end_date = query.get_models(query_arg)
    try:
        output = output.to_dict('records')
        return jsonify(
            results=(output),
            evaluation_start_time=test_end_date.date().isoformat()
        )
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


def convert(indata):
    outdata = []
    model_lookup = defaultdict(lambda: defaultdict(dict))
    for key, metrics in indata.items():
        model_group_id, train_end_time = key
        for metric, value in metrics.items():
            model_lookup[model_group_id][metric][train_end_time] = value
    for model_id, metrics in model_lookup.items():
        entry = metrics
        entry['model_group_id'] = model_group_id
        outdata.append(entry)
    return outdata


@app.route('/evaluations/search_model_groups/<string:model_comment>',
    methods=['GET', 'POST'])
def get_model_groups(model_comment="sworn officers correct month 1m 6y"):
    f = request.form
    query_arg = {}
    flattened_query = defaultdict(dict)
    for key in f.keys():
        if 'parameter' in key:
            flattened_query[key.strip('parameter')]['parameter'] = \
                dbify_metric_param(f[key])
        elif 'metric' in key:
            if f[key] in METRIC_WHITELIST:
                flattened_query[key.strip('metric')]['metric'] = f[key]
    query_arg['timestamp'] = f['timestamp']
    query_arg['metrics'] = flattened_query
    query_arg['model_comment'] = model_comment
    print(query_arg)
    output = query.get_model_groups(query_arg)
    output = output.to_dict('records')
    print(output)
    return jsonify(results=(output))


@app.route('/evaluations/search_models_over_time', methods=['POST'])
def search_models_over_time():
    f = request.form
    output = query.get_metrics_over_time(
        flatten_metric_query(f),
        'run_time > %(ts)s',
        {'ts': f['timestamp']},
        index=['model_group_id', 'as_of_date']
    )
    print(output)
    try:
        unranked = convert(output.to_dict('index'))
        #ranked = ranked_models(unranked, 'mse')
        return jsonify(
            results=ranked,
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
        {'model_id': model_id},
        'as_of_date'
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
    except Exception as e:
        print(e)
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


# Login functions
class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return

    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return

    user = User()
    user.id = email

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = request.form['pw'] == users[email]['pw']

    return user


@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    email = request.form['email']
    try:
        if request.form['pw'] == users[email]['pw']:
            user = User()
            user.id = email
            flask_login.login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Invalid password or account!', 'danger')
            return redirect(url_for('login'))
    except:
        flash('Invalid password or account!', 'danger')
        return redirect(url_for('login'))


@app.route('/protected')
@flask_login.login_required
def protected():
    return 'Logged in as: ' + flask_login.current_user.id


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    flash('Logged out successfully!', 'warning')
    flask_login.logout_user()
    return redirect(url_for('login'))


@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'
