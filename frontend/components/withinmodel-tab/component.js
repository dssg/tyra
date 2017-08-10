import FeatureBlock from 'components/feature-block/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import React from 'react'
import d3 from 'd3'
import moment from 'moment'

export default React.createClass({
  getInitialState: function() {
    return {
      selectedAsOfDate: this.props.asOfDate
    }
  },

  handleOnValueClick: function(value) {
    this.setState({ selectedAsOfDate: moment(value.x).format("YYYY-MM-DD") })
  },

  shouldComponentUpdate: function(nextState) {
    if (this.state !== nextState) {
      return true
    }
    return false
  },

  render: function() {
    return (
      <div>
        <MetricTimeChart 
          modelId={this.props.modelId} 
          metrics={this.props.metrics} 
          selectedAsOfDate={this.state.selectedAsOfDate} 
          onValueClick={this.handleOnValueClick}/>
        <FeatureBlock 
          modelId={this.props.modelId} 
          asOfDate={this.state.selectedAsOfDate} />
      </div>
    )
  }
})