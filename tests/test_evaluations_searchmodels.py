from datetime import datetime, timedelta
from tests.utils import load_json_example, rig_test_client
import json

CUTOFF = datetime(2016, 5, 2)
models_data = [
    # model_id, run_time, model_type
    (1, CUTOFF + timedelta(days=1), 'a_model_type'),
    (2, CUTOFF - timedelta(days=1), 'a_model_type'),
    (3, CUTOFF + timedelta(days=1), 'a_model_type'),
]

evaluations_data = [
    # model_id, metric, parameter, value
    (1, 'recall@', '5.0', 45),
    (1, 'recall@', '10.0', 46),
    (1, 'precision@', '5.0', 47),
    (1, 'precision@', '10.0', 48),
    (2, 'recall@', '5.0', 55),
    (3, 'recall@', '5.0', 60),
    (3, 'precision@', '10.0', 50),
]

data = {
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
        assert expected == response_data
