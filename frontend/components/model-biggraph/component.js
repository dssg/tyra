import ModelSelectGraph from 'components/model-selectgraph/component'
import React from 'react'

const NUMLIST = [5, 10, 15, 20]
const MODELCOMMENT = [
  'all',
  'with accident as adverse',
  'without accident as adverse',
  'sworn officers correct month feature mix',
  'sworn officers correct month 1m 3y',
  'frequency sworn officers',
  'sworn officers rf test',
  'debug',
  'sworn officers correct month mix 1m 6y',
  'sworn officers correct month 1y',
  'frequency sworn officers 6m',
  'test run',
  'sworn officers',
  'sworn officers correct month 1m 6y']

export default React.createClass({
  getInitialState: function() {
    return { numOfModelGroupsToShow: 5, labelOfModelGroups: "all", labelList: [] }
  },
  handleNumOfModelGroupsToShow: function(event) {
    this.setState({ numOfModelGroupsToShow: event.target.value })
  },
  handleLabelOfModelGroups: function(event) {
    this.setState({ labelOfModelGroups: event.target.value })
  },
  getModelComment: function() {
    let self = this
    const params = { timestamp: self.props.startDate.format('YYYY-MM-DD') }
    $.ajax({
      type: "POST",
      url: "/evaluations/model_comments",
      data: $.param(params),
      success: function(result) {
        const comment_list = result.results
        comment_list.unshift("all")
        self.setState({ labelList: comment_list })
      }
    })
  },
  componentWillMount: function() {
    this.getModelComment()
  },
  renderSelectGraph: function() {
    return (
      <ModelSelectGraph
        setModelId={this.props.setModelId}
        setAsOfDate={this.props.setAsOfDate}
        startDate={this.props.startDate}
        asOfDate={this.props.asOfDate}
        searchId={this.props.searchId}
        metrics={this.props.metrics}
        numOfModelGroupsToShow={this.state.numOfModelGroupsToShow}
        labelOfModelGroups={this.state.labelOfModelGroups} />
    )
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-8">
          {this.renderSelectGraph()}
        </div>
        <div className="col-sm-4 sidenav " style={{ textAlign:"left" }}>
          <div className="row">
            <select
              value={this.state.numOfModelGroupsToShow}
              onChange={this.handleNumOfModelGroupsToShow}>
              {NUMLIST.map(function(num) {
                return <option key={num} value={num}>{num}</option>
              })}
            </select>
            &nbsp; curve(s) to show
          </div>
          <div className="row">
            model comment: <br />
            <select
              value={this.state.labelOfModelGroups}
              onChange={this.handleLabelOfModelGroups}>
              {this.state.labelList.map(function(comment) {
                return <option key={comment} value={comment}>{comment}</option>
              })}
            </select>
          </div>
        </div>
      </div>
    )
  }
})

