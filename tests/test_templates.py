from webapp import app


def test_testing_endpoint():
    response = app.test_client().get("/testing")
    assert response.status_code == 200
