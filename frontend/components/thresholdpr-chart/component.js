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
      url: "/evaluations/" + this.props.modelId + "/threshold_precision_recall",
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
        <h3><strong>Model {this.props.modelId}</strong></h3>
        <h4>Top-K Percent Precision and Recall by Threshold</h4>
        {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            x: function(d) { return d[0] },
            y: function(d) { return d[1] },
            containerStyle:{ height: "400px", width: "500px" },
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
