from tests.utils import load_json_example, rig_test_client
import json

evaluations_data = [
    #model_id, metric, parameter, value
    (1, 'precision@', '0.01', 0.0),
    (1, 'precision@', '0.1', 0.0),
    (1, 'precision@', '0.25', 0.0),
    (1, 'precision@', '0.5', 0.1),
    (1, 'recall@', '25.0', 0.4223300970873786),
    (1, 'recall@', '50.0', 0.6893203883495146),
    (1, 'recall@', '75.0', 0.8883495145631068),
    (1, 'recall@', '100.0', 1.0)
]

data = {
    'evaluations': evaluations_data
}

def test_precision_recall_threshold():
    with rig_test_client(data) as test_app:
        response = test_app.get('/evaluations/1/precision_recall_threshold')
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/precision_recall_result')
        assert expected == response_data
