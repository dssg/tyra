import { HeatmapSeries, XAxis, XYPlot, YAxis } from 'react-vis'
import { reverse, values } from 'ramda'
import React from 'react'


export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false,
    }
  },

  ajax_call: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/individual_feature_importance/" + this.props.entityId + '/' + this.props.asOfDate,
      success: function(result) {
        self.setState({
          data: reverse(values(result.results[0])),
          loading: false
        })
      }
    })
  },

  componentDidUpdate: function(prevProps) {
    const self = this
    if (self.props.entityId !== prevProps.entityId) {
      this.ajax_call()
    }
  },

  renderLoader: function() {
    return (
      <div>
        <h4>Individual Feature Importance</h4>
        <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
      </div>
    )
  },

  renderNoData: function() {
    return (
      <div>
        <h4>Individual Feature Importance</h4>
        <strong>No data. </strong>
      </div>
    )
  },

  renderHeatSeries: function() {
    return (
      <div>
        <h4>Individual Feature Importance</h4>
        <XYPlot
          margin={{ left: 0 }}
          width={320}
          height={320}>
          <XAxis hideTicks />
          <HeatmapSeries
            opacity={0.7}
            data={[
              { x: 1, y: 0, label: "risk1", color: 20 },
              { x: 1, y: 5, label: "risk2", color: 15 },
              { x: 1, y: 10, label: "risk3", color: 10 },
              { x: 1, y: 15, label: "risk4", color: 5 },
              { x: 1, y: 20, label: "risk5", color: 0 }]} />
          <YAxis hideLine left={320} tickValues={[0, 5, 10, 15, 20]} tickFormat={(v) => this.state.data[v/5]} />
        </XYPlot>
      </div>
    )
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          { this.renderLoader() }
        </div>
      )
    } else if (this.state.data.length === 0) {
      return (
        <div>
          { this.renderNoData() }
        </div>
      )
    } else {
      return (
        <div>
          { this.renderHeatSeries() }
        </div>
      )
    }
  }
})
