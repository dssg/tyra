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
        metricChanged={this.props.metricChanged}
        parameterChanged={this.props.parameterChanged}
        handleDeleteClick={this.props.removeMetric} />
    )
  },
  render: function() {
    return (
      <span>
        <div className="row">
          Show models with
        </div>
        <div className="row">
          {values(mapObjIndexed(this.renderSelector, this.props.metrics))}
        </div>
        <div className="row">
          <button
            type="button"
            onClick={this.props.addMetric}
            style={{ padding: '5px 10px' }}
            className="btn btn-info btn-xs">
            Add
          </button>
        </div>
      </span>
    )
  }
})
