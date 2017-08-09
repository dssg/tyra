import { addIndex, map, mergeAll, values } from 'ramda'
import { HorizontalGridLines, LineMarkSeries, makeWidthFlexible, XAxis, XYPlot, YAxis } from 'react-vis'
import d3 from 'd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false,
      metric: null,
      selectedPoint: null,
    }
  },

  transformColor: function(data, selectedPoint) {
    const test = data.map((row) => {
      if (row.x === selectedPoint.x) {
        return { ...row, color: '#ef5d28' }
      } else {
        return { ...row, color: '#1f77b4' }
      }
    })

    return test
  },

  ajax_call: function() {
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
          selectedPoint: d3.time.format("%Y-%m-%d").parse(result.results[0].values[0][0]),
          loading: false
        })
      }
    })
  },

  componentDidMount: function() {
    this.ajax_call()
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
      const FlexibleWidth = makeWidthFlexible(XYPlot)
      const { data, selectedPoint } = this.state
      return (
        <div>
          <h4>Metrics Over Time</h4>
          <FlexibleWidth
            height={250}
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
              colorType="literal"
              size={10}
              style={{ 'cursor': 'pointer' }}
              onValueClick={(value) => {this.setState({ selectedPoint: value })}}
              data={this.transformColor(data, selectedPoint)} />
          </FlexibleWidth>
        </div>
      )
    }
  }
})
