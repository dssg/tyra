import d3 from 'd3'
import Bar from 'components/bar/component'
import React from 'react'
import _ from 'underscore'

export default React.createClass({
  getDefaultProps: function() {
    return {
      title: '',
      data: [ 30, 10, 5, 8, 15, 10 ]
    }
  },

  render: function() {
    var props = this.props;
    console.log(props)
    console.log(this.props)
    var yScale = d3.scale.linear()
      .domain([0, d3.max(this.props.data)])
      .range([0, this.props.height]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeRoundBands([0, this.props.width], 0.05);

    var bars = _.map(this.props.data, function(point, i) {
      return (
        <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} color={props.color} key={i} />
      )
    });

    return (
      <g>{bars}</g>
    );
  }
});
