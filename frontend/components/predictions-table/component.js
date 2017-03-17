import React from 'react'
import Reactable from 'reactable'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
    }
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
        url: "/evaluations/" + this.props.modelId + "/model_result/" + this.props.asOfDate,
        success: function(result) {
          self.setState({
            data: result.results,
          })
        }
      })
    }
  },
  render: function() {
    return (
      <Reactable.Table
        className="table"
        data={this.state.data}
        pageButtonLimit={5}
        itemsPerPage={15} />
    )
  }
})
