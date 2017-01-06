import { clone, omit } from 'ramda'
import DatePicker from 'react-datepicker'
import MetricList from 'components/metric-list/component'
import React from 'react'
import uniqueId from 'utils/unique-id'

const defaultMetric = { 'metric': 'precision', 'parameter': '' }

export default React.createClass({
  handleSearch: function() {
    this.props.handleSearch(uniqueId())
  },
  handleDateChange: function(dt) {
    this.props.setStartDate(dt)
  },
  addMetric: function() {
    let newMetrics = this.props.metrics
    newMetrics[uniqueId()] = clone(defaultMetric)
    this.props.setMetrics(newMetrics)
  },
  metricChanged: function(metricId, newValue) {
    let newMetrics = this.props.metrics
    newMetrics[metricId].metric = newValue
    this.props.setMetrics(newMetrics)
  },
  parameterChanged: function(metricId, newValue) {
    let newMetrics = this.props.metrics
    newMetrics[metricId].parameter = newValue
    this.props.setMetrics(newMetrics)
  },
  removeMetric: function(metricId) {
    this.props.setMetrics(omit([metricId], this.props.metrics))
  },
  render: function() {
    return (
      <form method="post" role="form" id="form_arg">
        <div className="row">
          <MetricList
            addMetric={this.addMetric}
            removeMetric={this.removeMetric}
            metricChanged={this.metricChanged}
            parameterChanged={this.parameterChanged}
            metrics={this.props.metrics} />
        </div>
        <div className="row">
        After
        <DatePicker
          selected={this.props.startDate}
          onChange={this.handleDateChange} />
        &nbsp; &nbsp;
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={this.handleSearch}>
            Go
          </button>
        </div>
      </form>
    )
  }
})
