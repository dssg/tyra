import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      bins: 20,
      loading: false }
  },


  ajax_call: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + this.props.testOrTrain + this.props.featureSelected,
      success: function(result) {
        self.setState({
          data: result.results.series,
          loading: false
        })
      }
    })
  },

  componentDidMount: function() {
    this.ajax_call()
  },

  componentDidUpdate: function(prevProps) {
    const self = this
    if (self.props.featureSelected !== prevProps.featureSelected ||
        self.props.testOrTrain !== prevProps.testOrTrain) {
      this.ajax_call()
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            containerStyle:{ width: "650px", height: "400px" },
            x: function(d) { return d[0] },
            y: function(d) { return d[1] },
            options:{
              showValues: true,
              showControls: true,
              showDistX: true,
              showDistY: true,
              useInteractiveGuideline: true,
              duration: 500,
              xAxis: { tickFormat: d3.format('.02f'), axisLabel: 'Feature Value' },
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
