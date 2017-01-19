import ModelDashboard from 'components/model-dashboard/component'
import ModelCharts from 'components/model-charts/component'
import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <ModelDashboard
        chartsClass={ModelCharts} />
    )
  }
})
