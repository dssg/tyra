from flask import render_template, request, jsonify, redirect, url_for, flash
import flask_login
from webapp import app
from webapp import query
from collections import defaultdict
from sklearn.metrics import precision_recall_curve, roc_curve
import yaml
import datetime
from webapp import users, login_manager
import numpy as np
import os
from config import db_dict

# Default DB
app.config['DB_NAME'] = "cmpd"

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

profile_file = os.environ.get('PROFILE', 'default_profile.yaml')

@app.route('/evaluations')
@flask_login.login_required
def index():
    return render_template('index.html', parameters=PARAMETERS)

@app.route('/testing')
def testing():
    return render_template('testing.html', parameters=PARAMETERS)


@app.route('/db_choose/<string:project>', methods=['GET', 'POST'])
def db_choose(project):
    try:
        app.config['SQLALCHEMY_DATABASE_URI'] = db_dict[project]['url']
        app.config['DB_NAME'] = project
        return jsonify(result=project)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/db_list', methods=['GET', 'POST'])
def db_list():
    try:
        return jsonify(result=list(db_dict.keys()))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


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


def convert(indata):
    outdata = []
    model_lookup = defaultdict(lambda: defaultdict(dict))
    for key, metrics in indata.items():
        model_group_id, train_end_time = key
        for metric, value in metrics.items():
            model_lookup[model_group_id][metric][train_end_time] = value

    for model_id, metrics in model_lookup.items():
        entry = metrics
        entry['model_id'] = model_id
        outdata.append(entry)
    return outdata


@app.route(
    '/evaluations/search_model_groups/<string:model_comment>',
    methods=['GET', 'POST']
    )
def get_model_groups(model_comment="all"):
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
    output = query.get_model_groups(query_arg)
    output = output.to_dict('records')
    return jsonify(results=(output))


@app.route(
    '/evaluations/model_comments',
    methods=['GET', 'POST']
    )
def get_model_comments():
    f = request.form
    output = query.get_model_comments(f['timestamp'])
    output = output['model_comment'].tolist()
    return jsonify(results=(output))


@app.route(
    '/evaluations/<int:model_id>/model_result/<string:evaluation_start_time>',
    methods=['GET', 'POST']
)
def get_model_result(model_id, evaluation_start_time):
    query_arg = {'model_id': model_id,
                 'evaluation_start_time': evaluation_start_time}
    output = query.get_model_prediction(query_arg)
    try:
        output = output.to_dict('records')
        return jsonify(results=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/response_dist/<string:evaluation_start_time>',
    methods=['GET', 'POST']
)
def get_response_dist(model_id, evaluation_start_time):
    query_arg = {'model_id': model_id,
                 'evaluation_start_time': evaluation_start_time}
    prediction_df = query.get_model_prediction(query_arg)
    score = prediction_df['score']
    hist_raw, bin = np.histogram(score, bins='auto')
    hist = hist_raw.astype(float)/sum(hist_raw)

    score0 = prediction_df[prediction_df['label_value'] == 0]['score']
    hist0, bin0 = np.histogram(score0, bins=bin)
    hist0 = hist0.astype(float)/sum(hist0)

    score1 = prediction_df[prediction_df['label_value'] == 1]['score']
    hist1, bin1 = np.histogram(score1, bins=bin)
    hist1 = hist1.astype(float)/sum(hist1)

    try:
        output = [
            {"title": "Total", "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin, hist)]},
            {"title": "Label 0", "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin0, hist0)]},
            {"title": "Label 1", "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin1, hist1)]}]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/feature_importance/<int:num>',
    methods=['GET', 'POST']
)
def feature_importance(model_id, num=10):
    query_arg = {'model_id': model_id, 'num': num}
    f_importance = query.get_feature_importance(query_arg)
    try:
        f_importance = f_importance.to_dict('records')
        output = f_importance
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/individual_feature_importance/<int:entity_id>/<string:as_of_date>',
    methods=['GET', 'POST']
)
def individual_feature_importance(model_id, entity_id, as_of_date):
    query_arg = {'model_id': model_id, 'entity_id': entity_id, 'as_of_date': as_of_date}
    individual_importance = query.get_individual_feature_importance(query_arg)
    try:
        individual_importance = individual_importance.to_dict('records')
        output = individual_importance
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/feature_dist_test/<string:feature>/<string:as_of_date>',
    methods=['GET', 'POST']
)
def get_feature_dist_test(as_of_date, model_id, feature):
    query_arg = {
        'model_id': model_id,
        'feature': feature,
        'as_of_date': as_of_date,
        'dbschema': db_dict[app.config['DB_NAME']]['schema']
    }
    # Not sure should dropna or fillna
    f_dist = query.get_test_feature_distribution(query_arg).fillna(value=0)
    dist0 = f_dist[f_dist.columns[0]][f_dist['label_value'] == 0]
    dist1 = f_dist[f_dist.columns[0]][f_dist['label_value'] == 1]
    hist0, bin0 = np.histogram(dist0, bins='auto')
    hist1, bin1 = np.histogram(dist1, bins=bin0)
    if len(bin0) < 3:
        hist0, bin0 = np.histogram(dist0, bins=10)
        hist1, bin1 = np.histogram(dist1, bins=bin0)
    try:
        output = [
            {
                "feature": feature,
                "title": "Label_0",
                "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin0[1:], hist0.astype(float)/sum(hist0))]
            },
            {
                "feature": feature,
                "title": "Label_1",
                "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin1[1:], hist1.astype(float)/sum(hist1))]
            }
        ]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/feature_dist_train/<string:feature>',
    methods=['GET', 'POST']
)
def get_feature_dist_train(model_id=180457, feature="dispatch_id_p1m_dispatchinitiatiationtype_ci_sum"):
    query_arg = {
        'model_id': model_id,
        'feature': feature,
        'dbschema': db_dict[app.config['DB_NAME']]['schema']
    }
    f_dist = query.get_train_feature_distribution(query_arg)
    # Not sure should dropna or fillna
    f_dist = f_dist.fillna(value=0)
    dist0 = f_dist[f_dist.columns[0]][f_dist['label_value'] == 0]
    dist1 = f_dist[f_dist.columns[0]][f_dist['label_value'] == 1]
    hist0, bin0 = np.histogram(dist0, bins='rice')
    hist1, bin1 = np.histogram(dist1, bins=bin0)
    if len(bin0) < 3:
        hist0, bin0 = np.histogram(dist0, bins=10)
        hist1, bin1 = np.histogram(dist1, bins=bin0)
    try:
        output = [
            {
                "feature": feature,
                "title": "Label_0",
                "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin0[1:], hist0.astype(float)/sum(hist0))]
            },
            {
                "feature": feature,
                "title": "Label_1",
                "data": [{'x': float(x), 'y': float(y)} for x, y in zip(bin1[1:], hist1.astype(float)/sum(hist1))]
            }
        ]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/threshold_precision_recall/<evaluation_start_time>',
    methods=['GET', 'POST']
)
def get_threshold_precision_recall(model_id, evaluation_start_time):
    evaluation_start_time = datetime.datetime.strptime(evaluation_start_time, "%Y-%m-%d").date()
    query_arg = {'model_id': model_id, 'evaluation_start_time': evaluation_start_time}
    precision = query.get_precision(query_arg)
    recall = query.get_recall(query_arg)
    try:
        precision = precision.to_dict('records')
        recall = recall.to_dict('records')
        precision = [{'x': p['parameter'], 'y': p['value']} for p in precision]
        recall = [{'x': r['parameter'], 'y': r['value']} for r in recall]
        output = [{'title': 'Precision', 'data': precision},
                  {'title': 'Recall', 'data': recall}]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/simple_precision_recall/<string:evaluation_start_time>',
    methods=['GET', 'POST']
)
def get_simple_precision_recall(model_id, evaluation_start_time):
    query_arg = {'model_id': model_id, 'evaluation_start_time': evaluation_start_time}
    pred = query.get_model_prediction(query_arg)
    precision, recall, threshold = precision_recall_curve(pred['label_value'],
                                                          pred['score'])
    output = {'title': 'precision_recall',
              'data': [{'x': r, 'y': p} for r, p in zip(recall, precision)]}
    try:
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route(
    '/evaluations/<int:model_id>/roc/<string:evaluation_start_time>',
    methods=['GET', 'POST']
)
def get_roc(model_id, evaluation_start_time):
    query_arg = {'model_id': model_id, 'evaluation_start_time': evaluation_start_time}
    pred = query.get_model_prediction(query_arg)
    fpr, tpr, threshold = roc_curve(pred['label_value'], pred['score'])
    output = [{'title': 'roc', 'data': [{'x': f, 'y': t} for f, t in zip(fpr, tpr)]},
              {'title': 'random', 'data': [{'x': 0, 'y': 0}, {'x': 1, 'y': 1}]}]
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
    query_arg = {}
    flattened_query = defaultdict(dict)

    for key in f.keys():
        if 'parameter' in key:
            flattened_query[key.strip('parameter')]['parameter'] = \
                dbify_metric_param(f[key])
        elif 'metric' in key:
            if f[key] in METRIC_WHITELIST:
                flattened_query[key.strip('metric')]['metric'] = f[key]

    query_arg['metrics'] = flattened_query
    query_arg['model_id'] = model_id
    df = query.get_metrics_over_time(query_arg)
    if len(flattened_query.keys()) == 1:
        metric_params = flattened_query[list(flattened_query.keys())[0]]
        data_key = metric_params['metric'] + '@' + metric_params['parameter']
    else:
        print('There are more than 1 metric-parameter pairs!')
    data = sorted([
        {
            'key': data_key,
            'values': sorted(list(zip(df['evaluation_start_time'],
                                      df['value'])))
        }
        ])
    try:
        return jsonify(results=data)
    except Exception as e:
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
