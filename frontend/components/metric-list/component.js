import { mapObjIndexed, values } from 'ramda'
import MetricSelector from 'components/metric-selector/component'
import React from 'react'

export default React.createClass({
  renderSelector: function(metric, key) {
    return (
      <MetricSelector
        key={key}
        index={key}
        metric={metric}
        metricOptions={this.props.metricOptions}
        metricChanged={this.props.metricChanged}
        parameterChanged={this.props.parameterChanged}
        handleDeleteClick={this.props.removeMetric} />
    )
  },
  renderAddButton: function() {
    return (
      <button
        type="button"
        onClick={this.props.addMetric}
        style={{ padding: '5px 10px' }}
        className="btn btn-info btn-xs">
        Add
      </button>
    )
  },
  render: function() {
    return (
      <div className='row'>
        <p>Show models with</p>
        {values(mapObjIndexed(this.renderSelector, this.props.metrics))}
        {/*<div className="row">
          {this.renderAddButton()}
        </div>*/}
      </div>
    )
  }
})
