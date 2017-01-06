import d3 from 'd3'
import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div>
      <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});
