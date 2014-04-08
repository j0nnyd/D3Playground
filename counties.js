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
var projection = d3.geo.albersUsa()
  .scale(1280)
  .translate([width / 2, height / 2]);

// Create the path renderer engine for the map projection to be rendered with
var path = d3.geo.path()
  .projection(projection);


// Create the graph svg element
var svg = d3.select("#graph").append("svg")
  .attr("width", width)
  .attr("height", height);
  
// Grab the geo data
queue()
  .defer(d3.json, "us.json")
	.defer(d3.csv, "usData.csv")
  .await(update);

function update(err, map, data) {
  console.log(err);
  console.log(map);
  if(err) alert(err);
  
  var stateId = {};
  var donors = {};
  var alumniDonors = {};
  var amount = {};
  
  data.forEach(function(d) {
    var id = StateToFips(d.STATE);
    stateId[id] = d.STATE;
    donors[id] = +d.DONORS;
    alumniDonors[id] = +d.ALUMNI_DONORS;
    amount[id] = +d.AMOUNT;
  });
  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
      .data(topojson.feature(map, map.objects.states).features)
      .enter().append("path")
        .attr("d", path)
      .style('fill', 'none')
      
    // Mouse events
    .on('mouseover', function(d){
      d3.select(this).style('fill', 'red');
      div.transition().duration(300)
      .style("opacity", 1)
      div.html(stateId[d.id] + "<br />Donors: " + donors[d.id] + "<br />Alumni Donors: " + alumniDonors[d.id] + "<br />Amount: $" + amount[d.id])
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 30) + "px");
    })
    .on('mouseout', function(){
      d3.select(this).style('fill', 'none');
      div.transition().duration(300)
      .style("opacity", 0);
    });
};

d3.select(self.frameElement).style("height", height + "px");

// Define a lookup table for the FIPS codes
var fips = {
	'AL': '01',
	'AK': '02',
	'AS': '60',
	'AZ': '04',
	'AR': '05',
	'CA': '06',
	'CO': '08',
	'CT': '09',
	'DE': '10',
	'DC': '11',
	'FL': '12',
	'FM': '64',
	'GA': '13',
	'GU': '66',
	'HI': '15',
	'ID': '16',
	'IL': '17',
	'IN': '18',
	'IA': '19',
	'KS': '20',
	'KY': '21',
	'LA': '22',
	'ME': '23',
	'MH': '68',
	'MD': '24',
	'MA': '25',
	'MI': '26',
	'MN': '27',
	'MS': '28',
	'MO': '29',
	'MT': '30',
	'NE': '31',
	'NV': '32',
	'NH': '33',
	'NJ': '34',
	'NM': '35',
	'NY': '36',
	'NC': '37',
	'ND': '38',
	'MP': '69',
	'OH': '39',
	'OK': '40',
	'OR': '41',
	'PW': '70',
	'PA': '42',
	'PR': '72',
	'RI': '44',
	'SC': '45',
	'SD': '46',
	'TN': '47',
	'TX': '48',
	'UM': '74',
	'UT': '49',
	'VT': '50',
	'VA': '51',
	'VI': '78',
	'WA': '53',
	'WV': '54',
	'WI': '55',
	'WY': '56'
};
 
// Function to use the lookup table to do the conversion
// sc argument is a string containing the two char
// state abbreviation
var StateToFips = function(sc) {
	return +fips[sc];
};