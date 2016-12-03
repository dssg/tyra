var BarChart = React.createClass({
    data : [
  {
    "key": "Model Name",
    "color": "#d67777",
    "values": [
      {
        "label" : "Feature A" ,
        "value" : 1.8746444827653
      } ,
      {
        "label" : "Feature B" ,
        "value" : 8.0961543492239
      } ,
      {
        "label" : "Feature C" ,
        "value" : 0.57072943117674
      } ,
      {
        "label" : "Feature D" ,
        "value" : 2.4174010336624
      } ,
      {
        "label" : "Feature E" ,
        "value" : 0.72009071426284
      } ,
      {
        "label" : "Feature F" ,
        "value" : 0.77154485523777
      } ,
      {
        "label" : "Feature G" ,
        "value" : 0.90152097798131
      } ,
      {
        "label" : "Feature H" ,
        "value" : 0.085746319141851
      } ,
      {
        "label" : "Feature I" ,
        "value" : 0.91445417330854
      }
    ]
  }
],
    getInitialState: function() {
      return { data: this.data, sortflag: false};
    },
    handleSort: function() {
      var newdata = this.state.data;
      if (!this.state.sortflag) {
        newdata[0].values.sort(function(x,y){return d3.descending(x.value, y.value)});
        this.setState( {data: newdata, sortflag: true} );
      } else {
        newdata[0].values.sort(function(x,y){return d3.ascending(x.label, y.label)});
        this.setState( {data: newdata, sortflag: false} );
      }
    },
    render: function() {
      return (
        <div>
          <button onClick={this.handleSort}>Sort</button>
          {
            React.createElement(NVD3Chart, {
                              type:"multiBarHorizontalChart",
                              datum: this.state.data,
                              x: 'label',
                              y: 'value',
                              containerStyle:{ width: "700px", height: "500px" },
                              options:{ showValues: true,
                                        showControls: true,
                                        duration: 500,
                                        tooltip: {enabled: true}
                                      }})
          }
        </div>
      );
    }
  });


