var ScatterChart = React.createClass({
    getInitialState: function() {
      return { data: randomData(2, 40) };
    },
    render: function() {
      return (
        <div>
          {
            React.createElement(NVD3Chart, {
                              type:"scatterChart",
                              datum: this.state.data,
                              containerStyle:{ width: "700px", height: "500px" },
                              options:{ showDistX: true,
                                        showDistY: true,
                                        duration: 500,
                                        xAxis: { tickFormat: d3.format('.02f') },
                                        yAxis: { tickFormat: d3.format('.02f') },
                                        color: d3.scale.category10().range()
                                      }
                                    }
                                )
          }
        </div>
      );
    }
  });

function randomData(groups, points) { //# groups,# points per group
  var data = [],
      random = d3.random.normal();

  for (var i = 0; i < groups; i++) {
    data.push({
      key: 'Label ' + i,
      values: []
    });

    for (var j = 0; j < points; j++) {
      data[i].values.push({
        x: random(),
        y: random(),
        size: Math.round(Math.random() * 100) / 100,   //Configure the size of each scatter point
        shape: "circle"  //Configure the shape of each scatter point.
      });
    }
  }

  return data;
}
