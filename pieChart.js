

/* global d3, document, window */
function pieChart (options) {
    var animationDuration = 750,
      color = d3.scale.ordinal(d3.schemeCategory10),
      data = [],
      innerRadius = 0,
      outerRadius = 100,
      arc = d3.arc(),
      pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d.value;
        });
  
    function updateTween (d) {
      var i = d3.interpolate(this._current, d);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }
  
    function exitTween (d) {
      var end = Object.assign({}, this._current, { startAngle: this._current.endAngle });
      var i = d3.interpolate(d, end);
      return function(t) {
        return arc(i(t));
      };
    }
  
    function joinKey (d) {
      return d.data.series;
    }
  
    function pieChart (context) {
      var slices = context.selectAll('.slice').data(pie(data), joinKey);
  
      var oldSlices = slices.exit();
  
      var newSlices = slices.enter().append('path')
        .each(function(d) { this._current = Object.assign({}, d, { startAngle: d.endAngle }); })
        .attr('class', 'slice')
        .style('fill', function (d) { return color(joinKey(d)); });
  
      var t = d3.transition().duration(animationDuration);
  
      arc.innerRadius(innerRadius).outerRadius(outerRadius);
  
      oldSlices
        .transition(t)
          .attrTween('d', exitTween)
          .remove();
  
      var t2 = t.transition();
      slices
        .transition(t2)
          .attrTween('d', updateTween);
  
      var t3 = t2.transition();
      newSlices
        .transition(t3)
          .attrTween('d', updateTween);
    }
  
    pieChart.data = function (_) {
      return arguments.length ? (data = _, pieChart) : data;
    };
  
    pieChart.innerRadius = function (_) {
      return arguments.length ? (innerRadius = _, pieChart) : innerRadius;
    };
  
    pieChart.outerRadius = function (_) {
      return arguments.length ? (outerRadius = _, pieChart) : outerRadius;
    };
  
    return pieChart;
  }
  
//   var width = document.querySelector('body').clientWidth;
  var width = document.querySelector('body');
  var height = 500;
  // var dataset1 = [{series: 1, value: 1}, {series: 2, value: 2}, {series: 3, value: 3}, {series: 4, value: 4}, {series: 5, value: 5}];
  var dataset1 = [{series: 1, value: 9.15312004089355}, {series: 2, value: 90.84687996}];
  var dataset2 = [{series: 2, value:59.72443008}, {series: 3, value: 40.27556992}];
  var pieChart = pieChart().outerRadius(220).innerRadius(170);
  
  var svg = d3.select('.js-chart')
    .attr('width', width)
    .attr('height', height);
  
  var domPieChart = svg.append('g')
    .attr('class', 'pie-chart')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .call(pieChart.data(dataset1));
  
  var toggle = true;
  domPieChart.call(pieChart.data(dataset1));
  window.setInterval(function() {
    if (toggle) {
      domPieChart.call(pieChart.data(dataset2));
    } else {
      domPieChart.call(pieChart.data(dataset1));
    }
    toggle = !toggle;
  }, 3500);
  