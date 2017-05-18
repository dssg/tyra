import { addIndex, assoc, concat, map, mergeAll, nth, prop, toPairs, values, zip } from 'ramda'
import React from 'react'
import ReactHighcharts from 'react-highcharts'

export default React.createClass({
  getInitialState: function() {
    let self = this
    return {
      loading: false,
      config: {
        title: {
          text: 'Model Select',
          style: { "color": "#000000", "fontSize": "30px", "fontFamily": "Open Sans", "fontWeight": "300" }
        },
        chart: {
          width: 650,
          height: 500
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            marker: { enabled: false },
            states: {
              hover: {
                enabled: true,
                lineWidthPlus: 5
              }
            },
            point: {
              events: {
                click: function() {
                  let d = new Date(this.options.x)
                  self.handleModelIdClick(this.series.name, d.toISOString().split('T')[0])
                }
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true,
          margin: 10,
          layout: "horizontal",
          itemMarginTop: 5,
          itemHoverStyle: { "color": "#FFB2CD" },
          itemStyle: { "fontSize": "15px", "fontFamily": "Open Sans", "fontWeight": "300" }
        },
        xAxis: {
          labels: {
            style: { "fontSize": "15px", "fontFamily": "Open Sans", "fontWeight": "300" }
          },
          type: 'datetime',
          gridLineWidth: 0,
        },
        yAxis: {
          lineWidth:1,
          gridLineWidth: 0,
          tickWidth: 1,
          tickPosition: 'outside',
          title: {
            text: 'Precision @ Top 5%',
            style: { "fontSize": "15px", "fontFamily": "Open Sans", "fontWeight": "300" },
          },
        },
        series: []
      }
    }
  },
  componentDidMount: function() {
    this.ajax_call()
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    const self = this
    if (this.state !== nextState ||
        self.props.searchId !== nextProps.searchId ||
        self.props.numOfModelToShow !== nextProps.numOfModelToShow) {
      return true
    }
    return false
  },
  componentDidUpdate: function(prevProps) {
    const self = this
    if(prevProps.searchId !== self.props.searchId) {
      this.ajax_call()
    }
    if(prevProps.numOfModelToShow !== self.props.numOfModelToShow) {
      this.ajax_call()
    }
  },
  componentWillUnmount: function() {
  },
  handleModelIdClick: function(modelId, asOfDate) {
    const self = this
    self.props.setModelId(modelId.split(" ")[1])
    self.props.setAsOfDate(asOfDate)
  },
  ajax_call: function() {
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
    const params = mergeAll(concat([{ timestamp: self.props.startDate.format('YYYY-MM-DD') }], metricParams))
    $.ajax({
      type: "POST",
      url: "/evaluations/search_models_over_time",
      data: $.param(params),
      success: function(result) {
        const minDataPoints = 5
        function filterByNumOfData(item) {
          if (Object.keys(values(item)[2]).length >= minDataPoints) {
            return true
          }
          return false
        }
        const filteredModels = result.results.filter(filterByNumOfData)
        const modelsToBeShow = filteredModels.slice(0, self.props.numOfModelToShow)
        let str2Date = (x) => { return [Date.parse(nth(0, x)), nth(1, x)] }
        let make_timeseries = (x) => { return map(str2Date, toPairs(nth(2, values(x)))) }
        const series_data = map(make_timeseries, modelsToBeShow)
        const yAxis_title = params['metric0'] + ' @ ' + params['parameter0']
        let getId = (x) => { return prop('model_id', x) }
        let get_seriesname = (x) => { return map(getId, x) }
        const series_name = get_seriesname(modelsToBeShow)
        let make_seriesconfig = (x) => { return assoc('data', nth(0, x), assoc('name', 'model ' + nth(1, x), { 'type': 'line', 'asOfDate':self.props.asOfDate })) }
        let newConfig = self.state.config
        newConfig.yAxis.title.text = yAxis_title
        newConfig.series = map(make_seriesconfig, zip(series_data, series_name))
        self.setState({
          config: newConfig,
          loading: false
        })
      }
    })
  },
  render: function() {
    if(this.state.loading) {
      return (
        <div id="loader" style={{ margin: "0 auto" }} className="loader"></div>
      )
    } else {
      return (
        <div>
          <ReactHighcharts config={this.state.config} />
        </div>
      )
    }
  }
})
