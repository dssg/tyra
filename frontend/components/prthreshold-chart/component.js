import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function(){
    /*function bind_controller(){
      return $.ajax({
        url: "/evaluations/215/metric",
        dataType: 'json',
        async:false
      }).responseJSON

    console.log(bind_controller()['results'])
    return { data: bind_controller()['results']}*/
    return {
      data: [],
    }
  },

  componentDidMount: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/metric",
      success: function(result) {
        self.setState({
          data: result.results
        })
      }
    })

  },
  render: function(){
    return (
      <div>
        <h3>Model {this.props.modelId}</h3>
        <h3>Top K Threshold Curve</h3>
        {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            x: function(d) { return d[1] },
            y: function(d) { return d[0] },
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
