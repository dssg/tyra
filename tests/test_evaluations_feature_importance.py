from tests.utils import load_json_example, rig_test_client
import json

feature_importance_data = [
    # model_id, feature, feature_importance, rank_abs, rank_pct
    (1, 'dispatch_id_1w_dispatchtype_traffic_sum', 0.011405498, 1, 0.1),
    (1, 'dispatch_id_1y_dispatchtype_other_sum', 0.011025116, 2, 0.2),
    (1, 'ir_id_1y_suspensionsoftype_active_sum', 0.010820865, 3, 0.3),
    (1, 'dispatch_id_1w_dispatchtype_other_sum', 0.009838615, 4, 0.4),
    (1, 'ts_id_1y_trafficstopsbystopresult_arrest_sum', 0.009159316, 5, 0.5),
    (1, 'dispatch_id_5y_dispatchtype_domestic_disturb_sum', 0.009125374, 6, 0.6),
    (1, 'dispatch_id_1y_dispatchtype_intoxicated_sum', 0.008902633, 7, 0.7),
    (1, 'dispatch_id_1y_dispatchtype_disorder_sum', 0.008782622, 8, 0.8),
    (1, 'ir_id_1y_interventionsoftype_suspension_sum', 0.008699743, 9, 0.9),
    (1, 'dispatch_id_1w_dispatchinitiatiationtype_ci_sum', 0.008677285, 10, 1.0)
]

data = {
    'feature_importances': feature_importance_data
}

def test_feature_importance():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'cmpd'
        url = '/evaluations/1/feature_importance/10'
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example('/evaluations/1/feature_importance')
        assert expected == response_data
