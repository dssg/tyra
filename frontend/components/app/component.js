import LogIn from 'components/login/component'
import ModelDashboard from 'components/model-dashboard/component'
import ModelCharts from 'components/model-charts/component'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return { logInSuccess: false }
  },
  componentWillMount: function() {
  },
  setLogInSuccess: function(success) {
    this.setState({ logInSuccess: success })
  },
  render: function() {
    if(!this.state.logInSuccess) {
      return (
        <LogIn logInSuccess={this.setLogInSuccess} />
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
