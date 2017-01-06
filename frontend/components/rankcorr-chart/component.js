import d3 from 'd3'
import React from 'react'
import Chart from 'components/chart/component'
import DataSeries from 'components/dataseries/component'
import HeatMap from 'components/heatmap-chart/component'
import _ from 'underscore'

export default React.createClass({
  getDefaultProps: function() {
          return {
            width: 1000,
            height: 1000
          }
        },
  render: function() {

    return (
      <Chart width={this.props.width} height={this.props.height}>
        <HeatMap x={this.props.xloc} y={this.props.yloc} />
      </Chart>
    );
  }
});

