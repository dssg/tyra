import pandas as pd
from webapp import db
import logging
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
    for num, args in query_arg['metrics'].items():
        print(num, args)

    query_dict = list(query_arg['metrics'].items())[0][1]
    print(query_dict)
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
        """.format(tuple(ranked_result['model_group_id'].tolist()))

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
        """.format(tuple(ranked_result['model_group_id'].tolist()),
                   query_arg['model_comment'])

    df_models = pd.read_sql(query,
                            params={'parameter': query_dict['parameter'],
                                    'metric': query_dict['metric']+'@',
                                    'runtime': query_arg['timestamp']},
                            con=db.engine)
    return df_models


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
    print('recall')
    print(df_precision)
    output = df_precision
    return output


def get_metrics_over_time(query_arg):
    for num, args in query_arg['metrics'].items():
        print(num, args)

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

