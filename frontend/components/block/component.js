import d3 from 'd3'
import React from 'react'

export default React.createClass({
        getDefaultProps: function() {
          return {
            width: 20,
            height: 20,
            x: 0,
            y: 0,
            className: "cell cell-border"
          }
        },

        render: function() {
          var cellSize=12;
          return (
            <rect fill={this.props.color}
              width={this.props.width} height={this.props.height}
              className={this.props.className}
              x={this.props.xloc} y={this.props.yloc} />
          );
        }
      });
