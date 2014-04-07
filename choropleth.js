// Declare dim of the graph
var width = 960,
  height = 600;
  
// Create an instance of the layout engine
var map = d3.map();

// Set values for different colors for the states
var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

// Create an instance of the geo projection engine
// This does all the awesome math for rendering the map
var projection = d3.geo.albersUsa()
  .scale(1280)
  .translate([width / 2, height / 2]);

// Create the path renderer engine for the map projection to be rendered with
var path = d3.geo.path()
  .projection(projection);

// Tooltip	
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Amount:</strong> <span style='color:red'>" + d.AMOUNT + "</span>";
  })

// Create the graph svg element
var svg = d3.select("#graph").append("svg")
  .attr("width", width)
  .attr("height", height);
	
svg.call(tip);
  
// Grab the geo data
queue()
  .defer(d3.json, "us.json")
	.defer(d3.csv, "data.csv", function(d) {map.set(d.STATE, +d.AMOUNT); })
  .await(update);
  
function update(err, us) {
  console.log(err);
  console.log(us);
  if(err) alert(err);
  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path)
		.on('mouseover', tip.show)
    .on('mouseout', tip.hide)
};

d3.select(self.frameElement).style("height", height + "px");