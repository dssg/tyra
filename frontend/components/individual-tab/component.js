import IndividualImportance from 'components/individual_importance-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import React from 'react'
import ResponseDist from 'components/response-chart/component'

export default React.createClass({
  getInitialState: function() {
    return {
      selected_entity_id: null,
      selected_score: null,
      selected_label: null,
    }
  },

  handleOnClick: function(event) {
    this.setState({
      selected_entity_id: event.target.parentElement.id,
      selected_score: event.target.parentNode.getAttribute("value"),
      selected_label: event.target.parentNode.getAttribute("label")
    })
  },

  render: function() {
    return (
      <div>
        <h5>Entity ID: <strong>{this.state.selected_entity_id}</strong> &nbsp;
            Score: <strong>{this.state.selected_score}</strong> &nbsp;
            Label: <strong>{this.state.selected_label}</strong> &nbsp;
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
            selectedScore={this.state.selected_score}>
          </ResponseDist>
        </div>
        <div className="col-md-12">
          <IndividualImportance
            modelId={this.props.modelId}
            asOfDate={this.props.asOfDate}
            entity_id={this.state.selected_entity_id} />
        </div>
      </div>
    )
  }
})
