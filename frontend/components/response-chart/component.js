import {
  Crosshair,
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

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      bins: 20,
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
        url: "/evaluations/" + this.props.modelId + "/response_dist/" + this.props.asOfDate + '/' + this.state.bins,
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
          <h4>Response Distribution</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      const { data, lastDrawLocation } = this.state
      return (
        <div>
          <h4>Response Distribution</h4>
          <button className="btn btn-xs" onClick={() => {
            this.setState({ lastDrawLocation: null })
          }}>
            Reset Zoom
          </button>
          <FlexibleXYPlot
            animation
            margin={{ left: 30, top: 30 }}
            xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right] || [0, 1]}
            onMouseLeave={this.handleOnMouseLeave}
            height={330}>
            <HorizontalGridLines />
            <YAxis
              title={"Proportion (%)"} />
            <XAxis
              title={"Predicted Score"} />

            <Highlight onBrushEnd={(area) => {
              this.setState({
                lastDrawLocation: area
              })
            }} />

            <LineSeries
              key={data.title}
              data={data.data}
              onNearestX={this.handleOnNearestX} />

            <LineSeries
              key={"selected"}
              data={[{x: this.props.selectedScore, y: 100}, {x: this.props.selectedScore, y: 0}]}
              color={"#2E8B57"} />

            <Crosshair values={this.state.crosshairValues} />
          </FlexibleXYPlot>

        </div>
      )
    }
  }
})
