import pandas as pd
from webapp import db

def get_best_models(timestamp, metric, parameter=None, number=25):

    """
    --------------------------------------------------------
    Get the REPORT of the best models
    by the specified timestamp and given metric

    RETURNS RUN TIME, MODEL TYPE, METRIC, and VALUE
    OR
    RUN TIME, MODEL TYPE, METRIC, PARAMETER, and VALUE
    --------------------------------------------------------
    ARGUMENTS:
        timestamp:  models run on or after given timestamp
                    example: '2016-08-03'
        metric:     metric to be optimized
                    example: 'precision@'
        parameter:  parameter value or threshold if any
                    default=None
                    example: '10.0'
        number:     maximum number of desired results
                    default = 25
    --------------------------------------------------------
    """
    if parameter is None:
        query = """
        SELECT
            results.evaluations.model_id,
            run_time,
            model_type,
            metric,
            parameter,
            value
        FROM
            results.evaluations JOIN results.models
             ON evaluations.model_id=models.model_id
             WHERE run_time >= '{}'
             AND value is not null
             AND metric = '{}'
             ORDER BY value DESC LIMIT {}
        """.format(timestamp, metric, number)

    elif parameter is not None:
        parameter = float(parameter)
        metric = metric + "@"
        query = """
        SELECT
            results.evaluations.model_id,
            run_time,
            model_type,
            metric,
            parameter,
            value
        FROM
            results.evaluations JOIN results.models
             ON evaluations.model_id=models.model_id
             WHERE run_time >= '{}'
             AND value is not null
             AND metric = '{}'
             AND parameter = '{}'
             ORDER BY value DESC LIMIT {}
        """.format(timestamp, metric, parameter, number)

    df_models = pd.read_sql(query, con=db.engine)
    output = df_models
    return output


def get_model_prediction(id):
    query = """
    SELECT
        unit_id,
        unit_score,
        label_value
    FROM results.predictions
    WHERE model_id = '{}'
    ORDER BY unit_score DESC
    """.format(id)

    df_models = pd.read_sql(query, con=db.engine)
    output = df_models
    return output


def get_models(query_arg):
    print("timestamp: ", query_arg['timestamp'])
    print("metrics: ", query_arg['metrics'])

    metric_string = ' union '.join([
        "select '{metric}@'::varchar metric, '{parameter}'::varchar parameter".format(**args)
        for num, args in query_arg['metrics'].items()
    ])

    query = """
    select
        e.model_id,
        e.metric || e.parameter as new_metric,
        value
    from
    ({}) input_metrics
    join results.evaluations e using (metric, parameter)
    join results.models m using (model_id)
    where run_time >= %(runtime)s
    """.format(metric_string)
    df_models = pd.read_sql(
        query,
        params={'runtime': query_arg['timestamp']},
        con=db.engine
    )
    output = df_models.pivot(
        index='model_id',
        columns='new_metric',
        values='value'
    )
    output.reset_index(level=0, inplace=True)
    return output


def get_feature_importance(query_arg):
    query = """
    select feature as label, feature_importance as value  from results.feature_importances
    where model_id = %(model_id)s
    order by value DESC
    limit %(num)s;
    """
    df_fimportance = pd.read_sql(query,
                                params={'model_id': query_arg['model_id'], 'num': query_arg['num']},
                                con=db.engine)
    output = df_fimportance
    return output

