import React from 'react'
import Reactable from 'reactable'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
    }
  },
  componentDidMount: function() {
    const self = this
    $.ajax({
      type: "GET",
      url: "/evaluations/" + this.props.modelId + "/model_result",
      success: function(result) {
        self.setState({
          data: result.results,
        })
      }
    })

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
