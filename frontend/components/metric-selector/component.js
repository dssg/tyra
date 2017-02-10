import React from 'react'
import { concat, contains, map } from 'ramda'

export default React.createClass({
  getInitialState: function() {
    return { showParameters: true }
  },
  handleDelete: function() {
    this.props.handleDeleteClick(this.props.index)
  },
  handleMetricChange: function(event) {
    this.setState({
      showParameters: contains(
        event.target.value,
        this.props.metricOptions.parameterized
      )
    })
    this.props.metricChanged(
      this.props.index,
      event.target.value
    )
  },
  handleParameterChange: function(event) {
    this.props.parameterChanged(
      this.props.index,
      event.target.value
    )
  },
  availableMetrics: function() {
    return concat(
      this.props.metricOptions.parameterized,
      this.props.metricOptions.unparameterized
    )
  },
  availableParameters: function() {
    return concat(
      map(
        function(abs) { return 'top ' + String(abs)},
        this.props.metricOptions.abs
      ), map(
        function(pct) { return 'top ' + String(pct.toFixed(1)) + '%' },
        this.props.metricOptions.pct
      )
    )
  },
  renderParameterPicker: function() {
    return (
      <select value={this.props.metric.parameter} onChange={this.handleParameterChange}>
        {this.availableParameters().map(function(choice) {
          return <option key={choice} value={choice}>{choice}</option>
        })}
      </select>
    )
  },
  render: function() {
    return (
      <div>
        <select value={this.props.metric.metric} onChange={this.handleMetricChange}>
          {this.availableMetrics().map(function(choice) {
            return <option key={choice} value={choice}>{choice}</option>
          })}
        </select>
        <span style={{ margin: '0 1em 0 1em' }}>@</span>
        { this.state.showParameters ? this.renderParameterPicker() : null }
        &nbsp;
        <button
          className='btn btn-xs btn-danger'
          type='button'
          onClick={this.handleDelete}>
          X
        </button>
      </div>
    )
  }
})
