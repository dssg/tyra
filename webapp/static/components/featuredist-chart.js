var FeatureDistChart = React.createClass({
    getInitialState: function() {
      return { data: poissonData(2,20) };
    },
    handleGenerate: function() {
      //console.log(this.state.data);
      this.setState({ data: poissonData(2,20)});
    },
    render: function() {
      return (
        <div>
        <button onClick={this.handleGenerate}>Generate</button>
          {
            React.createElement(NVD3Chart, {
                              type:"lineChart",
                              datum: this.state.data,
                              containerStyle:{ width: "700px", height: "500px" },
                              x: function(d) { return d[0] },
                              y: function(d) { return d[1] },
                              options:{ showDistX: true,
                                        showDistY: true,
                                        useInteractiveGuideline: true,
                                        duration: 500,
                                        xAxis: { tickFormat: d3.format('.01f'), axisLabel: 'Feature Value' },
                                        yAxis: { tickFormat: d3.format('.02f'), axisLabel: 'P(X|Y=Label)' },
                                        color: d3.scale.category10().range() }
                                            })
          }
        </div>
              );
    }
});


function poisson(k, landa) {
    var exponential = 2.718281828;
    var numerator, denominator;
    var exponentialPower = Math.pow(exponential, -landa); // negative power k
    var landaPowerK = Math.pow(landa, k); // Landa elevated k
    numerator = exponentialPower * landaPowerK;
    denominator = fact(k); // factorial of k.

    return (numerator / denominator);
}

function fact(x) {
   if(x==0) {
      return 1;
   }
   return x * fact(x-1);
}

function poissonData(groups, points) { //# groups,# points per group
  var data = [],
      random = d3.random.normal(5,2);
  for (var i = 0; i < groups; i++) {
    data.push({
      key: 'Label ' + i,
      values: []
    });
    var landa = random();
    var g =[];
    for (var j = 0; j < points; j+=1) {
      data[i].values.push([j, poisson(j,landa)]);
    }
  }
  var current_unit = d3.random.normal(6,4)();
  data.push({key: 'unit', values: [[current_unit,0],[current_unit,0.3]]});

  return data;
}

