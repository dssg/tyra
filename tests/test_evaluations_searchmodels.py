import testing.postgresql
from sqlalchemy import create_engine
from webapp import app
from datetime import datetime, timedelta
import json

CUTOFF = datetime(2016, 5, 2)
models_data = [
    # model_id, run_time, model_type
    (1, CUTOFF + timedelta(days=1), 'a_model_type'),
    (2, CUTOFF - timedelta(days=1), 'a_model_type'),
]

evaluations_data = [
    # model_id, metric, parameter, value
    (1, 'recall@', '5.0', 45),
    (2, 'recall@', '5.0', 55)
]


def load_json_example(route):
    filepath = 'sample_json' + route + '.json'
    with open(filepath) as f:
        return json.load(f)


def setup_data(engine):
    engine.execute('create schema results')
    engine.execute("""
    create table results.models (
        model_id int,
        run_time timestamp,
        model_type varchar
    )""")
    for model in models_data:
        engine.execute(
            'insert into results.models values (%s, %s, %s)',
            model
        )

    engine.execute("""
    create table results.evaluations (
        model_id int,
        metric character varying,
        parameter character varying,
        value numeric
    )""")
    for row in evaluations_data:
        engine.execute(
            'insert into results.evaluations values (%s, %s, %s, %s)',
            row
        )


def test_search_models():
    with testing.postgresql.Postgresql() as postgresql:
        dburl = postgresql.url()
        engine = create_engine(dburl)
        setup_data(engine)
        app.config['SQLALCHEMY_DATABASE_URI'] = dburl
        test_app = app.test_client()
        route = '/evaluations/search_models'
        response = test_app.post(
            route,
            data=dict(metric1='recall', parameter1='5.0', timestamp=CUTOFF)
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        assert expected == response_data
