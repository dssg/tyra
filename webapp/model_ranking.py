import statistics


def metric_series(model):
    """Extracts series from model dict
    Args: model (dict) a model id and assorted metrics

    Returns: (list) the value of all metric keys
    """
    return [series for key, series in model.items() if key != 'model_id']


def sorted_values(series):
    """Sort the series by date, and only return the values (not the dates)

    Args: series (dict) a date/metric value series

    Returns: (list) metrics, in date order
    """
    return [
        series[key]
        for key
        in sorted(series.keys())
    ]


def metric_series_values(model):
    """Return all metrics over time

    Args: model (dict) a model id and all interested metrics
    Returns: (list) a list of metric values for each metric
        Example: [[0.55, 0.45], [0.25, 0.54]]
    """
    return [
        sorted_values(series)
        for series
        in metric_series(model)
    ]


def mean_squared_error(model):
    """Computes the mean squared error of all metrics in the model
    Args: model (dict) a model id and all interested metrics

        example {
            "model_id": 10,
            "precision@10.0_pct": {'2015-01-01': 0.68, '2016-01-01': 0.65},
            "recall@5.0_pct": {'2015-01-01': 0.55, '2016-01-01': 0.62}
        }
    Returns: (float) the mean squared error of all metrics over time
    """
    def metric_mean_squared(series):
        return statistics.mean([(1.0-value) ** 2 for value in series])

    return statistics.mean([
        metric_mean_squared(series_values)
        for series_values
        in metric_series_values(model)
    ])

RANKERS = {
    'mse': mean_squared_error,
}


def ranked_models(models, ranking_function):
    """
    Return models in order according to the ranking function
    Args:
        models (list) all models, each with a dict containing a model id
            and one to many metric values
            all metric values are expected to be on a 0-1 scale
        ranking_function (str) a lookup key for an existant ranking functions

    Returns: (list) of models in ascending ranked order
    Raises: ValueError if ranking function is not implemented
    """
    if ranking_function not in RANKERS:
        raise ValueError('Ranking function not implemented')

    return sorted(
        models,
        key=lambda model: RANKERS[ranking_function](model=model),
    )
