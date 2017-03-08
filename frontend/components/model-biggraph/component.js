import { addIndex, map, mergeAll, values, over, lensIndex, head } from 'ramda'
import React from 'react'
import ReactHighcharts  from 'react-highcharts';

export default React.createClass({
  getInitialState: function() {
    let self = this
    return {
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
        series: [
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
      },
    numOfModelToShow: [1, 3, 5, 10]
    }
  },
  getModelsToShow: function() {
    const modelIdToShow = [2403]//, 3021, 2581, 2270, 2619]
    return modelIdToShow
  },
  handleModelIdClick: function(modelId, asOfDate) {
    const self = this
    self.props.setModelId(modelId.split(" ")[1])
    self.props.setAsOfDate(asOfDate)
  },
  componentDidMount: function() {
    map(this.get_metric, this.getModelsToShow());
  },
  get_metric: function(modelId) {
    let self = this
    const metricParams = addIndex(map)(
      function(value, idx) {
        let newObj = {}
        newObj['metric' + idx] = value.metric
        newObj['parameter' + idx] = value.parameter
        return newObj
      },
      values(self.props.metrics)
    )
    const params = mergeAll(metricParams)
    $.ajax({
      type: "POST",
      url: "/evaluations/" + modelId + "/metric_overtime",
      data: $.param(params),
      success: function(result) {
        const timeseries = values(result.results[0])[1]
        let newConfig = self.state.config
        newConfig.yAxis = {title:{text: values(result.results[0])[0]}};
        newConfig.series = [
          {
            type: "line",
            name: values(result.results)[1].key,
            asOfDate: "2016-03-01",
            data: map(function(x) {return [Date.parse(x[0]), x[1]]}, timeseries)
          }
        ]
        self.setState({config: newConfig})
        //console.log(newConfig)
        console.log(values(result.results)[1].key)
        console.log(values(result.results[0])[0])
        console.log(values(result.results[0])[1])
        console.log(map(function(x) {return [new Date(x[0]).toISOString(), x[1]]}, timeseries))
      }
    })
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-8">
          <ReactHighcharts config = {this.state.config} />
        </div>
        <div className="col-lg-4" style={{textAlign:"right"}}>
          <select >
            {this.state.numOfModelToShow.map(function(num) {
              return <option key={num} value={num}>{num}</option>
            })}
          </select>
          &nbsp; curve(s) to show
        </div>
      </div>
      )
  }
})
