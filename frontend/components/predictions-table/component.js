import React from 'react'
import Reactable from 'reactable'

export default React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: true,
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
            loading: false
          })
        }
      })
    }
  },
  render: function() {
    if(this.state.loading) {
      return (
        <div>
          <h4>Prediction Table</h4>
          <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Prediction Table</h4>
          <Reactable.Table
            className="table"
            sortable
            pageButtonLimit={5}
            itemsPerPage={10}>
            {this.state.data.map((entry, i) =>
              <Reactable.Tr
                data={entry}
                id={entry.entity_id}
                value={entry.score}
                onClick={this.props.onClick} />)}
          </Reactable.Table>
        </div>
      )
    }
  }
})

