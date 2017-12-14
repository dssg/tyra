from datetime import datetime
from tests.utils import load_json_example, rig_test_client
import json

CUTOFF = datetime(2017, 5, 9)

ranked_table_data_1 = [
    # model_group_id, metric_parameter, avg, run_time, model_comment
    (1234, 'precision@100_abs', 0.3221, '2017-05-09', 'two feature block'),
    (2345, 'precision@100_abs', 0.1214, '2017-05-09', 'one feature block'),
    (3456, 'precision@100_abs', 0.3303, '2017-05-09', 'sworn officers correct month mix 1m 6y'),
    (4567, 'precision@100_abs', 0.1043, '2017-05-10', 'sworn officers correct month mix 1m 6y'),
    (5678, 'precision@100_abs', 0.3922, '2017-05-10', 'two feature block'),
    (6789, 'precision@100_abs', 0.0231, '2017-05-10', 'sworn officers correct month mix 1m 6y'),
    (7890, 'precision@100_abs', 0.2891, '2017-05-10', 'sworn officers correct month mix 1m 3y'),
    (8910, 'precision@100_abs', 0.0433, '2017-05-11', 'sworn officers correct month mix 1m 3y'),
    (9101, 'precision@100_abs', 0.1199, '2017-05-11', 'two feature block'),
    (1011, 'precision@100_abs', 0.3099, '2017-05-12', 'sworn officers correct month mix 1m 3y')
]

ranked_table_data_2 = [
    # model_group_id, metric_parameter, avg, run_time, model_comment
    (1234, 'precision@100_abs', 0.3922, '2017-05-10', 'two feature block'),
]

config = json.dumps({"train_metadata": {"feature_as_of_dates": ["2014-04-24", "2015-04-24"]}})

models_data_1 = [
    # model_id, run_time, model_type, model_group_id, test, model_comment, train_end_time, config
    (1, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 5678, False, 'two feature block', '2015-05-01', config),
    (2, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 5678, False, 'two feature block', '2015-06-01', config),
    (3, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 5678, False, 'two feature block', '2015-07-01', config),
    (4, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 5678, False, 'two feature block', '2015-08-01', config),
    (5, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 5678, False, 'two feature block', '2015-09-01', config),
    (6, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 5678, False, 'two feature block', '2015-10-01', config),
    (7, '2017-05-11', 'sklearn.linear_model.LogisticRegression', 8910, False, 'sworn officers correct month mix 1m 3y', '2015-05-01', config),
    (8, '2017-05-11', 'sklearn.linear_model.LogisticRegression', 8910, False, 'sworn officers correct month mix 1m 3y', '2015-06-01', config),
    (9, '2017-05-11', 'sklearn.linear_model.LogisticRegression', 8910, False, 'sworn officers correct month mix 1m 3y', '2015-07-01', config),
    (10, '2017-05-11', 'sklearn.linear_model.LogisticRegression', 8910, False, 'sworn officers correct month mix 1m 3y', '2015-08-01', config)
]

models_data_2 = [
    # model_id, run_time, model_type, model_group_id, test, model_comment, train_end_time, config
    (6, '2017-05-10', 'sklearn.ensemble.RandomForestClassifier', 1234, False, 'two feature block', '2015-10-01', config),
]

evaluations_data = [
    # model_id, metric, parameter, value, evaluation_start_time
    (1, 'precision@', '100_abs', 0.4122, '2015-05-01'),
    (2, 'precision@', '100_abs', 0.3722, '2015-06-01'),
    (3, 'precision@', '100_abs', 0.4222, '2015-07-01'),
    (4, 'precision@', '100_abs', 0.3622, '2015-08-01'),
    (5, 'precision@', '100_abs', 0.4222, '2015-09-01'),
    (6, 'precision@', '100_abs', 0.3522, '2015-10-01'),
    (7, 'precision@', '100_abs', 0.0533, '2015-05-01'),
    (8, 'precision@', '100_abs', 0.0333, '2015-06-01'),
    (9, 'precision@', '100_abs', 0.0633, '2015-07-01'),
    (10, 'precision@', '100_abs', 0.0233, '2015-08-01')
]




def test_model_groups_1():
    data = {
        'ranked_table': ranked_table_data_1,
        'models': models_data_1,
        'evaluations': evaluations_data
    }
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'test'
        route = '/evaluations/search_model_groups/all'
        response = test_app.post(
            route,
            data=dict(
                metric1='precision',
                parameter1='top 100',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        assert expected == response_data

        route = '/evaluations/search_model_groups/{}'.format('two feature block')
        response = test_app.post(
            route,
            data=dict(
                metric1='precision',
                parameter1='top 100',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)

        assert expected == response_data

def test_model_groups_2():
    data = {
        'ranked_table': ranked_table_data_2,
        'models': models_data_2,
        'evaluations': evaluations_data
    }
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'test'
        route = '/evaluations/search_model_groups/all'
        response = test_app.post(
            route,
            data=dict(
                metric1='precision',
                parameter1='top 100',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/search_model_groups/all_1')
        assert expected == response_data
