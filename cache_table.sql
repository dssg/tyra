CREATE MATERIALIZED VIEW results.ranked_table
AS
SELECT
r_table.model_group_id,
r_table.metric_parameter,
avg(r_table.value),
max(run_time) run_time,
model_comment
FROM (
      SELECT
      model_group_id,
      e.value,
      e.evaluation_start_time ::DATE,
      metric || parameter as metric_parameter,
      m.run_time,
      m.model_comment
      FROM results.models AS m
      JOIN results.evaluations AS e USING (model_id)
      WHERE evaluation_start_time = train_end_time :: TIMESTAMP
      ) r_table
GROUP BY r_table.model_group_id, r_table.metric_parameter, r_table.model_comment
ORDER BY avg DESC;
