from tests.utils import rig_test_client
import json
import flask

def test_db_list():
    with rig_test_client({}) as test_app:
        response = test_app.get("/db_list")
        assert response.status_code == 200


def test_db_choose():
    with rig_test_client({}) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'cmpd'
            response = test_app.get("/db_choose/cmpd")
            assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        assert response_data['result'] == session['engine']
