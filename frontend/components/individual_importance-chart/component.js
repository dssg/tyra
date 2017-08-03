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
      url: "/evaluations/" + this.props.modelId + "/individual_feature_importance/" + this.props.entity_id + '/' + this.props.asOfDate,
      success: function(result) {
        self.setState({
          data: reverse(values(result.results[0])).map(
            (f, index) => {
              return { x: 1, y: index*5, label: "risk" + index.toString(), color: 20-5*index,feature: f }
            }
          ),
          data_array: reverse(values(result.results[0])),
          loading: false
        })
      }
    })
  },

  componentDidUpdate: function(prevProps) {
    const self = this
    if (self.props.entity_id !== prevProps.entity_id) {
      this.ajax_call()
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h4>Individual Feature Importance</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else if (this.state.data.length === 0) {
      return (
        <div>
          <h4>Individual Feature Importance</h4>
          <strong>No data. </strong>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Individual Feature Importance</h4>
          <XYPlot
            margin={{ left: 0 }}
            width={320}
            height={320}>
            <XAxis hideTicks />
            <YAxis
              hideLine left={320}
              tickValues={[0, 5, 10, 15, 20]}
              tickFormat={(v) => this.state.data_array[v/5]} />
            <HeatmapSeries
              onValueClick={this.props.onValueClick}
              opacity={0.45}
              style={{ 'cursor': 'pointer' }}
              data={this.state.data} />
          </XYPlot>
        </div>
      )
    }
  }
})
