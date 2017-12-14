from tests.utils import load_json_example, rig_test_client
import json
import pdb

columns_data = [
    # table_schema, table_name, column_name
    ('historical_features_daily_month', 'arrests_id', 'arrests_id_P1D_ArrestsCrimeType_assault_avg'),
    ('historical_features_daily_month', 'arrests_aggregation', 'arrests_id_P1D_ArrestsCrimeType_assault_avg'),
    ('production_feature_blocks', 'arrests_aggregation', 'arrests_id_P1D_ArrestsCrimeType_assault_avg'),
    ('production_feature_blocks', 'arrests_id', 'arrests_id_P1D_ArrestsCrimeType_assault_avg')
]

predictions_data = [
    # model_id, entity_id, unit_score, label_value, as_of_date
    (1, 1234, 0.3, 0, '2014-04-24'),
    (1, 1234, 0.5, 1, '2015-04-24'),
    (1, 2345, 0.6, 1, '2014-04-24'),
    (1, 2345, 0.7, 0, '2015-04-24'),
    (1, 3456, 0.2, 1, '2014-04-24'),
    (1, 3456, 0.4, 0, '2015-04-24'),
    (1, 4567, 0.5, 1, '2014-04-24'),
    (1, 4567, 0.5, 0, '2015-04-24'),
    (1, 5678, 0.2, 0, '2014-04-24'),
    (1, 5678, 0.7, 0, '2015-04-24'),
    (1, 6789, 0.4, 0, '2014-04-24'),
    (1, 6789, 0.7, 0, '2015-04-24'),
    (1, 7890, 0.3, 0, '2014-04-24'),
    (1, 7890, 0.5, 1, '2015-04-24'),
    (1, 8901, 0.5, 0, '2014-04-24'),
    (1, 8901, 0.8, 1, '2015-04-24')
]

feature_data = [
    # officer_id, as_of_date, arrests_id_P1D_ArrestsCrimeType_assault_avg
    (1234, '2014-04-24', 1.5 ),
    (2345, '2014-04-24', 1),
    (3456, '2014-04-24', 0),
    (4567, '2014-04-24', 4),
    (5678, '2014-04-24', 0),
    (6789, '2014-04-24', 0),
    (7890, '2014-04-24', 2),
    (8901, '2014-04-24', 5)
]

config = json.dumps({"train_metadata": {"feature_as_of_dates": ["2014-04-24", "2015-04-24"]}})

models_data = [
    # model_id, run_time, model_type, model_group_id, test, model_comment, train_end_time, config
    (
        1,
        '2017-05-10',
        'sklearn.ensemble.RandomForestClassifier',
        15678,
        False,
        'two feature block',
        '2015-05-01',
        config
        ),
]

data = {
    'models': models_data,
    'predictions': predictions_data,
    'arrests_aggregation': feature_data
}

def test_get_feature_dist_test():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'cmpd'
        url = '/evaluations/1/feature_dist_test/arrests_id_p1d_arrestscrimetype_assault_avg/2014-04-24'
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/feature_dist_test')
        assert expected == response_data

def test_get_feature_dist_train():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'cmpd'
        url = '/evaluations/1/feature_dist_train/arrests_id_p1d_arrestscrimetype_assault_avg'
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/feature_dist_train')
        assert expected == response_data

