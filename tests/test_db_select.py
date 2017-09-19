from webapp import app
import json

def test_db_list():
    response = app.test_client().get("/db_list")
    assert response.status_code == 200


def test_db_choose():
    response = app.test_client().get("/db_choose/cmpd")
    assert response.status_code == 200
    response_data = json.loads(response.get_data().decode('utf-8'))
    assert response_data['result'] == app.config['DB_NAME']

