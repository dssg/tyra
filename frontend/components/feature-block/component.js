import FeatureDist from 'components/featuredist-chart/component'
import FeatureImportanceChart from 'components/fimportance-chart/component'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      featureSelected: null,
      test_button: true,
    }
  },

  handleOnValueClick: function(datapoint) {
    this.setState({ featureSelected: datapoint.y })
  },

  handleTestSet: function() {
    this.setState({ test_button: true })
  },

  handleTrainingSet: function() {
    this.setState({ test_button: false })
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

  shouldComponentUpdate: function(nextState) {
    if (this.state !== nextState) {
      return true
    }
    return false
  },

  render: function() {
    if(this.state.featureSelected) {
      return (
        <div>
          <div className="col-md-6">
            <FeatureImportanceChart
              modelId={this.props.modelId}
              onValueClick={this.handleOnValueClick}>
            </FeatureImportanceChart>
          </div>
          <div className="col-md-6">
            {this.renderTrainTestButton()}
            <FeatureDist
              modelId={this.props.modelId}
              testOrTrain={this.state.test_button ? "/feature_dist_test/" : "/feature_dist_train/"}
              featureSelected={this.state.featureSelected}>
            </FeatureDist>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div className="col-md-6">
          <FeatureImportanceChart
            modelId={this.props.modelId}
            onValueClick={this.handleOnValueClick}>
          </FeatureImportanceChart>
        </div>
      </div>
    )
  }
})
