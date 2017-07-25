import { addIndex, map, mergeAll, values } from 'ramda'
import { HorizontalGridLines, LineMarkSeries, makeWidthFlexible, XAxis, XYPlot, YAxis } from 'react-vis'
import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false,
      metric: null,
      index: 0,
    }
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
          metric: result.results[0].key,
          data: result.results[0].values.map((d) => ({ x: d3.time.format("%Y-%m-%d").parse(d[0]), y: d[1] })),
          loading: false
        })
      }
    })
  },

  render: function() {
    const FlexibleWidth = makeWidthFlexible(XYPlot)
    const { index } = this.state
    const data = this.state.data.map((d, i) => ({ ...d, color: i === index ? 2 : 1, size: i === index ? 10 : 5 }))
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
          <FlexibleWidth
            height={250}
            colorDomain={[0, 1, 2]}
            margin={{ left: 50, right: 30, top: 20, bottom: 40 }}
            yType="linear"
            xType="time">
            <XAxis
              title={"Test Date"}
              tickFormat={(d) => d3.time.format("%Y-%m-%d")(new Date(d))}
              tickValues={this.state.data.map((v) => v.x)} />
            <YAxis
              title={this.state.metric} />
            <HorizontalGridLines />
            <LineMarkSeries
              sizeRange={[5, 15]}
              style={{ mark:{ strokeWidth: 2 }, stroke: "#1f77b4" }}
              onNearestXY={ (datapoint, {index}) => this.setState({index}) }
              data={data} />
          </FlexibleWidth>
        </div>
      )
    }
  }
})
