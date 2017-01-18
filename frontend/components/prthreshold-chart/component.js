import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
    }
  },

  componentDidMount: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/precision_recall_threshold",
      success: function(result) {
        self.setState({
          data: result.results
        })
      }
    })

  },
  render: function() {
    return (
      <div>
        <h3>Model {this.props.modelId}</h3>
        <h3>Top-K Percent Precision and Recall Curve by Threshold</h3>
        {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            x: function(d) { return d[0] },
            y: function(d) { return d[1] },
            containerStyle:{ width: "700px", height: "500px" },
            options:{
              showValues: true,
              showControls: true,
              duration: 500,
              useInteractiveGuideline: true,
              xAxis: { axisLabel: 'Top K(%)' },
              yAxis: { axisLabel: 'Metric' },
              color: d3.scale.category10().range()
            }
          })
        }
      </div>
    )
  }
})
