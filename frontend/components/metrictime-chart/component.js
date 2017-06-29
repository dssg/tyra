import { addIndex, map, mergeAll, values } from 'ramda'
import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return { data: [], loading: false }
  },

  componentDidMount: function() {
    this.get_metric()
  },

  get_metric: function() {
    let self = this
    self.setState({ loading: true })
    const metricParams = addIndex(map)(
      function(value, idx) {
        let newObj = {}
        newObj['metric' + idx] = value.metric
        newObj['parameter' + idx] = value.parameter
        return newObj
      },
      values(self.props.metrics)
    )
    const params = mergeAll(metricParams)
    $.ajax({
      type: "POST",
      url: "/evaluations/" + this.props.modelId + "/metric_overtime",
      data: $.param(params),
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
          <h4>Metrics Over Time</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Metrics Over Time</h4>
          {
            React.createElement(NVD3Chart, {
              type:"lineChart",
              datum: this.state.data,
              width: "700px",
              height: "500px",
              containerStyle:{ width: "700px", height: "500px" },
              x: function(d) { return d3.time.format("%Y-%m-%d").parse(d[0]) },
              y: function(d) { return d[1] },
              options:{
                showDistX: true,
                showDistY: true,
                duration: 500,
                useInteractiveGuideline: true,
                xAxis: {
                  axisLabel: 'Test Date',
                  tickFormat: function(d) { return d3.time.format("%Y-%m-%d")(new Date(d)) }
                },
                xScale: d3.time.scale(),
                yAxis: { axisLabel: 'Metric' },
                yDomain: [0, 1.05],
                color: d3.scale.category10().range()
              }
            })
          }
        </div>
      )
    }
  }
})
