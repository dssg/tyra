import React from 'react'
import ModelSelectGraph from 'components/model-selectgraph/component'


export default React.createClass({
  numList: [5, 10, 15, 20],
  getInitialState: function() {
    return { numOfModelToShow: 5 }
  },
  handleNumOfModelToShow: function(event) {
    this.setState({numOfModelToShow: event.target.value})
  },
  renderSelectGraph: function() {
    return (
      <ModelSelectGraph setModelId={this.props.setModelId}
                        setAsOfDate={this.props.setAsOfDate}
                        startDate={this.props.startDate}
                        asOfDate={this.props.asOfDate}
                        searchId={this.props.searchId}
                        metrics = {this.props.metrics}
                        numOfModelToShow = {this.state.numOfModelToShow} />
            )
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-8">
          {this.renderSelectGraph()}
        </div>
        <div className="col-lg-4" style={{textAlign:"right"}}>
          <div className="row">
            <select value={this.state.numOfModelToShow} onChange={this.handleNumOfModelToShow}>
              {this.numList.map(function(num) {
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

