from flask import render_template, request, jsonify
from webapp import app
from webapp import query
import time
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


@app.route('/evaluations/search_best_models', methods=['POST'])
def search_best_models():
    if request.method == 'POST':
        f = request.form
        metric = f['metric']
        timestamp = f['timestamp']

        if len(f['parameter']) == 0:
            parameter = None
        else:
            parameter = f['parameter']

        if len(f['number']) == 0:
            number = 15
        else:
            number = request.form['number']
        timestamp = request.form['timestamp']
    output = query.get_best_models(
        timestamp=timestamp,
        metric=metric,
        parameter=parameter,
        number=number
    )
    try:
        output = output.to_dict('records')
        return jsonify(results=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500

@app.route('/evaluations/<int:model_id>/model', methods=['GET', 'POST'])
def get_model_prediction(model_id):
    tic = time.time()
    output = query.get_model_prediction(id=model_id)
    print("get_model_prediction")
    print("Query Time: ", time.time() - tic)
    return render_template(
        'model.html',
        tables=[output.to_html(classes='bestmodels')]
    )


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
def feature_importance(model_id=63):
    output = query.get_feature_importance(id=model_id, num=10)
    print(output)
    try:
        output = output.to_dict('records')
        return jsonify(key="Model "+str(model_id), color="#d67777",values=(output))
    except:
        print('there are some problems')
        return jsonify({"sorry": "Sorry, no results! Please try again."}), 500


@app.route('/evaluations/within_model', methods=['GET', 'POST'])
def within_model():
    return render_template('within_model.html')


@app.route('/evaluations/between_models', methods=['GET', 'POST'])
def between_models():
    return render_template('between_models.html')

