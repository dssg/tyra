import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false }
  },

  componentDidMount: function() {
    this.ajax_call()
  },

  ajax_call: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/feature_dist/" + this.props.featureSelected,
      success: function(result) {
        self.setState({
          data: result.results,
          loading: false
        })
      }
    })
  },

  componentDidUpdate: function(prevProps) {
    const self = this
    if (self.props.featureSelected !== prevProps.featureSelected) {
      this.ajax_call()
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h4>Feature Distribution</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Feature Distribution</h4>
          <h5>{this.props.featureSelected}</h5>
          {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            containerStyle:{ width: "600px", height: "400px" },
            x: function(d) { return d[0] },
            y: function(d) { return d[1] },
            options:{
              showDistX: true,
              showDistY: true,
              useInteractiveGuideline: true,
              duration: 500,
              xAxis: { tickFormat: d3.format('.01f'), axisLabel: 'Feature Value' },
              yAxis: { tickFormat: d3.format('.02f'), axisLabel: 'P(X|Y=Label)' },
              color: d3.scale.category10().range()
              }
            })
          }
        </div>
      )
    }
  }
})
