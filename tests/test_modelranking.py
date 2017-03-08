from webapp.model_ranking import mean_squared_error


def test_mean_squared_error():
    input_data = {
        "model_id": 10,
        "precision@10.0_pct": {'2015-01-01': 0.68, '2016-01-01': 0.65},
        "recall@5.0_pct": {'2015-01-01': 0.55, '2016-01-01': 0.62}
    }

    # (
    #   ((1-0.68)^2 + (1-0.65)^2 / 2)
    #   +
    #   ((1-0.55)^2 + (1-0.62)^2 / 2)
    # ) / 2

    # (
    #   ((0.1024 + 0.1225) / 2)
    #   +
    #   ((0.2025 + 0.1444) / 2)
    # ) / 2

    # (
    #   .11245
    #   +
    #   .17345
    # ) / 2

    # .14295

    expected_output = .14295

    assert abs(
        mean_squared_error(input_data) - expected_output
    ) < 0.02
