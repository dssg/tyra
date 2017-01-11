import d3 from 'd3'
import React from 'react'
import ReactFauxDOM from 'react-faux-dom'

export default React.createClass({
  getDefaultProps: function() {
    return {
      width: 1000,
      height: 1000
    }
  },
  getInitialState: function() {
    return {
      data: generate_fake_corr_matrix(10),
      mouseOver: false
    }
  },
  render: function() {
    const self = this
    const cellSize = 50
    const margin = { top: 1, right: 1, bottom: 1, left: 1 }
    const colors_scale = d3.scale.linear().range(["white", "steelblue"])
    const rowLabel = ['model1', 'model2', 'model3', 'model4', 'model5', 'model6', 'model7', 'model8', 'model9', 'model10' ]

    let svg = d3.select(ReactFauxDOM.createElement('svg'))
      .attr({
        width: 800,
        height:800
      })
      .attr("transform", "translate(" + 200 + ", " + 10 + ")")


    svg.append('g').attr('class', 'g3')
    .selectAll(".cellg")
    .data(self.state.data)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return d[0]*cellSize + 50
    })
    .attr('y', function(d) {
      return d[1]*cellSize + 50
    })
    .attr("class", function(d) {
      if (self.state.mouseOver) {
        return "cell cell-border cr" + (d[0]-1) +" cc" + (d[1]-1)
      } else {
        return "cell cell-border cr" + (d[0]-1) +" cc" + (d[1]-1)
      }
    })
    .attr({
      width: cellSize - margin.left - margin.right,
      height: cellSize - margin.top - margin.bottom
    })
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    .style('fill', function(d) {
      return colors_scale(d[2])
    })
    .on('mouseover', function() {
      self.setState({
        mouseOver: true
      })
    })
    .on('mouseout', function() {
      self.setState({
        mouseOver: false
      })
    })


    let legend = svg.selectAll(".legend")
      .data(colors_scale.ticks(8).slice(1).reverse())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(" + (650 + 20) + ", " + (50 + i * 20) + ")"
      })

    legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", colors_scale)

    legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String)

    svg.append("text")
      .attr("class", "label")
      .attr("x", 650 + 20)
      .attr("y", 25)
      .attr("dy", "1.0em")
      .text("Jaccard Similarity")

    const rowLabels = svg.append("g")
      .selectAll(".rowLabelg")
      .data(rowLabel)
      .enter()
      .append("text")
      .text(function(d) {
        return d
      })
      .attr("x", 0)
      .attr("y", function(d, i) {
        return (i+1) * cellSize + 50
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(80," + cellSize / 1.5 + ")")
      .attr("class", function(d, i) {
        return "rowLabel mono r" + i
      })

    const colLabels = svg.append("g")
      .selectAll(".colLabelg")
      .data(rowLabel)
      .enter()
      .append("text")
      .text(function(d) {
        return d
      })
      .attr("x", 0)
      .attr("y", function(d, i) {
        return (i+1) * cellSize +50
      })
      .style("text-anchor", "left")
      .attr("transform", "translate("+cellSize/2 + ", 80) rotate (-90)")
      .attr("class", function(d, i) {
        return "colLabel mono c" + i
      })

    return svg.node().toReact()
  }
})

function generate_fake_corr_matrix(n) {
  const corr_matrix = []
  const random = Math.random
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      corr_matrix.push([i, j, random()])
    }
  }
  return corr_matrix
}
