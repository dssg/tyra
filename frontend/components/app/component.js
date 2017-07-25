import ModelDashboard from 'components/model-dashboard/component'
import ModelCharts from 'components/model-charts/component'
import React from 'react'


export default React.createClass({
  handleLogout: function() {
    $.ajax({
      url: "/logout",
      success: function() {
        window.location = '/login'
      }
    })
  },

  render: function() {
    return (
      <div>
        <button onClick={this.handleLogout} id="logOutButton" className="btn btn-xs">Log Out</button>
        <ModelDashboard
          metricOptions={this.props.parameters}
          chartsClass={ModelCharts} />
      </div>
    )
  }
})
