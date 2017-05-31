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
    AND as_of_date = %(as_of_date)s
    ORDER BY score DESC
    """
    df_models = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'as_of_date': query_arg['as_of_date']
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
        join results.evaluations using (model_id)
        where run_time >= %(runtime)s
        and {}
        order by run_time desc limit 1
    )
    select distinct(e.evaluation_start_time)
    from results.models
    join recent_prod_mg using (model_group_id)
    join results.evaluations e using (model_id)
    where e.evaluation_start_time < %(evaluation_cutoff)s
    order by e.evaluation_start_time desc limit 1
    """.format(TEST_CLAUSE)
    print(run_date_lookup_query)
    try:
        results = [row for row in db.engine.execute(
            run_date_lookup_query,
            runtime=query_arg['timestamp'],
            evaluation_cutoff=evaluation_cutoff_date()
        )]
        if results:
            test_end_date = results[-1][0]
        else:
            return pd.DataFrame(), datetime.now()
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
    where e.evaluation_start_time = %(test_end_date)s
    and {}
    and run_time >= %(runtime)s
    """.format(metric_string, TEST_CLAUSE)
    print(query)
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
    select replace(parameter, '_pct', '') :: NUMERIC as parameter, value
    from results.evaluations
    where metric= 'precision@'
    and model_id = %(model_id)s
    and evaluation_start_time = %(as_of_date)s
    and parameter like '%%_pct'
    order by parameter;
    """
    df_precision = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'as_of_date': query_arg['as_of_date'],
        },
        con=db.engine
        )
    print('precision')
    print(df_precision)
    output = df_precision
    return output


def get_recall(query_arg):
    query = """
    select replace(parameter, '_pct', '') :: NUMERIC as parameter, value
    from results.evaluations
    where metric= 'recall@'
    and model_id = %(model_id)s
    and evaluation_start_time = %(as_of_date)s
    and parameter like '%%_pct'
    order by parameter;
    """
    df_precision = pd.read_sql(
        query,
        params={
            'model_id': query_arg['model_id'],
            'as_of_date': query_arg['as_of_date'],
        },
        con=db.engine
    )
    print('recall')
    print(df_precision)
    output = df_precision
    return output


def get_metrics_over_time(metrics, filter_string, filter_values, index):
    metric_string = ' union '.join([
        """
        select
            '{metric}@'::varchar metric,
            '{parameter}'::varchar parameter
        """.format(**args)
        for num, args in metrics.items()
    ])

    query = """
    select
    model_group_id,
    evaluation_start_time::date::text as as_of_date,
    new_metric,
    max(value) as value
    from (
        select mg.model_group_id,
           evaluation_start_time,
           metric || parameter as new_metric,
           value
        from
        ({metric_string}) input_metrics
        join results.evaluations e using(metric, parameter)
        join results.models m using (model_id)
        join results.model_groups mg using (model_group_id)
        where {filter_string}
        and evaluation_start_time = m.train_end_time::timestamp
        and evaluation_start_time < %(evaluation_cutoff)s
    ) ungrouped
    group by model_group_id, evaluation_start_time, new_metric
    """.format(metric_string=metric_string, filter_string=filter_string)

    params = filter_values.copy()
    params['evaluation_cutoff'] = evaluation_cutoff_date()
    df_metrics_overtime = pd.read_sql(query, params=params, con=db.engine)

    output = df_metrics_overtime.pivot_table(
        index=index,
        columns='new_metric',
        values='value'
    )
    return output
