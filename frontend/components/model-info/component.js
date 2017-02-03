import d3 from 'd3'
import NVD3Chart from 'react-nvd3'
import React from 'react'

export default React.createClass({
    render: function() {
      return (
        <div>
          <h3><strong>Model {this.props.modelId}</strong></h3>
        </div>
      )
    }
})
