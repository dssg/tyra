import { addIndex, concat, curry, map, mergeAll, values } from 'ramda'
import NVD3Chart from 'react-nvd3'
import React from 'react'
import d3 from 'd3'

export default React.createClass({
  getInitialState: function() {
    return { data: [], loading: false}
  },

  data: [
    {
      key: "Base Rate",
      values: [[2010, 0.09], [2011, 0.16], [2012, 0.11], [2013, 0.14], [2014, 0.08], [2015, 0.12], [2016, 0.06]]
    },
    {
      key: "Recall",
      values: [[2010, 0.17], [2011, 0.20], [2012, 0.15], [2013, 0.23], [2014, 0.30], [2015, 0.26], [2016, 0.24]]
    },
    {
      key: "Precision",
      values: [[2010, 0.47], [2011, 0.52], [2012, 0.43], [2013, 0.43], [2014, 0.41], [2015, 0.37], [2016, 0.34]]
    }
  ],

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
      console.log(this.state.data)
    return (
      <div>
          {
            React.createElement(NVD3Chart, {
              type:"lineChart",
              datum: this.state.data,
              containerStyle:{ width: "700px", height: "500px" },
              x: function(d) { return d[0] },
              y: function(d) { return d[1] },
              options:{
                showDistX: true,
                showDistY: true,
                duration: 500,
                useInteractiveGuideline: true,
                xAxis: { axisLabel: 'Year' },
                yAxis: { axisLabel: 'Metric' },
                color: d3.scale.category10().range()
              }
            })
          }
      </div>
    )
  }
})
