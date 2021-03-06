from datetime import datetime
from tests.utils import load_json_example, rig_test_client
import json
from unittest.mock import patch


EARLIER = datetime(2016, 5, 2)
LATER = datetime(2016, 5, 3)
CURRENT = '2016-04-01'
TWO_YR_AGO = '2014-04-01'
ONE_YR_AGO = '2015-04-01'


model_groups_data = [
    # model_group_id
    (1,),
]

config = json.dumps({"train_metadata": {"feature_as_of_dates": ["2014-04-24", "2015-04-24"]}})

models_data = [
    # model_id, run_time, model_type, model_group_id, testing, model_comment, train_end_time, config
    (1, EARLIER, 'a_model_type', 1, False, 'two feature block', '2015-04-01', config),

]

evaluations_data = [
    # model_id, metric, parameter, value, as_of_date
    (1, 'recall@', '5.0_pct', 65, TWO_YR_AGO),
    (1, 'recall@', '10.0_pct', 66, TWO_YR_AGO),
    (1, 'precision@', '5.0_pct', 67, TWO_YR_AGO),
    (1, 'precision@', '100_abs', 68, TWO_YR_AGO),
    (1, 'recall@', '5.0_pct', 77, ONE_YR_AGO),
    (1, 'precision@', '100_abs', 78, ONE_YR_AGO),
    (1, 'recall@', '5.0_pct', 55, CURRENT),
    (1, 'precision@', '100_abs', 56, CURRENT),
]

data = {
    'model_groups': model_groups_data,
    'models': models_data,
    'evaluations': evaluations_data
}


def test_metric_overtime():
    with rig_test_client(data) as test_app:
        route = '/evaluations/1/metric_overtime'
        response = test_app.post(
            route,
            data=dict(
                metric1='precision',
                parameter1='top 100',
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        print(expected)
        print(response_data)
        assert expected == response_data
