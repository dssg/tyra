import { addIndex, concat, curry, map, mergeAll, values } from 'ramda'
import NVD3Chart from 'react-nvd3'
import React from 'react'
import d3 from 'd3'

export default React.createClass({
  getInitialState: function() {
    return { data: [], loading: false}
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
    console.log($.param(params))
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
          <h3>&nbsp;</h3>
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
                containerStyle:{ width: "700px", height: "500px" },
                x: function(d) { return d3.time.format("%Y-%m-%d").parse(d[0]) },
                y: function(d) { return d[1] },
                options:{
                  showDistX: true,
                  showDistY: true,
                  duration: 500,
                  useInteractiveGuideline: true,
                  xAxis: {
                    axisLabel: 'Year',
                    tickFormat: function(d) { return d3.time.format("%Y")(new Date(d)) }
                  },
                  yAxis: {
                    axisLabel: 'Metric'
                  },
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
