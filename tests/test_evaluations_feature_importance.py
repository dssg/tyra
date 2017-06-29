from tests.utils import load_json_example, rig_test_client
import json

feature_importance_data = [
    (1, 'dispatch_id_1w_dispatchtype_traffic_sum', 0.011405498),
    (1, 'dispatch_id_1y_dispatchtype_other_sum', 0.011025116),
    (1, 'ir_id_1y_suspensionsoftype_active_sum', 0.010820865),
    (1, 'dispatch_id_1w_dispatchtype_other_sum', 0.009838615),
    (1, 'ts_id_1y_trafficstopsbystopresult_arrest_sum', 0.009159316),
    (1, 'dispatch_id_5y_dispatchtype_domestic_disturb_sum', 0.009125374),
    (1, 'dispatch_id_1y_dispatchtype_intoxicated_sum', 0.008902633),
    (1, 'dispatch_id_1y_dispatchtype_disorder_sum', 0.008782622),
    (1, 'ir_id_1y_interventionsoftype_suspension_sum', 0.008699743),
    (1, 'dispatch_id_1w_dispatchinitiatiationtype_ci_sum', 0.008677285)
]

data = {
    'feature_importances': feature_importance_data
}

def test_feature_importance():
    with rig_test_client(data) as test_app:
        url = '/evaluations/1/feature_importance'
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/feature_importance')
        assert expected == response_data
