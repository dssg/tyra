from tests.utils import load_json_example, rig_test_client
import json

EVALUATION_START_TIME = '2015-01-01'

predictions_data = [
    # model_id, entity_id, unit_score, label_value, evaluation_start_time
    (1, 1234, 0.5, 1, EVALUATION_START_TIME),
    (1, 2345, 0.2, 0, EVALUATION_START_TIME),
    (1, 3456, 0.7, 1, EVALUATION_START_TIME),
    (1, 4567, 0.8, 0, EVALUATION_START_TIME),
    (1, 5678, 0.6, 0, EVALUATION_START_TIME),
    (1, 6789, 0.3, 1, EVALUATION_START_TIME),
    (1, 7890, 0.9, 0, EVALUATION_START_TIME),
    (1, 8910, 0.4, 1, EVALUATION_START_TIME),
    (1, 9101, 0.1, 1, EVALUATION_START_TIME),
    (1, 1011, 0.0, 0, EVALUATION_START_TIME)
]

data = {
    'predictions': predictions_data
}

def test_response_dist():
    with rig_test_client(data) as test_app:
        url = '/evaluations/1/response_dist/{}'.format(EVALUATION_START_TIME)
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/response_dist')
        assert expected == response_data
