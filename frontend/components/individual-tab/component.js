import FeatureDist from 'components/featuredist-chart/component'
import IndividualImportance from 'components/individual_importance-chart/component'
import PredictionsTable from 'components/predictions-table/component'
import React from 'react'
import ResponseDist from 'components/response-chart/component'

export default React.createClass({
  getInitialState: function() {
    return {
      featureSelected: null,
      testButton: false,
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
      selectedLabel: event.target.parentNode.getAttribute("label"),
    })
  },

  handleChange: function(feature) {
    this.setState({ featureSelected: feature })
  },

  renderTrainTestButton: function() {
    return (
      <div>
        <h4>Feature Distribution - {this.state.testButton ? "Test Set" : "Training Set"}</h4>
      </div>
    )
  },

  renderFeatureDist: function() {
    return (
      <div className="col-md-8">
        {this.renderTrainTestButton()}
        <FeatureDist
          entityId={this.state.selectedEntityId}
          modelId={this.props.modelId}
          isTest={this.state.testButton}
          width={320}
          featureSelected={this.state.featureSelected} />
      </div>
    )
  },

  renderIndividualFeatureImportance: function() {
    return (
      <div className="col-md-3">
        <IndividualImportance
          modelId={this.props.modelId}
          asOfDate={this.props.asOfDate}
          onValueClick={this.handleOnValueClick}
          onChange={this.handleChange}
          entityId={this.state.selectedEntityId} />
      </div>
    )
  },

  renderHead: function() {
    return (
      <h5>Entity ID: <strong>{this.state.selectedEntityId}</strong> &nbsp;
        Score: <strong>{this.state.selectedScore}</strong> &nbsp;
        Label: <strong>{this.state.selectedLabel}</strong> &nbsp;
      </h5>
    )
  },

  render: function() {
    return (
      <div>
        {this.renderHead()}
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
        {this.renderIndividualFeatureImportance()}
        {this.state.featureSelected ? this.renderFeatureDist() : null}
      </div>
    )
  }
})
