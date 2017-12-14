from datetime import datetime
from tests.utils import load_json_example, rig_test_client
import json

CUTOFF = datetime(2017, 5, 10)

ranked_table_data = [
    # model_group_id, metric_parameter, avg, run_time, model_comment
    (1234, 'precision@100_abs', 0.3221, '2017-05-09', 'two feature block'),
    (2345, 'precision@100_abs', 0.1214, '2017-05-09', 'one feature block'),
    (3456, 'precision@100_abs', 0.3303, '2017-05-09', 'sworn officers correct month mix 1m 6y'),
    (4567, 'precision@100_abs', 0.1043, '2017-05-10', 'sworn officers correct month mix 1m 6y'),
    (5678, 'precision@100_abs', 0.3922, '2017-05-10', 'two feature block'),
    (6789, 'precision@100_abs', 0.0231, '2017-05-10', 'sworn officers correct month mix 1m 6y'),
    (7890, 'precision@100_abs', 0.2891, '2017-05-10', 'sworn officers correct month mix 1m 3y'),
    (8910, 'precision@100_abs', 0.0433, '2017-05-11', 'sworn officers correct month mix 1m 3y'),
    (9101, 'precision@100_abs', 0.1199, '2017-05-11', 'two feature block'),
    (1011, 'precision@100_abs', 0.3099, '2017-05-12', 'sworn officers correct month mix 1m 3y')
]

data = {
    'ranked_table': ranked_table_data
}

def test_model_comments():
    with rig_test_client(data) as test_app:
        with test_app.session_transaction() as session:
            session['engine'] = 'cmpd'
        route = '/evaluations/model_comments'
        response = test_app.post(
            route,
            data=dict(
                metric1='precision',
                parameter1='top 100',
                timestamp=CUTOFF
            )
        )
        assert response.status_code == 200
        response_data = json.loads(response.get_data().decode('utf-8'))
        expected = load_json_example(route)
        assert expected == response_data
