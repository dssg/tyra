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
    engine.execute('create schema historical_features_daily_month')

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
        test bool,
        model_comment character varying,
        train_end_time timestamp,
        config jsonb
    )""")
    for model in data.get('models', []):
        engine.execute(
            'insert into results.models values (%s, %s, %s, %s, %s, %s, %s, %s)',
            model
        )

    engine.execute("""
    create table results.evaluations (
        model_id int,
        metric character varying,
        parameter character varying,
        value numeric,
        evaluation_start_time timestamp
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

    engine.execute("""
        create table results.feature_importances (
            model_id int,
            feature character varying,
            feature_importance numeric,
            rank_abs int,
            rank_pct numeric
        )""")

    for row in data.get('feature_importances', []):
        engine.execute(
            'insert into results.feature_importances values (%s, %s, %s, %s, %s)',
            row
        )

    engine.execute("""
        create table results.ranked_table (
            model_group_id int,
            metric_parameter character varying,
            avg numeric,
            run_time timestamp,
            model_comment character varying
        )""")

    for row in data.get('ranked_table', []):
        engine.execute(
            'insert into results.ranked_table values (%s, %s, %s, %s, %s)',
            row
        )

    engine.execute("""
        create table results.individual_importances (
            model_id int,
            as_of_date timestamp,
            entity_id bigint,
            risk_1 character varying,
            risk_2 character varying,
            risk_3 character varying,
            risk_4 character varying,
            risk_5 character varying
        )""")

    for row in data.get('individual_importances', []):
        engine.execute(
            'insert into results.individual_importances values (%s, %s, %s, %s, %s, %s, %s, %s)',
            row
        )

    engine.execute("""
        create table historical_features_daily_month.arrests_aggregation (
            officer_id bigint,
            as_of_date timestamp,
            arrests_id_P1D_ArrestsCrimeType_assault_avg numeric
        )""")

    for row in data.get('arrests_aggregation', []):
        engine.execute(
            'insert into historical_features_daily_month.arrests_aggregation values (%s, %s, %s)',
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
