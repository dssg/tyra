import IndividualImportance from 'components/individual_importance-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import React from 'react'
import ResponseDist from 'components/response-chart/component'

export default React.createClass({
  getInitialState: function() {
    return {
      selectedEntityId: null,
      selectedScore: null,
      selectedLabel: null,
    }
  },

  handleOnClick: function(event) {
    this.setState({
      selectedEntityId: event.target.parentElement.id,
      selectedScore: event.target.parentNode.getAttribute("value"),
      selectedLabel: event.target.parentNode.getAttribute("label")
    })
  },

  render: function() {
    return (
      <div>
        <h5>Entity ID: <strong>{this.state.selectedEntityId}</strong> &nbsp;
            Score: <strong>{this.state.selectedScore}</strong> &nbsp;
            Label: <strong>{this.state.selectedLabel}</strong> &nbsp;
        </h5>
        <div className="col-md-2">
          <PredictionsTable
            modelId={this.props.modelId}
            asOfDate={this.props.asOfDate}
            onClick={this.handleOnClick} />
        </div>
        <div className="col-md-1">
        </div>
        <div className="col-md-9">
          <ResponseDist
            modelId={this.props.modelId}
            asOfDate={this.props.asOfDate}
            selectedScore={this.state.selectedScore}>
          </ResponseDist>
        </div>
        <div className="col-md-12">
          <IndividualImportance
            modelId={this.props.modelId}
            asOfDate={this.props.asOfDate}
            entityId={this.state.selectedEntityId} />
        </div>
      </div>
    )
  }
})
