import FeatureBlock from 'components/feature-block/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import React from 'react'


export default React.createClass({
  getInitialState: function() {
    return {
      selectedPoint: this.props.asOfDate,
    }
  },

  handleOnValueClick: function(value) {
    console.log(value)
    this.setState({ selectedPoint: value })
  },

  render: function() {
    return (
      <div>
        <MetricTimeChart 
          modelId={this.props.modelId} 
          metrics={this.props.metrics} 
          selectedPoint={this.state.selectedPoint} 
          onValueClick={this.handleOnValueClick}/>
        <FeatureBlock modelId={this.props.modelId} />
      </div>
    )
  }
})