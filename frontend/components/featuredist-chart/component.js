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
import d3 from 'd3'
import Highlight from 'components/highlight-area/component'
import React from 'react'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)
const style = { "verticalAlign": "middle" }
const colors = ['#1f77b4', '#ff7f0e']

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      lastDrawLocation: null,
      bins: 20,
      loading: false,
      crosshairValues: []
    }
  },

  handleOnNearestX: function(value, { index }) {
    this.setState({ crosshairValues: this.state.data.map((s) => s.data[index]) })
  },

  handleOnMouseLeave: function() {
    this.setState({ crosshairValues: [] })
  },

  ajax_call: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: this.getUrl(this.props.modelId, this.props.isTest, this.props.featureSelected, this.props.asOfDate),
      success: function(result) {
        self.setState({
          data: result.results.map((row, index) => {
            return { ...row, color: colors[index] }
          }),
          loading: false
        })
      }
    })
  },

  getUrl: function(modelId, isTest, featureSelected, asOfDate) {
    if (isTest) {
      return "/evaluations/" + modelId + /feature_dist_test/ + featureSelected + "/" + asOfDate
    } else {
      return "/evaluations/" + modelId + /feature_dist_train/ + featureSelected
    }
  },

  componentDidMount: function() {
    this.ajax_call()
  },

  componentDidUpdate: function(prevProps) {
    const self = this
    if (self.props.featureSelected !== prevProps.featureSelected ||
        self.props.isTest !== prevProps.isTest ||
        self.props.entityId !== prevProps.entityId ||
        self.props.isTest && self.props.asOfDate !== prevProps.asOfDate) {
      this.ajax_call()
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      const { data, lastDrawLocation } = this.state
      return (
        <div>
          <div className="row">
            <div className="legend">
              <div className="col-lg-6">
                <strong>{this.props.featureSelected}</strong>
              </div>
            </div>
          </div>
          <div className="col-lg-10">
            <FlexibleXYPlot
              animation
              onMouseLeave={this.handleOnMouseLeave}
              xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
              height={this.props.width}>
              <HorizontalGridLines />
              <YAxis title={"P(X|Y=Label)"} />
              <XAxis title={"Feature Value"} />
              <Highlight onBrushEnd={(area) => {
                this.setState({
                  lastDrawLocation: area
                })
              }} />

              {data.map((entry) => (
                <LineSeries
                  key={entry.title}
                  data={entry.data}
                  curve={'curveMonotoneX'}
                  color={entry.color}
                  onNearestX={this.handleOnNearestX} />
              ))}
              <Crosshair values={this.state.crosshairValues} />
            </FlexibleXYPlot>
          </div>
          <div className="col-lg-2">
            <button style={style} className="btn btn-xs" onClick={() => {
              this.setState({ lastDrawLocation: null })
            }}>
              Reset Zoom
            </button>
            <DiscreteColorLegend
              orientation="vertical"
              items={data} />
          </div>
        </div>
      )
    }
  }
})
