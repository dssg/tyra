from tests.utils import load_json_example, rig_test_client
import json

predictions_data = [
    # model_id, unit_id, unit_score, label_value
    (1, 1234, 5.0, 1),
    (1, 2345, 5.0, 2),
    (1, 3456, 7.0, 3),
    (1, 4567, 8.0, 4),
]

data = {
    'predictions': predictions_data
}


def test_model_prediction():
    with rig_test_client(data) as test_app:
        response = test_app.get('/evaluations/1/model_result')
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/model_result')
        assert expected == response_data
