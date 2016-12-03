var MetricTimeChart = React.createClass({
    data: [
    {
      key: "Base Rate",
      values: [[2010, 0.09], [2011, 0.16], [2012, 0.11], [2013, 0.14], [2014, 0.08], [2015, 0.12], [2016, 0.06]]
    },
    {
      key: "Recall",
      values: [[2010, 0.17], [2011, 0.20], [2012, 0.15], [2013, 0.23], [2014, 0.30], [2015, 0.26], [2016, 0.24]]
    },
    {
      key: "Precision",
      values: [[2010, 0.47], [2011, 0.52], [2012, 0.43], [2013, 0.43], [2014, 0.41], [2015, 0.37], [2016, 0.34]]
    }
    ],

    getInitialState: function() {
      return { data: this.data };
    },
    render: function() {
      return (
        <div>
          {
            React.createElement(NVD3Chart, {
                              type:"lineChart",
                              datum: this.state.data,
                              containerStyle:{ width: "700px", height: "500px" },
                              x: function(d) { return d[0] },
                              y: function(d) { return d[1] },
                              options:{ showDistX: true,
                                        showDistY: true,
                                        duration: 500,
                                        useInteractiveGuideline: true,
                                        xAxis: { axisLabel: 'Year' },
                                        yAxis: { axisLabel: 'Metric' },
                                        color: d3.scale.category10().range() }
                                            })
          }
        </div>
              );
    }
});

function getData() {
  return
}
