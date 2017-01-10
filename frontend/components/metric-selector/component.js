import React from 'react'

export default React.createClass({
  choices: [
    "precision",
    "recall",
    "auc",
    "f1",
    "true positives",
    "true negatives",
    "false positives",
    "false negatives"
  ],
  handleDelete: function() {
    this.props.handleDeleteClick(this.props.index)
  },
  handleMetricChange: function(event) {
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
  render: function() {
    return (
      <div>
        <select value={this.props.metric.metric} onChange={this.handleMetricChange}>
          {this.choices.map(function(choice) {
            return <option key={choice} value={choice}>{choice}</option>
          })}
        </select>
        <span style={{ margin: '0 1em 0 1em' }}>@</span>
        <input
          type='text'
          size="3"
          value={this.props.metric.parameter}
          onChange={this.handleParameterChange} /> %
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
