var myData = "date	Nepal	USA	 World\n\
1950	0.53	9.13	4.20\n\
1955	0.67	9.29	4.65\n\
1960	0.91	9.44	5.01\n\
1965	1.20	9.56	5.51\n\
1970	1.57	9.63	5.84\n\
1975	1.94	9.71	6.16\n\
1980	2.41	9.77	6.52\n\
1985	2.32	9.82	6.77\n\
1990	2.95	9.86	7.02\n\
1995	4.44	9.88	7.21\n\
2000	5.53	9.90	7.51\n\
2005	6.31	9.91	7.88\n\
2010	7.01	9.95	8.24\n\
2015	7.40	10.04	8.36\n\
2020	7.79	10.11	8.54\n\
2025	8.16	10.19	8.77\n\
2030	8.46	10.21	9.00\n\
2035	8.73	10.23	9.16\n\
2040	8.94	10.25	9.31\n\
2045	9.13	10.26	9.45\n\
2050	9.27	10.27	9.58\n\
2055	9.37	10.28	9.71\n\
2060	9.46	10.29	9.81\n\
2065	9.53	10.3	9.90\n\
2070	9.59	10.3	9.98\n\
2075	9.62	10.3	10.05\n\
2080	9.66	10.31	10.1\n\
2085	9.68	10.31	10.15\n\
2090	9.69	10.31	10.19\n\
2095	9.70	10.31	10.22\n\
2100	9.71	10.31	10.24\n";

const margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


const svg = d3.select(".lineChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

var parseDate = d3.time.format("%Y").parse;

var xScale = d3.time.scale()
    .range([0, width]);
    
var yScale = d3.scale.linear()
    .range([height, 0]);
    
var color = d3.scale.category10();
    
var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(30)
    .orient("bottom");
    
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
    
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {
        return xScale(d.date);
    })
    .y(function(d) {
        return yScale(d.years);
     });

var data = d3.tsv.parse(myData);

color.domain(d3.keys(data[0]).filter(function(key) {
    return key !== "date";
}));
 
data.forEach(function(d) {
    d.date = parseDate(d.date);
});
 
var country = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          date: d.date,
          years: +d[name]
        };
      })
    };
  });
 
xScale.domain(d3.extent(data, function(d) {
    return d.date;
}));
 
yScale.domain([
    d3.min(country, function(c) {
        return d3.min(c.values, function(v) {
           return v.years;
         });
    }),
    d3.max(country, function(c) {
        return d3.max(c.values, function(v) {
           return v.years;
        });
    })
]);
 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
 
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("x", 110)
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Avg Years of Education");
 
var city = svg.selectAll(".country")
    .data(country)
    .enter().append("g")
    .attr("class", "country");
 
city.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
        return line(d.values);
    })
    .style("stroke", function(d) {
        return color(d.name);
    });
 
city.append("text")
    .datum(function(d) {
        return {
           name: d.name,
           value: d.values[d.values.length - 1]
        };
    })
    .attr("transform", function(d) {
        return "translate(" + xScale(d.value.date) + "," + yScale(d.value.years) + ")";
    })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) {
        return d.name;
    });
 
var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");
 
mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
       
var lines = document.getElementsByClassName('line');
 
var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(country)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");
 
mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
        return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");
 
mousePerLine.append("text")
    .attr("transform", "translate(10,3)");
 
mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
        .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
        });
 
        d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
            console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
             
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
 
            while (true){
                target = Math.floor((beginning + end) / 2);
                pos = lines[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                    break;
               }
               if (pos.x > mouse[0])      end = target;
               else if (pos.x < mouse[0]) beginning = target;
               else break; //position found
             }
             
            d3.select(this).select('text')
               .text(y.invert(pos.y).toFixed(2));
               
            return "translate(" + mouse[0] + "," + pos.y +")";
           });
       });
       