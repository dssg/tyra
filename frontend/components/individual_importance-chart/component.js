import { Hint, HeatmapSeries, HorizontalGridLines, XAxis, XYPlot, YAxis } from 'react-vis'
import React from 'react'

const WORDS = ["dispatch_id_p1m_dispatchtype_theft_sum",
               "dispatch_id_p1y_dispatchtype_intoxicated_sum",
               "dispatch_id_p1y_dispatchtype_suspicious_sum",
               "dispatch_id_p1w_dispatchtype_domestic_disturb_sum",
               "arrests_id_p1y_arrestson_sat_avg",
               ]

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
      url: "/evaluations/" + this.props.modelId + "/individual_feature_importance/" + this.props.entity_id + '/' + this.props.asOfDate,
      success: function(result) {
        self.setState({
          data: result.results,
          loading: false
        })
        console.log(result.results)
      }
    })
  },

  componentDidMount: function() {
    this.ajax_call()
  },

  componentDidUpdate: function(prevProps, prevState) {
    const self = this
    if (self.props.entity_id !== prevProps.entity_id) {
      this.ajax_call()
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h4>Feature Importance</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <XYPlot
          width={340}
          height={340}>
          <XAxis hideTicks />
          <HeatmapSeries
            className="heatmap-series-example"
            opacity={0.7}
            onValueClick={(d) => {console.log(d)}}
            data={[
              {x: 1, y: 0, label: "A", color: 12},
              {x: 1, y: 5, label: "B", color: 10},
              {x: 1, y: 10, label: "C", color: 8},
              {x: 1, y: 15, label: "D", color: 5},
              {x: 1, y: 20, label: "E", color: 1}]} />
          <YAxis hideLine left={290} tickValues={[0, 5, 10, 15, 20]} tickFormat={v => WORDS[v/5]} />
        </XYPlot>
      )
    }
  }
})
