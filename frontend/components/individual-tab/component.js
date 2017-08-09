import FeatureDist from 'components/featuredist-chart/component'
import IndividualImportance from 'components/individual_importance-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import React from 'react'
import ResponseDist from 'components/response-chart/component'

export default React.createClass({
  getInitialState: function() {
    return {
      featureSelected: null,
      testButton: true,
      selectedEntityId: null,
      selectedScore: null,
      selectedLabel: null,
    }
  },

  handleOnValueClick: function(data) {
    this.setState({ featureSelected: data.feature })
  },

  handleTestSet: function() {
    this.setState({ testButton: true })
  },

  handleTrainingSet: function() {
    this.setState({ testButton: false })
  },

  handleOnClick: function(event) {
    this.setState({
      selectedEntityId: event.target.parentElement.id,
      selectedScore: event.target.parentNode.getAttribute("value"),
      selectedLabel: event.target.parentNode.getAttribute("label")
    })
  },

  renderTrainTestButton: function() {
    return (
      <div>
        <h4>Feature Distribution - {this.state.testButton ? "Test Set" : "Training Set"}</h4>
        <p>{this.state.featureSelected}
          <button onClick={this.state.testButton ? this.handleTrainingSet : this.handleTestSet} id="SetButton" className="btn btn-xs float-right" >
            Toggle to {this.state.testButton ? "Training Set" : "Test Set"}
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
          entity_id={this.state.selectedEntityId}
          modelId={this.props.modelId}
          testOrTrain={this.state.testButton ? "/feature_dist_test/" : "/feature_dist_train/"}
          featureSelected={this.state.featureSelected} />
      </div>
    )
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
        <div className="row">
        </div>
        <div className="col-md-3">
          <IndividualImportance
            modelId={this.props.modelId}
            asOfDate={this.props.asOfDate}
            onValueClick={this.handleOnValueClick}
            entityId={this.state.selectedEntityId} />
        </div>
        <div className="col-md-1">
        </div>
        {this.state.featureSelected ? this.renderFeatureDist() : null}
      </div>
    )
  }
})
