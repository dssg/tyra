import d3 from 'd3'
import Block from 'components/block/component'
import React from 'react'
import _ from 'underscore'

export default React.createClass({
  getDefaultProps: function() {
    return {
      title: '',
      data: generate_fake_corr_matrix(20),
      legend_scale: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    }
  },
  render: function() {
    var props = this.props;
    var margin = { top: 150, right: 10, bottom: 50, left: 100 };
    var cellSize = 30
    console.log(Math.sqrt(this.props.data.length)*cellSize)
    var legendElementWidth = cellSize*2.5
    var colors_scale = d3.scale.linear().range(["white","steelblue"]);
    var legend = _.map(this.props.legend_scale, function(point, i) {
      return (
        <Block yloc={cellSize*i} xloc={(Math.sqrt(props.data.length)*cellSize) + cellSize*2} width={legendElementWidth} height={cellSize} color={colors_scale(point)} key={i}/>
        )
    })
    var legend_text = _.map(this.props.legend_scale, function(point, i) {
      return (
        <text x={(Math.sqrt(props.data.length)*cellSize) + cellSize*5} y={cellSize*i+20} key={i}>{(point).toPrecision(1)}</text>
        )
    })
    var heatmap = _.map(this.props.data, function(point, i){
      return (
        <Block xloc={point[0]*cellSize} yloc={point[1]*cellSize} className={"cell cell-border cr"+(point[1]-1) + " cc" + (point[0]-1)}
         color={colors_scale(point[2])} height={cellSize} width={cellSize} key={i}/>
        )
    })
    return (

      <g>{legend}{heatmap}{legend_text}</g>

    );
  }
});

/*
sample format:
[[1,1,0.12], [1,2,0.54], [1,3,0.87], [2,1,0.43], [2,2,0.12], [2,3,0.91], [3,1,0.33], [3,2,0.21], [3,3,0.66]]
*/
function generate_fake_corr_matrix(n) {
  var corr_matrix = []
  var random = Math.random
  for (var i = 1; i <= n; i++ ) {
    for (var j = 1; j <= n; j++) {
      corr_matrix.push([i,j, random()])
    }
  }
  return corr_matrix
}
