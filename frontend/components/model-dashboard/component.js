import { clone, isEmpty } from 'ramda'
import ModelBigGraph from 'components/model-biggraph/component'
import ModelSearcher from 'components/model-searcher/component'
import ModelTable from 'components/model-table/component'
import moment from 'moment'
import React from 'react'
import uniqueId from 'utils/unique-id'

const defaultMetric = { 'metric': 'precision', 'parameter': 'top 100' }
const defaultStartDate = moment().subtract(7, 'days')


export default React.createClass({
  getInitialState: function() {
    let metrics = {}
    metrics[uniqueId()] = clone(defaultMetric)
    return {
      modelId: null,
      asOfDate: null,
      metrics: metrics,
      startDate: defaultStartDate,
      searchId: '',
    }
  },

  handleSearch: function(newSearchId) {
    this.setState({ searchId: newSearchId })
  },

  handleLogout: function() {
    console.log("logout button pressed")
    $.ajax({
      type: "GET",
      url: "/logout",
      success: function() {
        window.location = '/login'
      }
    })
  },
  setMetrics: function(newMetrics) {
    this.setState({ metrics: newMetrics })
  },

  setStartDate: function(newDate) {
    this.setState({ startDate: newDate })
  },

  removeModelId: function() {
    this.setState({ modelId: null })
  },

  setModelId: function(newId) {
    this.setState({ modelId: newId })
  },

  setAsOfDate: function(newDate) {
    this.setState({ asOfDate: newDate })
  },

  renderModelTable: function() {
    return (
      <ModelTable
        modelSearchParameters={this.state.modelSearchParameters}
        setModelId={this.setModelId}
        setAsOfDate={this.setAsOfDate}
        asOfDate={this.state.asOfDate}
        searchId={this.state.searchId}
        metrics={this.state.metrics}
        startDate={this.state.startDate} />
    )
  },

  renderModelBigGraph: function() {
    return (
      <ModelBigGraph
        modelSearchParameters={this.state.modelSearchParameters}
        setModelId={this.setModelId}
        setAsOfDate={this.setAsOfDate}
        startDate={this.state.startDate}
        searchId={this.state.searchId}
        asOfDate={this.state.asOfDate}
        metrics={this.state.metrics} />
    )
  },

  renderModelCharts: function() {
    return React.createElement(
      this.props.chartsClass,
      { modelId: this.state.modelId, asOfDate: this.state.asOfDate, setModelId: this.setModelId, metrics: this.state.metrics }
    )
  },

  render: function() {
    if(this.state.modelId) {
      return (
        <div className="container center-container">
          <div className="row">
            <button onClick={this.removeModelId} id="GoBack" className="btn btn-primary">Back to Search</button>
          </div>
          { this.renderModelCharts() }
        </div>
      )
    } else {
      return (
        <div className="container center-container">
          <button onClick={this.handleLogout} id="logOutButton" className="btn btn-xs">Log Out</button>
          <div className="col-lg-3">
            <ModelSearcher
              metrics={this.state.metrics}
              startDate={this.state.startDate}
              handleSearch={this.handleSearch}
              metricOptions={this.props.metricOptions}
              setMetrics={this.setMetrics}
              setStartDate={this.setStartDate} />
          </div>
          <div className="col-lg-9">
            <div className="row">
              <div className="row">
                { !isEmpty(this.state.searchId) ? this.renderModelBigGraph() : null }
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})
