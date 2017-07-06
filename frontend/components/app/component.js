//import LogIn from 'components/login/component'
import ModelDashboard from 'components/model-dashboard/component'
import ModelCharts from 'components/model-charts/component'
import React from 'react'


export default React.createClass({
  render: function() {
    return (
      <ModelDashboard
        metricOptions={this.props.parameters}
        chartsClass={ModelCharts} />
    )
  }
})
