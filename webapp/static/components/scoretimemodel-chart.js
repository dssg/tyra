var ScoreTimeModelChart = React.createClass({
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
    getRandomScoreTime: function(groups) {
      var data=[],
      rand_mean = d3.random.normal(0.35, 0.2),
      rand_std = d3.random.normal(0.05, 0.02);
      for (var i = 0; i < groups; i++) {
        data.push({
          key: 'Unit ID ' + i,
          values: []
        });
        var random = d3.random.normal(rand_mean(),rand_std());
        for (var j=0; j < 7; j+=1) {
          data[i].values.push([j+2010, random()]);
        }
      }
      return data;
    },
    getRandomScoreModel: function(groups) {
      var data = [],
      rand_mean = d3.random.normal(0.55,0.2),
      rand_std = d3.random.normal(0.05, 0.03);
      for (var i = 0; i < groups; i++) {
        data.push({
        key: 'Unit ID ' + i,
        values: []
      });
        var random = d3.random.normal(rand_mean(),rand_std());
        for (var j = 0; j < 50; j+=1) {
          data[i].values.push([j, random()]);
        }
      }
      return data;
    },
    getInitialState: function() {
      return { data_model: this.getRandomScoreModel(3), data_time: this.getRandomScoreTime(3) };
    },
    handleGenerate: function() {
      //console.log(this.state.data);
      this.setState({ data_model: this.getRandomScoreModel(3), data_time: this.getRandomScoreTime(3) });
    },
    render: function() {
      return (
        <div>
        <div className="row"><button onClick={this.handleGenerate}>Generate</button></div>
        <div className="col-lg-6">
          {
            React.createElement(NVD3Chart, {
                              type:"lineChart",
                              datum: this.state.data_time,
                              containerStyle:{ width: "500px", height: "500px" },
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
        <div className="col-lg-6">
          {
            React.createElement(NVD3Chart, {
                              type:"lineChart",
                              datum: this.state.data_model,
                              containerStyle:{ width: "500px", height: "500px" },
                              x: function(d) { return d[0] },
                              y: function(d) { return d[1] },
                              options:{ showDistX: true,
                                        showDistY: true,
                                        duration: 500,
                                        useInteractiveGuideline: true,
                                        yDomain: [0, 1],
                                        xAxis: { axisLabel: 'Model ID' },
                                        yAxis: { axisLabel: 'Risk Score' },
                                        color: d3.scale.category10().range() }
                                            })
          }
        </div>
        </div>
              );
    }
});
