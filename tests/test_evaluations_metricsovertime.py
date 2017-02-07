from datetime import datetime
from tests.utils import load_json_example, rig_test_client
import json
from psycopg2.extras import Json
from unittest.mock import patch


EARLIER = datetime(2016, 5, 2)
LATER = datetime(2016, 5, 3)
CURRENT = Json({'test_end_date': '2016-04-01'})
TWO_YR_AGO = Json({'test_end_date': '2014-04-01'})
ONE_YR_AGO = Json({'test_end_date': '2015-04-01'})


model_groups_data = [
    # model_group_id
    (1,),
    (2,),
    (3,),
]

models_data = [
    # model_id, run_time, model_type, model_group_id, testing
    (1, EARLIER, 'a_model_type', 1, False, TWO_YR_AGO),
    (2, EARLIER, 'a_model_type', 1, False, ONE_YR_AGO),
    (3, EARLIER, 'a_model_type', 1, False, CURRENT),

]

evaluations_data = [
    # model_id, metric, parameter, value
    (1, 'recall@', '5.0', 65),
    (1, 'recall@', '10.0', 66),
    (1, 'precision@', '5.0', 67),
    (1, 'precision@', '10.0', 68),
    (2, 'recall@', '5.0', 77),
    (2, 'precision@', '10.0', 78),
    (3, 'recall@', '5.0', 55),
    (3, 'precision@', '10.0', 56),
]

data = {
    'model_groups': model_groups_data,
    'models': models_data,
    'evaluations': evaluations_data
}


@patch.dict('os.environ', {'EVALUATION_CUTOFF': '2015-09-01'})
def test_metric_overtime():
    with rig_test_client(data) as test_app:
        route = '/evaluations/1/metric_overtime'
        response = test_app.post(
            route,
            data=dict(
                metric1='recall',
                parameter1='5.0',
                metric2='precision',
                parameter2='10.0'
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        assert expected == response_data
