from flask import render_template, request, jsonify
from webapp import app
from webapp import query
from collections import defaultdict

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

    output = query.get_models(query_arg)
    try:
        output = output.to_dict('records')
        return jsonify(results=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/model_result', methods=['GET', 'POST'])
def get_model_result(model_id):
    output = query.get_model_prediction(id=model_id)
    try:
        output = output.to_dict('records')
        return jsonify(results=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/feature_importance', methods=['GET','POST'])
def feature_importance(model_id=63, num=10):
    query_arg = {'model_id':model_id, 'num':num}
    output = query.get_feature_importance(query_arg)
    print(output)
    try:
        output = output.to_dict('records')
        return jsonify(key="Model "+str(model_id), color="#d67777",values=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/<int:model_id>/precision_recall_threshold', methods=['GET', 'POST'])
def get_precision_and_recall_threshold(model_id):
    query_arg = {'model_id': model_id}
    precision = query.get_precision(query_arg)
    recall = query.get_recall(query_arg)
    try:
        precision = precision.to_dict('records')
        recall = recall.to_dict('records')
        precision = [[p['parameter'], p['value']] for p in precision]
        recall = [[r['parameter'], r['value']] for r in recall]
        output = [{'key': 'Precision', 'values': precision},
                  {'key': 'Recall', 'values': recall}]
        return jsonify(results=output)
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500

@app.route('/evaluations/within_model', methods=['GET', 'POST'])
def within_model():
    return render_template('within_model.html')


@app.route('/evaluations/between_models', methods=['GET', 'POST'])
def between_models():
    return render_template('between_models.html')

