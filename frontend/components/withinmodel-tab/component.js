import FeatureBlock from 'components/feature-block/component'
import MetricTimeChart from 'components/metrictime-chart/component'
import moment from 'moment'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      selectedAsOfDate: this.props.asOfDate
    }
  },

  handleOnValueClick: function(value) {
    this.setState({ selectedAsOfDate: moment(value.x).format("YYYY-MM-DD") })
  },

  render: function() {
    return (
      <div>
        <MetricTimeChart
          modelId={this.props.modelId}
          metrics={this.props.metrics}
          selectedAsOfDate={this.state.selectedAsOfDate}
          onValueClick={this.handleOnValueClick} />
        <FeatureBlock
          modelId={this.props.modelId}
          asOfDate={this.state.selectedAsOfDate} />
      </div>
    )
  }
})
