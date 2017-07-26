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
import React from 'react'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)


export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: true,
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
        url: "/evaluations/" + this.props.modelId + "/response_dist/" + this.props.asOfDate,
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
      const { data } = this.state
      return (
        <div>
          <h4>Response Distribution</h4>
          <FlexibleXYPlot
            animation
            margin={{ left: 30, top: 30, bottom: 5 }}
            xDomain={[0, 1]}
            onMouseLeave={this.handleOnMouseLeave}
            height={320}>
            <HorizontalGridLines />
            <YAxis
              title={"Proportion (%)"} />
            <XAxis
              title={"Predicted Score"} />

            <LineSeries
              key={data[0].title}
              data={data[0].data}
              onNearestX={this.handleOnNearestX} />

            <Crosshair values={this.state.crosshairValues} />
          </FlexibleXYPlot>

        </div>
      )
    }
  }
})
