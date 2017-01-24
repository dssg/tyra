from datetime import datetime, timedelta
from tests.utils import load_json_example, rig_test_client
import json
from psycopg2.extras import Json
import logging

CUTOFF = datetime(2016, 5, 2)

model_groups_data = [
    # model_group_id
    (1,),
    (2,),
    (3,),
    (4,),
]

models_data = [
    # model_id, run_time, model_type, model_group_id, testing, config

    # test end date is picked from this model group, as it is more recently run than model group 3
    # the middle model should be picked because it is the second most recent
    (1, CUTOFF + timedelta(days=3), 'a_model_type', 1, False, Json({ 'test_end_date': '2016-04-01' })),
    (2, CUTOFF + timedelta(days=3), 'a_model_type', 1, False, Json({ 'test_end_date': '2015-04-01' })),
    (3, CUTOFF + timedelta(days=3), 'a_model_type', 1, False, Json({ 'test_end_date': '2014-04-01' })),

    # skip because runtime is before the cutoff
    (4, CUTOFF - timedelta(days=3), 'a_model_type', 2, False, Json({ 'test_end_date': '2015-04-01' })),

    # this is a good model group, and model 10 should be picked based on test_end_date
    (9, CUTOFF + timedelta(days=1), 'a_model_type', 3, False, Json({ 'test_end_date': '2016-04-01' })),
    (10, CUTOFF + timedelta(days=1), 'a_model_type', 3, False, Json({ 'test_end_date': '2015-04-01' })),
    (11, CUTOFF + timedelta(days=1), 'a_model_type', 3, False, Json({ 'test_end_date': '2014-04-01' })),

    # skip because marked testing
    (5, CUTOFF + timedelta(days=1), 'a_model_type', 4, True, Json({ 'test_end_date': '2015-04-01' })),

    # the last three should be skipped because same model group as 1-3 but less recent runtimes
    (6, CUTOFF + timedelta(days=2), 'a_model_type', 1, False, Json({ 'test_end_date': '2016-04-01' })),
    (7, CUTOFF + timedelta(days=2), 'a_model_type', 1, False, Json({ 'test_end_date': '2015-04-01' })),
    (8, CUTOFF + timedelta(days=2), 'a_model_type', 1, False, Json({ 'test_end_date': '2014-04-01' })),
]

evaluations_data = [
    # model_id, metric, parameter, value
    (1, 'recall@', '5.0', 45),
    (1, 'recall@', '10.0', 46),
    (1, 'precision@', '5.0', 47),
    (1, 'precision@', '10.0', 48),
    (2, 'recall@', '5.0', 55),
    (2, 'precision@', '10.0', 56),
    (3, 'recall@', '5.0', 60),
    (3, 'precision@', '10.0', 50),
    (4, 'precision@', '10.0', 48),
    (5, 'recall@', '5.0', 45),
    (5, 'recall@', '10.0', 46),
    (5, 'precision@', '5.0', 47),
    (5, 'precision@', '10.0', 48),
    (10, 'recall@', '5.0', 65),
    (10, 'recall@', '10.0', 66),
    (10, 'precision@', '5.0', 67),
    (10, 'precision@', '10.0', 68),
]

data = {
    'model_groups': model_groups_data,
    'models': models_data,
    'evaluations': evaluations_data
}


def test_search_models():
    with rig_test_client(data) as test_app:
        route = '/evaluations/search_models'
        response = test_app.post(
            route,
            data=dict(
                metric1='recall',
                parameter1='5.0',
                metric2='precision',
                parameter2='10.0',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        logging.warning(response_data)
        assert expected == response_data
