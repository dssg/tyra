import ModelDashboard from 'components/model-dashboard/component'
import ModelChartsTesting from 'components/model-charts-testing/component'
import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <ModelDashboard
        metricOptions={this.props.parameters}
        chartsClass={ModelChartsTesting} />
    )
  }
})
