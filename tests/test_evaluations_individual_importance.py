from tests.utils import load_json_example, rig_test_client
import json

individual_importances_data = [
    # model_id, as_of_date, entity_id, risk_1, risk_2, risk_3, risk_4, risk_5
    (
        1,
        '2014-12-01',
        1234,
        'dispatch_id_p1m_dispatchtype_domestic_disturb_sum',
        'dispatch_id_p1m_dispatchtype_domestic_disturb_avg',
        'dispatch_id_p1m_dispatchtype_shooting_sum',
        'dispatch_id_p1m_dispatchinitiatiationtype_ci_sum',
        'dispatch_id_p1y_dispatchtype_disorder_sum'
     )
]

data = {
    'individual_importances': individual_importances_data
}

def test_individual_importances():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'test'
        url = '/evaluations/1/individual_feature_importance/1234/2014-12-01'
        response = test_app.get(url)
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        print(response_data)
        expected = load_json_example('/evaluations/1/individual_importance')
        assert expected == response_data
