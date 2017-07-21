import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      test_button: true,
      bins: 20,
      loading: false }
  },

  handleTestSet: function() {
    this.ajax_call_test()
    this.setState({test_button: true})
  },

  handleTrainingSet: function() {
    this.ajax_call_train()
    this.setState({test_button: false})
  },

  ajax_call_test: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/feature_dist_test/" + this.props.featureSelected + "/" + this.state.bins,
      success: function(result) {
        self.setState({
          data: result.results.series,
          loading: false
        })
      }
    })
  },

  ajax_call_train: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/feature_dist_train/" + this.props.featureSelected + "/" + this.state.bins,
      success: function(result) {
        self.setState({
          data: result.results.series,
          loading: false
        })
      }
    })
  },

  componentDidMount: function() {
    this.ajax_call_test()
  },

  componentDidUpdate: function(prevProps) {
    const self = this
    if (self.props.featureSelected !== prevProps.featureSelected) {
      if (this.state.test_button) {
        this.ajax_call_test()
      } else {
        this.ajax_call_train()
      }

    }
  },

  renderTrainTestButton: function() {
    if (this.state.test_button) {
      return (
        <div>
            <h4>Feature Distribution - Test Set</h4>
            <p>{this.props.featureSelected}
              <button onClick={this.handleTrainingSet} id="SetButton" className="btn btn-xs float-right" >Toggle to Training Set</button>
            </p>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Feature Distribution - Training Set</h4>
          <p>{this.props.featureSelected}
            <button onClick={this.handleTestSet} id="SetButton" className="btn btn-xs float-right" >Toggle to Test Set</button>
          </p>
        </div>
      )
    }
  },

  render: function() {
    if(this.state.loading) {
      return (
        <div>
          {this.renderTrainTestButton()}
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          {this.renderTrainTestButton()}
          {
          React.createElement(NVD3Chart, {
            type:"lineChart",
            datum: this.state.data,
            containerStyle:{ width: "650px", height: "400px" },
            x: function(d) { return d[0] },
            y: function(d) { return d[1] },
            options:{
              showValues: true,
              showControls: true,
              showDistX: true,
              showDistY: true,
              useInteractiveGuideline: true,
              duration: 500,
              xAxis: { tickFormat: d3.format('.02f'), axisLabel: 'Feature Value' },
              yAxis: { tickFormat: d3.format('.02f'), axisLabel: 'P(X|Y=Label)' },
              color: d3.scale.category10().range()
            }
          })
          }
        </div>
      )
    }
  }
})
