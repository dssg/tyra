from datetime import datetime, timedelta
from tests.utils import load_json_example, rig_test_client
import json
from psycopg2.extras import Json
import logging
import pytest

CUTOFF = datetime(2016, 5, 2)
TOO_NEW = '2016-04-01'
TOO_OLD = '2014-04-01'
JUST_RIGHT = '2015-04-01'

model_groups_data = [
    # model_group_id
    (1,),
    (2,),
    (3,),
    (4,),
]

models_data = [
    # model_id, run_time, model_type, model_group_id, testing

    # test end date is picked from this model group,
    # as it is more recently run than model group 3
    # the middle model should be picked because it is the second most recent
    (1, CUTOFF + timedelta(days=3), 'a_model_type', 1, False),
    (2, CUTOFF + timedelta(days=3), 'a_model_type', 1, False),
    (3, CUTOFF + timedelta(days=3), 'a_model_type', 1, False),

    # skip because runtime is before the cutoff
    (4, CUTOFF - timedelta(days=3), 'a_model_type', 2, False),

    # this is a good model group,
    # and model 10 should be picked based on test_end_date
    (9, CUTOFF + timedelta(days=1), 'a_model_type', 3, False),
    (10, CUTOFF + timedelta(days=1), 'a_model_type', 3, False),
    (11, CUTOFF + timedelta(days=1), 'a_model_type', 3, False),

    # skip because marked testing
    (5, CUTOFF + timedelta(days=1), 'a_model_type', 4, True),

    # the last three should be skipped because same model group as 1-3
    # but less recent runtimes
    (6, CUTOFF + timedelta(days=2), 'a_model_type', 1, False),
    (7, CUTOFF + timedelta(days=2), 'a_model_type', 1, False),
    (8, CUTOFF + timedelta(days=2), 'a_model_type', 1, False),
]

evaluations_data = [
    # model_id, metric, parameter, value, evaluation_start_time
    (1, 'recall@', '5.0_pct', 45, TOO_NEW),
    (1, 'recall@', '10.0_pct', 46, TOO_NEW),
    (1, 'precision@', '5.0_pct', 47, TOO_NEW),
    (1, 'precision@', '10.0_pct', 48, TOO_NEW),
    (2, 'recall@', '5.0_pct', 55, JUST_RIGHT),
    (2, 'precision@', '10.0_pct', 56, JUST_RIGHT),
    (3, 'recall@', '5.0_pct', 60, TOO_OLD),
    (3, 'precision@', '10.0_pct', 50, TOO_OLD),
    (4, 'precision@', '10.0_pct', 48, JUST_RIGHT),
    (5, 'recall@', '5.0_pct', 45, JUST_RIGHT),
    (5, 'recall@', '10.0_pct', 46, JUST_RIGHT),
    (5, 'precision@', '5.0_pct', 47, JUST_RIGHT),
    (5, 'precision@', '10.0_pct', 48, JUST_RIGHT),
    (10, 'recall@', '5.0_pct', 65, JUST_RIGHT),
    (10, 'recall@', '10.0_pct', 66, JUST_RIGHT),
    (10, 'precision@', '5.0_pct', 67, JUST_RIGHT),
    (10, 'precision@', '10.0_pct', 68, JUST_RIGHT),
]

data = {
    'model_groups': model_groups_data,
    'models': models_data,
    'evaluations': evaluations_data
}


@pytest.mark.skip(reason="no way of currently testing this")
def test_search_models():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'test'
        route = '/evaluations/search_models'
        response = test_app.post(
            route,
            data=dict(
                metric1='recall',
                parameter1='top 5.0%',
                metric2='precision',
                parameter2='top 10.0%',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        assert expected == response_data
