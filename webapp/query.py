import pandas as pd
from webapp import db
import logging
import json
import os
from datetime import date, datetime
from dateutil.relativedelta import relativedelta


def evaluation_cutoff_date():
    return os.getenv(
        'EVALUATION_CUTOFF_DATE',
        date.today() - relativedelta(years=1)
    )


INCLUDE_TEST_MODELS = False

if INCLUDE_TEST_MODELS:
    TEST_CLAUSE = "(1=1)"
else:
    TEST_CLAUSE = "(test = 'false')"


def get_model_prediction(query_arg):
    query = """
    SELECT
        entity_id,
        score,
        label_value
    FROM results.predictions
    WHERE model_id = %(model_id)s
    AND as_of_date = %(evaluation_start_time)s
    ORDER BY score DESC
    """
    df_models = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'evaluation_start_time': query_arg['evaluation_start_time']
        },
        con=db.engine
    )
    output = df_models
    return output


def get_model_comments(run_time):
    query = """
    SELECT DISTINCT(model_comment) FROM results.ranked_table
    WHERE run_time >= '{}'
    """.format(run_time)
    model_comments = pd.read_sql(query, con=db.engine)
    return model_comments


def get_model_groups(query_arg):
    query_dict = list(query_arg['metrics'].items())[0][1]
    lookup_query = """
    SELECT
    model_group_id
    FROM results.ranked_table
    ORDER BY avg DESC
    """
    ranked_result = pd.read_sql(lookup_query,
        params={'parameter': query_dict['parameter'],
                'metric': query_dict['metric']+'@'},
        con=db.engine)
    candidates = tuple(ranked_result['model_group_id'].tolist())
    if len(candidates) == 1:
        candidates = "".join(str(candidates).split(','))
    if query_arg['model_comment'] == 'all':
        query = """
        SELECT
        model_group_id,
        json_agg((select row_to_json(_)
                from (select m.model_id,
                             m.run_time::date,
                             m.model_comment,
                             e.value,
                             e.evaluation_start_time::date)
                             as _)
                ORDER BY e.evaluation_start_time
              ) as series
        FROM results.models as m
        JOIN results.evaluations e using(model_id)
        WHERE evaluation_start_time = train_end_time::timestamp
        AND parameter = %(parameter)s
        AND metric = %(metric)s
        AND run_time >= %(runtime)s
        AND model_group_id in {0}
        GROUP BY model_group_id
        """.format(candidates)

    else:
        query = """
        SELECT
        model_group_id,
        json_agg((select row_to_json(_)
                from (select m.model_id,
                             m.run_time::date,
                             m.model_comment,
                             e.value,
                             e.evaluation_start_time::date)
                             as _)
                ORDER BY e.evaluation_start_time
              ) as series
        FROM results.models as m
        JOIN results.evaluations e using(model_id)
        WHERE evaluation_start_time = train_end_time::timestamp
        AND parameter = %(parameter)s
        AND metric = %(metric)s
        AND run_time >= %(runtime)s
        AND model_group_id in {0}
        AND model_comment = '{1}'
        GROUP BY model_group_id
        """.format(candidates,
                   query_arg['model_comment'])

    df_models = pd.read_sql(query,
                            params={'parameter': query_dict['parameter'],
                                    'metric': query_dict['metric']+'@',
                                    'runtime': query_arg['timestamp']},
                            con=db.engine)
    return df_models


def get_individual_feature_importance(query_arg):
    query = """
    SELECT risk_1, risk_2, risk_3, risk_4, risk_5
    FROM results.individual_importances
    WHERE model_id = %(model_id)s
    AND entity_id = %(entity_id)s
    AND as_of_date = %(as_of_date)s
    """
    df_importance = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id'],
                'entity_id': query_arg['entity_id'],
                'as_of_date': query_arg['as_of_date']},
        con=db.engine
    )
    output = df_importance
    return output

def get_feature_importance(query_arg):
    query = """
    select feature as label, feature_importance as value
    from results.feature_importances
    where model_id = %(model_id)s
    order by value DESC
    limit %(num)s;
    """
    df_fimportance = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id'], 'num': query_arg['num']},
        con=db.engine
    )
    output = df_fimportance
    return output


def get_precision(query_arg):
    query = """
    select replace(parameter, '_pct', '') :: NUMERIC as parameter, value
    from results.evaluations
    where metric= 'precision@'
    and model_id = %(model_id)s
    and evaluation_start_time = %(evaluation_start_time)s
    and parameter like '%%_pct'
    order by parameter;
    """
    df_precision = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'evaluation_start_time': query_arg['evaluation_start_time'],
        },
        con=db.engine
        )
    output = df_precision
    return output


def get_recall(query_arg):
    query = """
    select replace(parameter, '_pct', '') :: NUMERIC as parameter, value
    from results.evaluations
    where metric= 'recall@'
    and model_id = %(model_id)s
    and evaluation_start_time = %(evaluation_start_time)s
    and parameter like '%%_pct'
    order by parameter;
    """
    df_precision = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'evaluation_start_time': query_arg['evaluation_start_time'],
        },
        con=db.engine
    )
    output = df_precision
    return output


def get_metrics_over_time(query_arg):
    query_dict = list(query_arg['metrics'].items())[0][1]
    query = """
    SELECT
    evaluation_start_time::date::text,
    value
    FROM results.evaluations
    where model_id = %(model_id)s
    AND parameter = %(parameter)s
    AND metric = %(metric)s
    """
    df = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'parameter': query_dict['parameter'],
            'metric': query_dict['metric']+'@'
        },
        con=db.engine)
    return df


def get_all_features(model_group_id=3131):
    query = """
    SELECT feature_list FROM results.model_groups WHERE model_group_id={}
    """.format(model_group_id)
    df = pd.read_sql(
        query,
        con=db.engine)

    feature_list = df['feature_list'].tolist()[0]
    return feature_list


def get_test_feature_distribution(query_arg):
    dbschema = query_arg['dbschema']

    query = """
    SELECT column_name, table_schema, table_name FROM information_schema.columns
    WHERE LOWER(column_name) = LOWER(%(feature)s)
    """

    df_lookup = pd.read_sql(
        query,
        params={'feature': query_arg['feature']},
        con=db.engine)

    df_lookup = df_lookup[df_lookup['table_schema'] == dbschema['feature_schema']]
    lookup = df_lookup[["aggregation" in i.split("_") for i in df_lookup['table_name'].tolist()]]

    try:
        query = """
        SELECT "{column_name}", {entity_id}, label_value
        FROM "{feature_schema}"."{table_name}" f
        JOIN results.predictions p on f.{entity_id}=p.entity_id and p.as_of_date=f.as_of_date
        where model_id={model_id} and p.as_of_date='{as_of_date}';
        """.format(
            column_name=lookup['column_name'].tolist()[0],
            entity_id=dbschema['entity_id'],
            feature_schema=dbschema['feature_schema'],
            table_name=lookup['table_name'].tolist()[0],
            model_id=query_arg['model_id'],
            as_of_date=query_arg["as_of_date"])

        df = pd.read_sql(
            query,
            con=db.engine)
    except:
        query = """
        SELECT "{column_name}", "{entity_id}", label_value
        FROM "{feature_schema}"."{table_name}" f
        JOIN results.predictions p on f.{entity_id}=p.entity_id
        where model_id={model_id} and p.as_of_date='{as_of_date}';
        """.format(
            column_name=lookup['column_name'].tolist()[0],
            entity_id=dbschema['entity_id'],
            feature_schema=dbschema['feature_schema'],
            table_name=lookup['table_name'].tolist()[0],
            model_id=query_arg['model_id'],
            as_of_date=query_arg["as_of_date"])

        df = pd.read_sql(
            query,
            con=db.engine)

    return df


def get_train_feature_distribution(query_arg):
    dbschema = query_arg['dbschema']

    query = """
    SELECT config ->> 'train_metadata' as train_metadata FROM results.models WHERE model_id=%(model_id)s
    """
    train_metadata = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id']},
        con=db.engine)
    training_time = json.loads(train_metadata['train_metadata'][0])['feature_as_of_dates']

    query = """
    SELECT column_name, table_schema, table_name FROM information_schema.columns
    WHERE LOWER(column_name) = LOWER(%(feature)s)
    """

    df_lookup = pd.read_sql(
        query,
        params={'feature': query_arg['feature']},
        con=db.engine)

    df_lookup = df_lookup[df_lookup['table_schema'] == dbschema['feature_schema']]
    lookup = df_lookup[["aggregation" in i.split("_") for i in df_lookup['table_name'].tolist()]]

    query = """
    SELECT DISTINCT(as_of_date) FROM results.predictions WHERE model_id=%(model_id)s
    """
    as_of_date = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id']},
        con=db.engine)['as_of_date'].tolist()[0]

    try:
        query = """
        SELECT "{column_name}", {entity_id}, label_value
        FROM "{feature_schema}"."{table_name}" f
        JOIN results.predictions p on f.{entity_id}=p.entity_id
        WHERE model_id={model_id}
        AND p.as_of_date='{as_of_date}'
        AND f.as_of_date in {training_time}
        """.format(
            column_name=lookup['column_name'].tolist()[0],
            entity_id=dbschema['entity_id'],
            feature_schema=dbschema['feature_schema'],
            table_name=lookup['table_name'].tolist()[0],
            model_id=query_arg['model_id'],
            as_of_date=as_of_date,
            training_time=tuple(training_time)
            )
        df = pd.read_sql(
            query,
            con=db.engine)
    except:
        query = """
        SELECT "{column_name}", "{entity_id}", label_value
        FROM "{feature_schema}"."{table_name}" f
        JOIN results.predictions p on f.{entity_id}=p.entity_id
        WHERE model_id={model_id}
        AND p.as_of_date='{as_of_date}'
        """.format(
            column_name=lookup['column_name'].tolist()[0],
            entity_id=dbschema['entity_id'],
            feature_schema=dbschema['feature_schema'],
            table_name=lookup['table_name'].tolist()[0],
            model_id=query_arg['model_id'],
            as_of_date=as_of_date,
            )
        df = pd.read_sql(
            query,
            con=db.engine)

    return df
