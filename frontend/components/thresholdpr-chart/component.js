import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false
    }
  },

  componentDidMount: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/threshold_precision_recall",
      success: function(result) {
        self.setState({
          data: result.results,
          loading: false
        })
      }
    })

  },
  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h3><strong>Model {this.props.modelId}</strong></h3>
          <h4>Top-K Percent Precision and Recall by Threshold</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
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
                xDomain: [0, 105],
                yDomain: [0, 1.05],
                xAxis: { axisLabel: 'Top K(%)' },
                yAxis: { axisLabel: 'Metric' },
                color: d3.scale.category10().range()
              }
            })
          }
        </div>
      )
    }
  }
})