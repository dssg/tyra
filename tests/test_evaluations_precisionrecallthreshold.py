from tests.utils import load_json_example, rig_test_client
import json

AS_OF_DATE = '2015-01-01'

evaluations_data = [
    # model_id, metric, parameter, value, as_of_date
    (1, 'precision@', '0.01_pct', 0.0, AS_OF_DATE),
    (1, 'precision@', '0.1_pct', 0.0, AS_OF_DATE),
    (1, 'precision@', '0.25_pct', 0.0, AS_OF_DATE),
    (1, 'precision@', '0.5_pct', 0.1, AS_OF_DATE),
    (1, 'recall@', '25.0_pct', 0.4223300970873786, AS_OF_DATE),
    (1, 'recall@', '50.0_pct', 0.6893203883495146, AS_OF_DATE),
    (1, 'recall@', '75.0_pct', 0.8883495145631068, AS_OF_DATE),
    (1, 'recall@', '100.0_pct', 1.0, AS_OF_DATE)
]

data = {
    'evaluations': evaluations_data
}


def test_precision_recall_threshold():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'cmpd'
        url = '/evaluations/1/threshold_precision_recall/2015-01-01'
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        print(response_data)
        expected = load_json_example('/evaluations/1/precision_recall_result')
        assert expected == response_data
