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
      url: "/evaluations/" + this.props.modelId + "/p_r",
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
        <h3>&nbsp;</h3>
        <h4>Precision Recall Curve</h4>
        {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            x: function(d) { return d[1] },
            y: function(d) { return d[0] },
            containerStyle:{ height: "600px", width: "800px" },
            options:{
              showValues: true,
              showControls: true,
              duration: 500,
              xAxis: { axisLabel: 'Recall' },
              yAxis: { axisLabel: 'Precision' },
              color: d3.scale.category10().range()
            }
          })
        }
      </div>
    )
  }
})
