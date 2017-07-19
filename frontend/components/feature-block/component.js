import FeatureDist from 'components/featuredist-chart/component'
import FeatureImportanceChart from 'components/fimportance-chart/component'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      featureSelected: null
    }
  },

  handleDefaultFeatureSelected: function(feature) {
    this.setState({ featureSelected: feature })
  },

  handleOnValueClick: function(datapoint) {
    this.setState({ featureSelected: datapoint.y })
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
            <FeatureDist
              modelId={this.props.modelId}
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
            onValueClick={this.handleOnValueClick}
            handleDefaultFeatureSelected={this.handleDefaultFeatureSelected}>
          </FeatureImportanceChart>
        </div>
      </div>
    )
  }
})
