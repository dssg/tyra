import { addIndex, concat, curry, map, mergeAll, values } from 'ramda'
import React from 'react'
import ReactTable from 'react-table'


export default React.createClass({
  getInitialState: function() {
    return { data: [], loading: false }
  },
  componentDidMount: function() {
    this.search()
  },
  componentDidUpdate: function(prevProps) {
    if(prevProps.searchId !== this.props.searchId) {
      this.search()
    }
  },
  search: function() {
    let self = this
    self.setState({ loading: true })
    const metricParams = addIndex(map)(
      function(value, idx) {
        let newObj = {}
        newObj['metric' + idx] = value.metric
        newObj['parameter' + idx] = value.parameter
        return newObj
      },
      values(self.props.metrics)
    )
    const params = mergeAll(concat(
      [{ timestamp: self.props.startDate.format('YYYY-MM-DD') }],
      metricParams
    ))
    $.ajax({
      type: "POST",
      url: "/evaluations/search_models",
      data: $.param(params),
      success: function(result) {
        self.setState({
          data: result.results,
          loading: false
        })
      }
    })
  },
  columnOrder: function() {
    if(this.state.data.length > 0) {
      let header = Object.keys(this.state.data[0])
      header.splice(header.indexOf('model_id'), 1)
      header.splice(0, 0, 'model_id')
      return header
    } else {
      return ['']
    }
  },
  standardColumnRenderer: function(columnName, props) {
    return (<span>{props.row[columnName]}</span>)
  },
  handleModelIdClick: function(modelId) {
    const self = this
    return function() {
      self.props.setModelId(modelId)
    }
  },
  modelIdColumnRenderer: function(columnName, props) {
    return (
      <span>
        <a onClick={this.handleModelIdClick(props.row[columnName])}>
          { props.row[columnName] }
        </a>
      </span>
    )
  },
  columns: function() {
    const self = this
    const renderColumn = function(columnName) {
      if(columnName === 'model_id') {
        return {
          header: columnName,
          render: curry(self.modelIdColumnRenderer)(columnName)
        }
      } else {
        return {
          header: columnName,
          render: curry(self.standardColumnRenderer)(columnName)
        }
      }
    }
    return map(renderColumn, this.columnOrder())
  },
  render: function() {
    if(this.state.loading) {
      return (
        <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
      )
    } else {
      return (
        <ReactTable
          tableClassName="table"
          columns={this.columns()}
          data={this.state.data}
          loadingComponent={function() { return null }}
          showPageSizeOptions={false}
          pageSize={15} />
      )
    }
  }
})
