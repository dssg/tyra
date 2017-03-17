import ModelSelectGraph from 'components/model-selectgraph/component'
import React from 'react'

const NUMLIST = [5, 10, 15, 20]

export default React.createClass({
  getInitialState: function() {
    return { numOfModelToShow: 5 }
  },
  handleNumOfModelToShow: function(event) {
    this.setState({ numOfModelToShow: event.target.value })
  },
  renderSelectGraph: function() {
    return (
      <ModelSelectGraph
        setModelId={this.props.setModelId}
        setAsOfDate={this.props.setAsOfDate}
        startDate={this.props.startDate}
        asOfDate={this.props.asOfDate}
        searchId={this.props.searchId}
        metrics={this.props.metrics}
        numOfModelToShow={this.state.numOfModelToShow} />
    )
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-8">
          {this.renderSelectGraph()}
        </div>
        <div className="col-lg-4" style={{ textAlign:"right" }}>
          <div className="row">
            <select value={this.state.numOfModelToShow} onChange={this.handleNumOfModelToShow}>
              {NUMLIST.map(function(num) {
                return <option key={num} value={num}>{num}</option>
              })}
            </select>
            &nbsp; curve(s) to show
          </div>
        </div>
      </div>
    )
  }
})

