import { clone, isEmpty } from 'ramda'
import ModelDashboard from 'components/model-dashboard/component'
import ModelSearcher from 'components/model-searcher/component'
import ModelTable from 'components/model-table/component'
import moment from 'moment'
import React from 'react'
import uniqueId from 'utils/unique-id'

const defaultMetric = { 'metric': 'precision', 'parameter': '' }
const defaultStartDate = moment('2016-08-03')

export default React.createClass({
  getInitialState: function() {
    let metrics = {}
    metrics[uniqueId()] = clone(defaultMetric)
    return {
      modelId: null,
      metrics: metrics,
      startDate: defaultStartDate,
      searchId: ''
    }
  },

  handleSearch: function(newSearchId) {
    this.setState({ searchId: newSearchId })
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

  renderModelTable: function() {
    return (
      <ModelTable
        modelSearchParameters={this.state.modelSearchParameters}
        setModelId={this.setModelId}
        searchId={this.state.searchId}
        metrics={this.state.metrics}
        startDate={this.state.startDate} />
    )
  },

  render: function() {
    if(this.state.modelId) {
      return (
        <div className="container center-container">
          <div className="row">
            <button onClick={this.removeModelId} id="GoBack" className="btn btn-primary">Back to Search</button>
          </div>
          <ModelDashboard
            modelId={this.state.modelId}
            setModelId={this.setModelId} />
        </div>
      )
    } else {
      return (
        <div className="container center-container">
          <div className="col-lg-3">
            <ModelSearcher
              metrics={this.state.metrics}
              startDate={this.state.startDate}
              handleSearch={this.handleSearch}
              setMetrics={this.setMetrics}
              setStartDate={this.setStartDate} />
          </div>
          <div className="col-lg-9">
            <div className="row">
              <div className="col-lg-12">
                { !isEmpty(this.state.searchId) ? this.renderModelTable() : null }
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})
