import React from 'react'
import ReactHighcharts  from 'react-highcharts';

export default React.createClass({
  getInitialState: function() {
    return {
      config: {}
    }
  },
  handleModelIdClick: function(modelId, asOfDate) {
    const self = this
    self.props.setModelId(modelId.split(" ")[1])
    self.props.setAsOfDate(asOfDate)
  },
  componentDidMount: function() {
    let self = this;
    this.setState({
      config: {
        title: {
          text: 'Model Select',
          style: {"color": "#000000", "fontSize": "30px", "fontFamily": "Open Sans", "fontWeight": "300"}
        },
        chart: {
          width: 800,
          height: 500
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            states: {
              hover: {
                enabled: true,
                lineWidthPlus: 5
              }
            },
            events: {
              click: function() {
                //window.open(this.options.url, '_blank');
                //location.href = this.options.url;
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
          align: "right",
          layout: "vertical",
          itemMarginTop: 5,
          itemHoverStyle: { "color": "#FFB2CD"},
          itemStyle: {"fontSize": "20px", "fontFamily": "Open Sans", "fontWeight": "300"}
        },
        xAxis: {
          labels: {
            style: {"fontSize": "20px", "fontFamily": "Open Sans", "fontWeight": "300"}
          },
          categories: ['2010', '2011', '2012', '2013', '2014', '2015', '2016']
        },
        yAxis: {
          title: {
            text: 'Precision @ Top 5%',
            style: {"fontSize": "18px", "fontFamily": "Open Sans", "fontWeight": "300"}
          }
        },
        series: [
        {
          type: "line",
          name: "Model 2403",
          asOfDate: "2016-03-01",
          data: [0.61, 0.54, 0.64, 0.53, 0.57, 0.55, 0.59],
          url: "/evaluations/2511/feature_importance"
        },
        {
          type: "line",
          name: "Model 3021",
          asOfDate: "2016-03-01",
          data: [0.31, 0.24, 0.22, 0.29, 0.28, 0.21, 0.24],
        },
        {
          type: "line",
          name: "Model 2581",
          asOfDate: "2016-03-01",
          data: [0.37, 0.36, 0.42, 0.40, 0.33, 0.24, 0.28],
        },
        {
          type: "line",
          name: "Model 2270",
          asOfDate: "2016-03-01",
          data: [0.74, 0.71, 0.73, 0.57, 0.55, 0.67, 0.74],
        },
        {
          type: "line",
          name: "Model 2619",
          asOfDate: "2016-03-01",
          data: [0.12, 0.12, 0.10, 0.11, 0.17, 0.15, 0.14],
        }
        ]
      }
    })
  },
  get_metric: function() {

  },
  render: function() {
    return (
      <ReactHighcharts config = {this.state.config}></ReactHighcharts>
      )
  }
})
