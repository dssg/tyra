import {
  Crosshair,
  DiscreteColorLegend,
  HorizontalGridLines,
  LineSeries,
  makeWidthFlexible,
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis'
import { map, prop, zip } from 'ramda'
import Highlight from 'components/highlight-area/component'
import React from 'react'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)
const colors = ['#ffc0cb', '#1f77b4', '#ff7f0e']
const style = { "verticalAlign": "middle" }

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: true,
      crosshairValues: [],
      lastDrawLocation: null,
      ymax: null,
    }
  },

  handleOnNearestX: function(value, { index }) {
    this.setState({ crosshairValues: this.state.data.map((s) => s.data[index]) })
  },

  handleOnMouseLeave: function() {
    this.setState({ crosshairValues: [] })
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
    if (this.props.asOfDate !== null) {
      $.ajax({
        type: "GET",
        url: "/evaluations/" + this.props.modelId + "/response_dist/" + this.props.asOfDate,
        success: function(result) {
          zip(colors, result.results).map(function(x) {x[1].color=x[0]})
          self.setState({
            data: result.results,
            loading: false,
            ymax: Math.max.apply(null, map(prop('y'), result.results[0].data)) + 0.05
          })
        }
      })
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h4>Response Distribution</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      const { data, lastDrawLocation } = this.state
      return (
        <div>
          <h4>Response Score Distribution</h4>
          <div className="row">
            <div className="legend">
              <div className="col-lg-2">
                <button style={style} className="btn btn-xs" onClick={() => {
                  this.setState({ lastDrawLocation: null })
                }}>
                  Reset Zoom
                </button>
              </div>

              <DiscreteColorLegend
                orientation="horizontal"
                width={250}
                items={data} />
            </div>
          </div>
          <FlexibleXYPlot
            animation
            margin={{ left: 30, top: 30 }}
            yDomain={[0, this.state.ymax]}
            xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right] || [0, 1]}
            onMouseLeave={this.handleOnMouseLeave}
            height={330}>
            <HorizontalGridLines />
            <YAxis
              title={"Fraction of Test Set"} />
            <XAxis
              title={"Predicted Score"} />


            <Highlight onBrushEnd={(area) => {
              this.setState({
                lastDrawLocation: area
              })
            }} />

            {data.map((entry) => (
              <VerticalBarSeries
                key={entry.title}
                data={entry.data}
                color={entry.color}
                opacity={0.6} />
            ))}

            <LineSeries
              key={"selected"}
              data={[{ x: this.props.selectedScore, y: this.state.ymax }, { x: this.props.selectedScore, y: 0 }]}
              color={"#2E8B57"} />

            <Crosshair values={this.state.crosshairValues} />
          </FlexibleXYPlot>

        </div>
      )
    }
  }
})
