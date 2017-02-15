import contextlib
from webapp import app
import testing.postgresql
from sqlalchemy import create_engine
import json


def load_json_example(route):
    filepath = 'sample_json' + route + '.json'
    with open(filepath) as f:
        return json.load(f)


def setup_data(engine, data):
    engine.execute('create schema results')

    engine.execute("""
    create table results.model_groups (
        model_group_id int
    )""")
    for row in data.get('model_groups', []):
        engine.execute(
            'insert into results.model_groups values (%s)',
            row
        )

    engine.execute("""
    create table results.models (
        model_id int,
        run_time timestamp,
        model_type varchar,
        model_group_id int,
        test bool
    )""")
    for model in data.get('models', []):
        engine.execute(
            'insert into results.models values (%s, %s, %s, %s, %s)',
            model
        )

    engine.execute("""
    create table results.evaluations (
        model_id int,
        metric character varying,
        parameter character varying,
        value numeric,
        as_of_date timestamp
    )""")
    for row in data.get('evaluations', []):
        engine.execute(
            'insert into results.evaluations values (%s, %s, %s, %s, %s)',
            row
        )

    engine.execute("""
    create table results.predictions (
        model_id int,
        entity_id bigint,
        score numeric,
        label_value int,
        as_of_date timestamp
    )""")

    for row in data.get('predictions', []):
        engine.execute(
            'insert into results.predictions values (%s, %s, %s, %s, %s)',
            row
        )


@contextlib.contextmanager
def rig_test_client(data):
    with testing.postgresql.Postgresql() as postgresql:
        dburl = postgresql.url()
        engine = create_engine(dburl)
        setup_data(engine, data)
        app.config['SQLALCHEMY_DATABASE_URI'] = dburl
        yield app.test_client()
