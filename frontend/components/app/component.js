import ModelDashboard from 'components/model-dashboard/component'
import ModelCharts from 'components/model-charts/component'
import ProjectButton from 'components/project-button/component'
import React from 'react'


export default React.createClass({
  getInitialState: function() {
    return {
      projectSelected: null,
      projectList: ["cmpd", "sfpd"],
      currentProject: null,
    }
  },

  handleClick: function(p) {
    this.setState({ project: p, projectSelected: true }, this.ajax_call)
  },

  handleLogout: function() {
    $.ajax({
      url: "/logout",
      success: function() {
        window.location = '/login'
      }
    })
  },

  handleProjectList: function() {
    this.setState({ projectSelected: null })
  },

  ajax_call: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/db_choose/" + self.state.project,
      success: function(result) {
        console.log("Connect to " + result.result + " database!")
        self.setState({ currentProject: result.result.toUpperCase() })
      }
    })
  },

  ajax_list: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/db_list",
      success: function(result) {
        self.setState({ projectList: result.result })
      }
    })
  },

  renderDashBoard: function() {
    return (
      <div>
        <span id="currentProject">Current Project: {this.state.currentProject}</span>
        <button onClick={this.handleProjectList} id="projectListButton" className="btn btn-xs">Project List</button>
        <button onClick={this.handleLogout} id="logOutButton" className="btn btn-xs">Log Out</button>
        <ModelDashboard
          currentProject={this.state.currentProject}
          metricOptions={this.props.parameters}
          chartsClass={ModelCharts} />
      </div>
    )
  },

  componentDidMount: function() {
    this.ajax_list()
  },

  render: function() {
    if(this.state.projectSelected) {
      return (
        <div>
          {this.renderDashBoard()}
        </div>
      )
    } else {
      return (
        <div className="container">
          <button onClick={this.handleLogout} id="logOutButton" className="btn btn-xs">Log Out</button>
          <div className="col-md-12">
            <h3>Projects</h3>
          </div>
          { this.state.projectList.map((p, idx) => (
            <ProjectButton
              key={idx}
              project={p}
              handleClick={this.handleClick} />
            ))}
        </div>
      )
    }
  }
})
