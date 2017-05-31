drop view results.ranked_table_view;

create or replace view
  results.ranked_table_view
  as
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
      JOIN results.evaluations e USING (model_id)
    WHERE evaluation_start_time = train_end_time :: TIMESTAMP
      AND parameter =  '100_abs'
      AND metric = 'precision@'
      /*AND model_comment = 'with accident as adverse'*/
      ) r_table
    GROUP BY r_table.model_group_id, r_table.metric_parameter, r_table.model_comment
    ORDER BY avg DESC;

drop table if exists results.ranked_table CASCADE;
create table
  results.ranked_table
  as
  select * from results.ranked_table_view;
