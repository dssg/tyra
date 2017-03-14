import { addIndex, map, mergeAll, values, concat, keys, toPairs, zipObj, nth, forEach, prop, assoc, zip } from 'ramda'
import React from 'react'
import ReactHighcharts  from 'react-highcharts';
import d3 from 'd3'

export default React.createClass({
  getInitialState: function() {
    let self = this
    return {
      loading: false,
      config: {
        title: {
          text: 'Model Select',
          style: {"color": "#000000", "fontSize": "30px", "fontFamily": "Open Sans", "fontWeight": "300"}
        },
        chart: {
          width: 650,
          height: 500
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            marker: {enabled: false},
            states: {
              hover: {
                enabled: true,
                lineWidthPlus: 5
              }
            },
            events: {
              click: function() {
                self.handleModelIdClick(this.options.name, this.options.asOfDate);
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
          itemHoverStyle: { "color": "#FFB2CD"},
          itemStyle: {"fontSize": "15px", "fontFamily": "Open Sans", "fontWeight": "300"}
        },
        xAxis: {
          labels: {
            style: {"fontSize": "15px", "fontFamily": "Open Sans", "fontWeight": "300"}
          },
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: 'Precision @ Top 5%',
            style: {"fontSize": "15px", "fontFamily": "Open Sans", "fontWeight": "300"}
          }
        },
        series: []
      }
    }
  },
  handleModelIdClick: function(modelId, asOfDate) {
    const self = this
    self.props.setModelId(modelId.split(" ")[1])
    self.props.setAsOfDate(asOfDate)
  },
  componentDidMount: function() {
    this.ajax_call()
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
  shouldComponentUpdate: function(nextProps, nextState) {
    const self = this
    if (this.state !== nextState ||
        self.props.searchId !== nextProps.searchId ||
        self.props.numOfModelToShow !== nextProps.numOfModelToShow) {
      return true
    }
      return false
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
    console.log(params)
    $.ajax({
      type: "POST",
      url: "/evaluations/search_models_over_time",
      data: $.param(params),
      success: function(result) {
        let invalidEntries = 0;
        const minDataPoints = 2
        function filterByNumOfData(item) {
          if (Object.keys(values(item)[2]).length >= minDataPoints) {
            return true;
          }
          invalidEntries++;
          return false;
        };
        const filteredModels = result.results.filter(filterByNumOfData)
        const modelsToBeShow = filteredModels.slice(0, self.props.numOfModelToShow)
        let str2Date = x => [Date.parse(nth(0, x)), nth(1, x)]
        let make_timeseries = x => map(str2Date, toPairs(nth(2, values(x))))
        const series_data = map(make_timeseries, modelsToBeShow)
        const yAxis_title = params['metric0'] + ' @ ' +params['parameter0'];
        let getId = x => prop('model_id', x)
        let get_seriesname = x => map(getId, x)
        const series_name = get_seriesname(modelsToBeShow)
        let make_seriesconfig = x => assoc('data', nth(0, x), assoc('name', 'model ' + nth(1, x), { 'type': 'line', 'asOfDate':'2013-03-01'}))
        let newConfig = self.state.config
        newConfig.yAxis = {title:{text: yAxis_title}};
        newConfig.series = map(make_seriesconfig, zip(series_data, series_name))
        self.setState({
          config: newConfig,
          loading: false
        })
        console.log(newConfig)
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
          <ReactHighcharts config = {this.state.config} />
        </div>
      )
    }
  }
})


const fakedata = [
          {
            type: "line",
            name: "Model 2403",
            asOfDate: "2016-03-01",
            data: [
                    [Date.UTC(2015, 7, 1), 0.61],
                    [Date.UTC(2015, 8, 1), 0.54],
                    [Date.UTC(2015, 9, 1), 0.64],
                    [Date.UTC(2015, 10, 1), 0.53],
                    [Date.UTC(2015, 11, 1), 0.57],
                    [Date.UTC(2015, 12, 1), 0.55],
                    [Date.UTC(2016, 1, 1), 0.59]
                  ]
          },
          {
            type: "line",
            name: "Model 3021",
            asOfDate: "2016-03-01",
            data: [
                    [Date.UTC(2015, 7, 1), 0.31],
                    [Date.UTC(2015, 8, 1), 0.24],
                    [Date.UTC(2015, 9, 1), 0.22],
                    [Date.UTC(2015, 10, 1), 0.29],
                    [Date.UTC(2015, 11, 1), 0.28],
                    [Date.UTC(2015, 12, 1), 0.21],
                    [Date.UTC(2016, 1, 1), 0.24]
                  ]
          },
          {
            type: "line",
            name: "Model 2581",
            asOfDate: "2016-03-01",
            data: [
                    [Date.UTC(2015, 7, 1), 0.37],
                    [Date.UTC(2015, 8, 1), 0.36],
                    [Date.UTC(2015, 9, 1), 0.42],
                    [Date.UTC(2015, 10, 1), 0.40],
                    [Date.UTC(2015, 11, 1), 0.33],
                    [Date.UTC(2015, 12, 1), 0.24],
                    [Date.UTC(2016, 1, 1), 0.28]
                  ]
          },
          {
            type: "line",
            name: "Model 2270",
            asOfDate: "2016-03-01",
            data: [
                    [Date.UTC(2015, 7, 1),0.74],
                    [Date.UTC(2015, 8, 1), 0.71],
                    [Date.UTC(2015, 9, 1), 0.73],
                    [Date.UTC(2015, 10, 1), 0.57],
                    [Date.UTC(2015, 11, 1), 0.55],
                    [Date.UTC(2015, 12, 1), 0.67],
                    [Date.UTC(2016, 1, 1), 0.74]
                  ]
          },
          {
            type: "line",
            name: "Model 2619",
            asOfDate: "2016-03-01",
            data: [
                    [Date.UTC(2015, 7, 1), 0.12],
                    [Date.UTC(2015, 8, 1), 0.12],
                    [Date.UTC(2015, 9, 1), 0.10],
                    [Date.UTC(2015, 10, 1), 0.11],
                    [Date.UTC(2015, 11, 1), 0.17],
                    [Date.UTC(2015, 12, 1), 0.15],
                    [Date.UTC(2016, 1, 1), 0.14]
                  ]
          }
]
