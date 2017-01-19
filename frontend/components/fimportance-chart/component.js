import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      sortflag: true,
      button_value: 'Sort by Name'
    }
  },
  componentDidMount: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/feature_importance",
      success: function(result) {
        self.setState({
          data: result.results,
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
    return (
      <div>
        <button onClick={this.handleSort}>{this.state.button_value}</button>
        {
          React.createElement(NVD3Chart, {
            type:"multiBarHorizontalChart",
            datum: this.state.data,
            x: 'label',
            y: 'value',
            containerStyle: { width: "800px", height: "500px" },
            options:{
              showValues: true,
              showControls: true,
              duration: 500,
              tooltip: { enabled: true }
            }
          })
        }
      </div>
    )
  }
})


