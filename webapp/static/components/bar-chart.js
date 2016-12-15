var BarChart = React.createClass({
    getInitialState: function() {
      function bind_controller() {
        return $.ajax({
                url: "/evaluations/feature_importance",
                dataType: 'json',
                async:false
                }).responseJSON;
                }

      return { data: [bind_controller()], sortflag: true, button_value: 'Sort by Name'};
    },
    handleSort: function() {
      var newdata = this.state.data;
      console.log(newdata);
      if (!this.state.sortflag) {
        newdata[0].values.sort(function(x,y){return d3.descending(x.value, y.value)});
        this.setState( {data: newdata, sortflag: true, button_value: 'Sort by Name'} );
      } else {
        newdata[0].values.sort(function(x,y){return d3.ascending(x.label, y.label)});
        this.setState( {data: newdata, sortflag: false, button_value: 'Sort by Importance'} );
      }
    },
    render: function() {
      return (
        <div>
        <div className="row"><button onClick={this.handleSort}>{this.state.button_value}</button></div>
          {
            React.createElement(NVD3Chart, {
                              type:"multiBarHorizontalChart",
                              datum: this.state.data,
                              x: 'label',
                              y: 'value',
                              containerStyle:{ width: "1000px", height: "900px" },
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


