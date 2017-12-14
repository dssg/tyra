from datetime import datetime, timedelta, date
from tests.utils import load_json_example, rig_test_client
import json
from psycopg2.extras import Json
import logging
from unittest.mock import patch
from webapp.controller import convert
import pytest

CUTOFF = datetime(2016, 5, 2)
TOO_NEW = '2016-04-01'
FOUR = '2012-04-01'
THREE = '2013-04-01'
TWO = '2014-04-01'
ONE = '2015-04-01'

model_groups_data = [
    # model_group_id
    (1,),
    (2,),
    (3,),
]

models_data = [
    # model_id, run_time, model_type, model_group_id, testing
    (1, CUTOFF + timedelta(days=3), 'a_model_type', 1, False),
    # skip because runtime is before the cutoff
    (2, CUTOFF - timedelta(days=3), 'a_model_type', 2, False),
    (3, CUTOFF + timedelta(days=1), 'a_model_type', 3, False),
]

evaluations_data = [
    # model_id, metric, parameter, value, evaluation_start_time
    (1, 'recall@', '5.0_pct', 0.46, FOUR),
    (1, 'recall@', '5.0_pct', 0.45, THREE),
    (1, 'recall@', '5.0_pct', 0.40, TWO),
    (1, 'recall@', '5.0_pct', 0.44, ONE),
    (1, 'recall@', '5.0_pct', 0.30, TOO_NEW),
    # (2, 'recall@', '5.0_pct', 0.55, FOUR),
    # (2, 'recall@', '5.0_pct', 0.56, THREE),
    # (2, 'recall@', '5.0_pct', 0.55, TWO),
    # (2, 'recall@', '5.0_pct', 0.56, ONE),
    # (3, 'recall@', '5.0_pct', 0.47, FOUR),
    # (3, 'recall@', '5.0_pct', 0.46, THREE),
    # (3, 'recall@', '5.0_pct', 0.41, TWO),
    # (3, 'recall@', '5.0_pct', 0.45, ONE),
    # (3, 'recall@', '5.0_pct', 0.31, TOO_NEW),
]

data = {
    # 'model_groups': model_groups_data,
    # 'models': models_data,
    'evaluations': evaluations_data
}


@pytest.mark.skip(reason="no way of currently testing this")
def test_convert():
    indata = {(1, date(2014, 4, 1)): {'recall@5.0_pct': 40.0}, (3, date(2015, 4, 1)): {'recall@5.0_pct': 45.0}, (3, date(2013, 4, 1)): {'recall@5.0_pct': 46.0}, (1, date(2012, 4, 1)): {'recall@5.0_pct': 46.0}, (3, date(2014, 4, 1)): {'recall@5.0_pct': 41.0}, (1, date(2015, 4, 1)): {'recall@5.0_pct': 44.0}, (3, date(2012, 4, 1)): {'recall@5.0_pct': 47.0}, (1, date(2013, 4, 1)): {'recall@5.0_pct': 45.0}}

    outdata = [
        {'model_id': 1, 'recall@5.0_pct': {
            date(2014, 4, 1): 40.0,
            date(2015, 4, 1): 44.0,
            date(2013, 4, 1): 45.0,
            date(2012, 4, 1): 46.0,
        }},
        {'model_id': 3, 'recall@5.0_pct': {
            date(2014, 4, 1): 41.0,
            date(2015, 4, 1): 45.0,
            date(2013, 4, 1): 46.0,
            date(2012, 4, 1): 47.0,
        }},
    ]

    assert convert(indata) == outdata


@patch.dict('os.environ', {'EVALUATION_CUTOFF': '2016-03-01'})
@pytest.mark.skip(reason="no way of currently testing this")
def test_search_models_over_time():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'test'
        route = '/evaluations/search_models_over_time'
        response = test_app.post(
            route,
            data=dict(
                metric1='recall',
                parameter1='top 5.0%',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        assert expected == response_data
