import FeatureDist from 'components/featuredist-chart/component'
import IndividualImportance from 'components/individual_importance-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import React from 'react'
import ResponseDist from 'components/response-chart/component'

export default React.createClass({
  getInitialState: function() {
    return {
      featureSelected: null,
      selected_entity_id: null,
      selected_score: null,
      selected_label: null,
      test_button: true
    }
  },

  handleOnValueClick: function(data) {
    this.setState({ featureSelected: data.feature })
  },

  handleTestSet: function() {
    this.setState({ test_button: true })
  },

  handleTrainingSet: function() {
    this.setState({ test_button: false })
  },

  handleOnClick: function(event) {
    this.setState({
      selected_entity_id: event.target.parentElement.id,
      selected_score: event.target.parentNode.getAttribute("value"),
      selected_label: event.target.parentNode.getAttribute("label")
    })
  },

  renderTrainTestButton: function() {
    return (
      <div>
        <h4>Feature Distribution - {this.state.test_button ? "Test Set" : "Training Set"}</h4>
        <p>{this.state.featureSelected}
          <button onClick={this.state.test_button ? this.handleTrainingSet : this.handleTestSet} id="SetButton" className="btn btn-xs float-right" >
            Toggle to {this.state.test_button ? "Training Set" : "Test Set"}
          </button>
        </p>
      </div>
    )
  },

  renderFeatureDist: function() {
    return (
      <div className="col-md-8">
        {this.renderTrainTestButton()}
        <FeatureDist
          entity_id={this.state.selected_entity_id}
          modelId={this.props.modelId}
          testOrTrain={this.state.test_button ? "/feature_dist_test/" : "/feature_dist_train/"}
          featureSelected={this.state.featureSelected} />
      </div>
    )
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
        <div className="row">
        </div>
        <div className="col-md-3">
          <IndividualImportance
            modelId={this.props.modelId}
            asOfDate={this.props.asOfDate}
            onValueClick={this.handleOnValueClick}
            entity_id={this.state.selected_entity_id} />
        </div>
        <div className="col-md-1">
        </div>
        {this.state.featureSelected ? this.renderFeatureDist() : null}
      </div>
    )
  }
})
