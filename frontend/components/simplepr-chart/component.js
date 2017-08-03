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


const FlexibleXYPlot = makeWidthFlexible(XYPlot)
const style = { "verticalAlign": "middle" }

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
    this.setState({ crosshairValues: [this.state.data.data[index]] })
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
        url: "/evaluations/" + this.props.modelId + "/simple_precision_recall/" + this.props.asOfDate,
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
          <h4>Precision Recall Curve</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      const { data, lastDrawLocation } = this.state
      return (
        <div>
          <h4>Precision Recall Curve</h4>
          <div className="row">
            <div className="legend">
              <div className="col-lg-6">
                <button style={style} className="btn btn-xs" onClick={() => {
                  this.setState({ lastDrawLocation: null })
                }}>
                  Reset Zoom
                </button>
              </div>

            </div>
          </div>
          <FlexibleXYPlot
            animation
            onMouseLeave={this.handleOnMouseLeave}
            xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
            height={300}>
            <HorizontalGridLines />
            <YAxis
              title={"Precision"} />
            <XAxis
              title={"Recall"} />

            <Highlight onBrushEnd={(area) => {
              this.setState({
                lastDrawLocation: area
              })
            }} />


            <LineSeries
              key={data.title}
              data={data.data}
              color={"#1f77b4"}
              onNearestX={this.handleOnNearestX} />

            <Crosshair values={this.state.crosshairValues} />
          </FlexibleXYPlot>
        </div>
      )
    }
  }
})

