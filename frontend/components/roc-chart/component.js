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
    this.ajax_call()
  },
  componentDidUpdate: function(prevProps) {
    if(prevProps.asOfDate !== this.props.asOfDate) {
      this.ajax_call()
    }
  },
  ajax_call: function() {
    const self = this
    self.setState({ loading: true })
    if (this.props.asOfDate !== null) {
      $.ajax({
        type: "GET",
        url: "/evaluations/" + this.props.modelId + "/roc/" + this.props.asOfDate,
        success: function(result) {
          self.setState({
            data: result.results,
            loading: false
          })
        }
      })
    }
  },
  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h3>&nbsp;</h3>
          <h4>Receiver Operating Characteristic Curve</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          <h3>&nbsp;</h3>
          <h4>Receiver Operating Characteristic Curve</h4>
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
                showLegend: true,
                yDomain: [0, 1.05],
                xDomain: [0, 1.05],
                duration: 500,
                xAxis: { axisLabel: 'False Positive Rate' },
                yAxis: { axisLabel: 'True Positive Rate' },
                color: d3.scale.category10().range()
              }
            })
          }
        </div>
      )
    }
  }
})
