// Declare dim of the graph
var width = 960,
  height = 600;
  
// Create an instance of the layout engine
var map = d3.map();

var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

// Create an instance of the geo projection engine
// This does all the awesome math for rendering the map
var projection = d3.geo.mercator()
  .translate([0, 0])
  .scale(width / 2 / Math.PI);
  
var zoom = d3.behavior.zoom()
  .scaleExtent([1, 8])
  .on("zoom", move);

// Create the path renderer engine for the map projection to be rendered with
var path = d3.geo.path()
  .projection(projection);


// Create the graph svg element
var svg = d3.select("#graph").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .call(zoom);
  
var g = svg.append("g");

svg.append("rect")
  .attr("class", "overlay")
  .attr("x", -width / 2)
  .attr("y", -height / 2)
  .attr("width", width)
  .attr("height", height);
  
// Grab the geo data
queue()
  .defer(d3.json, "countries.json")
	.defer(d3.csv, "internationalData.csv")
  .await(update);

function update(err, map, data) {
  console.log(err);
  console.log(map);
  if(err) alert(err);
  
  var countryId = {};
  var donors = {};
  var alumniDonors = {};
  var amount = {};
  
  data.forEach(function(d) {
    var id = CountryToISO(d.COUNTRY);
    countryId[id] = d.COUNTRY;
    donors[id] = +d.DONORS;
    alumniDonors[id] = +d.ALUMNI_DONORS;
    amount[id] = +d.AMOUNT;
  });

  g.attr("class", "countries")
    .selectAll("path")
      .data(topojson.feature(map, map.objects.countries).features)
      .enter().append("path")
        .attr("d", path)
      .style('fill', function(d){
        if(countryId[d.id]){
          return 'grey';
        } else {
          return 'none';
        }
      })
      
    // Mouse events
    .on('mouseover', function(d){
      if(countryId[d.id]){
        d3.select(this).style('fill', 'red');
        div.transition().duration(300)
        .style("opacity", 1)
        div.html(countryId[d.id] + "<br />Donors: " + donors[d.id] + "<br />Alumni Donors: " + alumniDonors[d.id] + "<br />Amount: $" + amount[d.id])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
      }
    })
    .on('mouseout', function(d){
      if(countryId[d.id]){
        d3.select(this).style('fill', 'grey');
        div.transition().duration(300)
        .style("opacity", 0);
      }
    });
};

function move() {
  var t = d3.event.translate,
      s = d3.event.scale;
  t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
  t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
  zoom.translate(t);
  g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

d3.select(self.frameElement).style("height", height + "px");

// Define a lookup table for the FIPS codes
var fips = {
	'AUS': '036',
	'BRA': '076',
	'CAN': '124',
	'CHE': '756',
	'CHN': '156',
	'CZE': '203',
	'DEU': '280',
	'DNK': '208',
	'GBR': '826',
	'GEO': '268',
	'GRC': '300',
	'IND': '356',
	'ISR': '376',
	'ITA': '380',
	'JPN': '392',
	'MAR': '504',
	'NLD': '528',
	'NPL': '524',
	'PRI': '630',
	'SGP': '702',
	'SWE': '752',
	'THA': '764',
	'TWN': '158'
};
 
// Function to use the lookup table to do the conversion
// sc argument is a string containing the two char
// state abbreviation
var CountryToISO = function(sc) {
	return +fips[sc];
};