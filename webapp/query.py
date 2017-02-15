import pandas as pd
from webapp import db
import logging
import os
from datetime import date
from dateutil.relativedelta import relativedelta


def evaluation_cutoff_date():
    return os.getenv(
        'EVALUATION_CUTOFF_DATE',
        date.today() - relativedelta(years=1)
    )


def get_model_prediction(query_arg):
    query = """
    SELECT
        entity_id as unit_id,
        score as unit_score,
        label_value
    FROM results.predictions
    WHERE model_id = %(model_id)s
    ORDER BY score DESC
    """
    df_models = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id']},
        con=db.engine
        )
    output = df_models
    return output


def get_models(query_arg):
    metric_string = ' union '.join([
        """
        select
            '{metric}@'::varchar metric,
            '{parameter}'::varchar parameter
        """.format(**args)
        for num, args in query_arg['metrics'].items()
    ])

    run_date_lookup_query = """
    with recent_prod_mg as (
        select model_group_id
        from results.models
        where run_time >= %(runtime)s and test = 'false'
        order by run_time desc limit 1
    )
    select distinct(config->>'test_end_date')
    from results.models
    join recent_prod_mg using (model_group_id)
    where (config -> 'test_end_date') ::text::date < %(evaluation_cutoff)s
    order by config->>'test_end_date' desc limit 1
    """
    try:
        results = db.engine.execute(
            run_date_lookup_query,
            runtime=query_arg['timestamp'],
            evaluation_cutoff=evaluation_cutoff_date()
        )
        test_end_date = [row for row in results][-1][0]
    except Exception as e:
        logging.warning(e)
        raise
    query = """
    select
        e.model_id,
        e.metric || e.parameter as new_metric,
        value
    from
    ({}) input_metrics
    join results.evaluations e using (metric, parameter)
    join results.models m using (model_id)
    where m.config->>'test_end_date' = %(test_end_date)s
    and test = 'false'
    and run_time >= %(runtime)s
    """.format(metric_string)
    try:
        df_models = pd.read_sql(
            query,
            params={
                'runtime': query_arg['timestamp'],
                'test_end_date': test_end_date
            },
            con=db.engine
        )
    except Exception as e:
        logging.warning(e)
        raise
    output = df_models.pivot(
        index='model_id',
        columns='new_metric',
        values='value'
    )
    output.reset_index(level=0, inplace=True)
    return output, test_end_date


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
    select parameter :: NUMERIC, value
    from results.evaluations
    where metric= 'precision@'
    and model_id = %(model_id)s
    and parameter != 'default'
    order by parameter;
    """
    df_precision = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id']},
        con=db.engine
        )
    output = df_precision
    return output


def get_recall(query_arg):
    query = """
    select parameter :: NUMERIC, value
    from results.evaluations
    where metric= 'recall@'
    and model_id = %(model_id)s
    and parameter != 'default'
    order by parameter;
    """
    df_precision = pd.read_sql(
        query,
        params={'model_id': query_arg['model_id']},
        con=db.engine
        )
    output = df_precision
    return output


def get_metrics_over_time(query_arg):
    metric_string = ' union '.join([
        """
        select
            '{metric}@'::varchar metric,
            '{parameter}'::varchar parameter
        """.format(**args)
        for num, args in query_arg['metrics'].items()
    ])

    query = """
    select
        model_id, test_end_date, new_metric, max(value) as value
    from (
        with model_group_id_lookup as (
            SELECT distinct(model_group_id) as model_group_id
            FROM results.models
            WHERE model_id = %(model_id)s
        )
        select m.model_id,
           (config -> 'test_end_date') ::text::date as test_end_date,
           e.metric || e.parameter as new_metric,
           value
        from
        ({}) input_metrics
        join results.evaluations e using(metric, parameter)
        join results.models m using (model_id)
        join model_group_id_lookup using (model_group_id)
        where test = 'false'
        and (config -> 'test_end_date') ::text::date < %(evaluation_cutoff)s
    ) ungrouped
    group by model_id, test_end_date, new_metric
    """.format(metric_string)

    df_metrics_overtime = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'evaluation_cutoff': evaluation_cutoff_date()
        },
        con=db.engine)

    output = df_metrics_overtime.pivot_table(
        index=['model_id', 'test_end_date'],
        columns='new_metric',
        values='value'
    )
    output.reset_index(level=0, inplace=True)
    return output
