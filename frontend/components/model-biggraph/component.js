import React from 'react'
import ModelSelectGraph from 'components/model-selectgraph/component'


export default React.createClass({
  getInitialState: function() {
    return { numOfModelToShow: [1, 3, 5, 10] }
  },
  renderSelectGraph: function() {
    return (
      <ModelSelectGraph setModelId={this.props.setModelId}
                        setAsOfDate={this.props.setAsOfDate}
                        startDate={this.props.startDate}
                        asOfDate={this.props.asOfDate}
                        searchId={this.props.searchId}
                        metrics = {this.props.metrics} />
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
            <select >
              {this.state.numOfModelToShow.map(function(num) {
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

