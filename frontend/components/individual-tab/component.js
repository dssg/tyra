import FeatureBlock from 'components/feature-block/component'
import PredictionsTable from 'components/predictions-table/component'
import ResponseDist from 'components/response-chart/component'
import React from 'react'

export default React.createClass({
  getInitialState: function() {
    return {
      selected_entity_id: null,
      selected_score: null
    }
  },

  handleOnClick: function(event) {
    this.setState({
      selected_entity_id: event.target.parentElement.id,
      selected_score: event.target.parentNode.getAttribute("value")
    })
  },

  render: function() {
    return (
      <div>
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
            selectedScore={this.state.selected_score}
            selectedId={this.state.selected_entity_id} >
          </ResponseDist>
        </div>
        <div className="col-md-12">
          <FeatureBlock modelId={this.props.modelId} />
        </div>
      </div>
    )
  }
})
