import ModelDashboard from 'components/model-dashboard/component'
import ModelCharts from 'components/model-charts/component'
import LogIn from 'components/login/component'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return { logInSuccess: false}
  },
  render: function() {
    console.log(this.state.logInSuccess)
    if(!this.state.logInSuccess) {
      return (
        <LogIn />
      )
    } else {
      return (
        <ModelDashboard
          metricOptions={this.props.parameters}
          chartsClass={ModelCharts} />
      )
    }
  }
})
