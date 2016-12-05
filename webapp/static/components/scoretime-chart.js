var ScoreTimeChart = React.createClass({
    data: [
    {
      key: "Unit Id 1",
      values: [[2010, 0.09], [2011, 0.16], [2012, 0.11], [2013, 0.14], [2014, 0.08], [2015, 0.12], [2016, 0.06]]
    },
    {
      key: "Unit Id 2",
      values: [[2010, 0.57], [2011, 0.40], [2012, 0.45], [2013, 0.65], [2014, 0.81], [2015, 0.71], [2016, 0.74]]
    },
    {
      key: "Unit Id 3",
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
                                        yDomain: [0, 1],
                                        xAxis: { axisLabel: 'Year' },
                                        yAxis: { axisLabel: 'Risk Score' },
                                        color: d3.scale.category10().range() }
                                            })
          }
        </div>
              );
    }
});
