import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      projectSelected: null,
      project: null,
    }
  },

  render: function() {
    return (
      <div className="col-md-4">
        <input
          type="submit"
          name="submit"
          onClick={() => {this.props.handleClick(this.props.project)}}
          className="btn btn-default btn-lg btn-block"
          value={this.props.project} />
      </div>
    )
  }
})
