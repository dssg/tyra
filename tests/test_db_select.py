from webapp import app
import json
import flask

def test_db_list():
    response = app.test_client().get("/db_list")
    assert response.status_code == 200


def test_db_choose():
    with app.test_client() as test_app:
        response = test_app.get("/db_choose/cmpd")
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        assert response_data['result'] == flask.session['engine']
