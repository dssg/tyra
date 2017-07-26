import {
  Crosshair,
  DiscreteColorLegend,
  HorizontalGridLines,
  LineSeries,
  makeWidthFlexible,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis'
import Highlight from 'components/highlight-area/component'
import React from 'react'
import { zip } from 'ramda'


const FlexibleXYPlot = makeWidthFlexible(XYPlot)
const style = { "verticalAlign": "middle" }
const colors = ['#1f77b4', '#ff7f0e']

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: true,
      lastDrawLocation: null,
      crosshairValues: []
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
        url: "/evaluations/" + this.props.modelId + "/roc/" + this.props.asOfDate,
        success: function(result) {
          zip(colors, result.results).map(function(x) {x[1].color=x[0]})
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
      const { data, lastDrawLocation } = this.state
      return (
        <div>
          <h3>&nbsp;</h3>
          <h4>Receiver Operating Characteristic Curve</h4>
          <div className="row">
            <div className="legend">
              <div className="col-lg-6">
                <button style={style} className="btn btn-xs" onClick={() => {
                  this.setState({ lastDrawLocation: null })
                }}>
                  Reset Zoom
                </button>
              </div>

              <DiscreteColorLegend
                orientation="horizontal"
                width={120}
                items={data} />
            </div>
          </div>
          <FlexibleXYPlot
            animation
            onMouseLeave={this.handleOnMouseLeave}
            xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
            height={300}>
            <HorizontalGridLines />
            <YAxis
              title={"True Positive Rate"} />
            <XAxis
              title={"False Positive Rate"} />

            <Highlight onBrushEnd={(area) => {
              this.setState({
                lastDrawLocation: area
              })
            }} />

            <LineSeries
              key={data[0].title}
              data={data[0].data}
              color={data[0].color}
              onNearestX={this.handleOnNearestX} />

            <LineSeries
              key={data[1].title}
              data={data[1].data}
              color={data[1].color} />

            <Crosshair values={this.state.crosshairValues} />
          </FlexibleXYPlot>
        </div>
      )
    }
  }
})
