from tests.utils import load_json_example, rig_test_client
import json

AS_OF_DATE = '2015-01-01'

predictions_data = [
    # model_id, unit_id, unit_score, label_value, as_of_date
    (1, 1234, 5.0, 1, AS_OF_DATE),
    (1, 2345, 5.0, 2, AS_OF_DATE),
    (1, 3456, 7.0, 3, AS_OF_DATE),
    (1, 4567, 8.0, 4, AS_OF_DATE),
]

data = {
    'predictions': predictions_data
}


def test_model_prediction():
    with rig_test_client(data) as test_app:
        url = '/evaluations/1/model_result/{}'.format(AS_OF_DATE)
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/model_result')
        assert expected == response_data
