import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: false,
      sortflag: true,
      button_value: 'Sort by Name'
    }
  },
  componentDidMount: function() {
    const self = this
    self.setState({ loading: true })
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/feature_importance",
      success: function(result) {
        self.setState({
          data: result.results,
          loading: false
        })
      }
    })
  },
  handleSort: function() {
    const newdata = this.state.data
    if (!this.state.sortflag) {
      newdata[0].values.sort(function(x, y) {return d3.descending(x.value, y.value)})
      this.setState({ data: newdata, sortflag: true, button_value: 'Sort by Name' })
    } else {
      newdata[0].values.sort(function(x, y) {return d3.ascending(x.label, y.label)})
      this.setState({ data: newdata, sortflag: false, button_value: 'Sort by Importance' })
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
        <div>
          <h4>Feature Importance</h4>
          <button onClick={this.handleSort}>{this.state.button_value}</button>
          {
            React.createElement(NVD3Chart, {
              type:"multiBarHorizontalChart",
              datum: this.state.data,
              x: function(d) { return d.label },
              y: function(d) { return d.value },
              containerStyle: { width: "800px", height: "500px" },
              options:{
                showValues: true,
                showControls: true,
                duration: 500,
                tooltip: { enabled: true },
                yAxis: {
                  tickformat: function(d) {return d3.format('.4f')}
                }
              }
            })
          }
        </div>
      )
    }
  }
})


