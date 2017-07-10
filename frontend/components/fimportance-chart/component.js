import d3 from 'd3'
import map from 'ramda'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, Hint, HorizontalBarSeries} from 'react-vis'
import NVD3Chart from 'react-nvd3'
import React from 'react'


const NUMLIST = [5, 10, 15, 20]

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false,
      value: null,
      numOfFeatures: 10,
    }
  },
  _rememberValue: function(value) {
    this.setState({value: value})
  },
  _forgetValue: function() {
    this.setState({value: null})
  },
  componentDidMount: function() {
    this.ajax_call()
  },
  ajax_call: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/feature_importance/" + self.state.numOfFeatures,
      success: function(result) {
        self.setState({
          data: result.results.map(d => ({x: d.value, y: d.label}))
                              .sort(function(x, y) {return d3.ascending(x.x, y.x)}),
          loading: false
        })
      }
    })
  },
  handleChangeNumOfFeatures: function(event) {
    this.setState({ numOfFeatures: event.target.value })
  },
  componentDidUpdate: function(prevProps, prevState) {
    const self = this
    if (self.state.numOfFeatures !== prevState.numOfFeatures) {
      this.ajax_call()
    }
  },
  render: function() {
    const {value} = this.state;
    if(this.state.loading) {
      return (
        <div>
          <h4>Feature Importance</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Feature Importance</h4>
          <div className="row">
            <select
              value={this.state.numOfFeatures}
              onChange={this.handleChangeNumOfFeatures}>
              {NUMLIST.map(function(num) {
                return <option key={num} value={num}>{num}</option>
              })}
            </select>
            &nbsp; curve(s) to show
          </div>
          <XYPlot
            margin={{left: 300}}
            width={600}
            height={400}
            color="#1f77b4"
            yType="ordinal">
            <XAxis />
            <YAxis />
            <HorizontalGridLines />
            <HorizontalBarSeries
              onValueMouseOver={this._rememberValue}
              onValueMouseOut={this._forgetValue}
              data={this.state.data} />
            { value ? <Hint value={value}/> : null }
          </XYPlot>
        </div>
      )
    }
  }
})
