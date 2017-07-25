import React from 'react'

export default React.createClass({
  showAsOfDate: function() {
    return <span> - Test Results as of {this.props.asOfDate}</span>
  },
  render: function() {
    return (
      <div>
        <h4><strong>Model {this.props.modelId}</strong> {this.props.asOfDate ? this.showAsOfDate() : null}</h4>
      </div>
    )
  }
})
