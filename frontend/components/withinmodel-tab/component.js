import FeatureBlock from 'components/feature-block/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import React from 'react'
import d3 from 'd3'
import moment from 'moment'

export default React.createClass({
  getInitialState: function() {
    return {
      selectedPoint: this.props.asOfDate,
      selectAsOfDate: this.props.asOfDate
    }
  },

  handleOnValueClick: function(value) {
    this.setState({ selectedPoint: value, selectAsOfDate: moment(value.x).format("YYYY-MM-DD") })
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
          selectedPoint={this.state.selectedPoint} 
          onValueClick={this.handleOnValueClick}/>
        <FeatureBlock 
          modelId={this.props.modelId} 
          asOfDate={this.state.selectAsOfDate} />
      </div>
    )
  }
})