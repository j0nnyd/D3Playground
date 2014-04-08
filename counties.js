// Declare dim of the graph
var width = 800,
  height = 500;
  
// Create an instance of the layout engine
var map = d3.map();

var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

// Create an instance of the geo projection engine
// This does all the awesome math for rendering the map
var projection = d3.geo.mercator()
  .center([-86, 38])
  .scale(5500)
  .translate([width / 2, height / 2])
  .clipExtent([[0, 0], [width, height]]);

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
	.defer(d3.csv, "kyData.csv")
  .await(update);

function update(err, map, data) {
  console.log(err);
  console.log(map);
  if(err) alert(err);
  
  var countyId = {};
  var donors = {};
  var alumniDonors = {};
  var amount = {};
  
  data.forEach(function(d) {
    var id = CountyToFips(d.COUNTY);
    countyId[id] = d.COUNTY;
    donors[id] = +d.DONORS;
    alumniDonors[id] = +d.AL_DONORS;
    amount[id] = +d.AMOUNT;
  });
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(map, map.objects.counties).features)
      .enter().append("path")
        .attr("d", path)
      .style('fill', function(d){
        if(d.id > 21000 && d.id < 22000){
          return 'grey';
        } else {
          return 'none';
        }
      })
      
    // Mouse events
    .on('mouseover', function(d){
      if(countyId[d.id] && d.id > 21000 && d.id < 22000){
        d3.select(this).style('fill', 'red');
        div.transition().duration(300)
        .style("opacity", 1)
        div.html(countyId[d.id] + "<br />Donors: " + donors[d.id] + "<br />Alumni Donors: " + alumniDonors[d.id] + "<br />Amount: $" + amount[d.id])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
      }
    })
    .on('mouseout', function(d){
      if(countyId[d.id] && d.id > 21000 && d.id < 22000){
        d3.select(this).style('fill', 'grey');
        div.transition().duration(300)
        .style("opacity", 0);
      }
    });
    
    svg.append("path")
      .datum(topojson.mesh(map, map.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
};

d3.select(self.frameElement).style("height", height + "px");

// Define a lookup table for the FIPS codes
var fips = {
	'Adair' : '21001',
	'Allen' : '21003',
	'Anderson' : '21005',
	'Ballard' : '21007',
	'Barren' : '21009',
	'Bath' : '21011',
	'Bell' : '21013',
	'Boone' : '21015',
	'Bourbon' : '21017',
	'Boyd' : '21019',
	'Boyle' : '21021',
	'Bracken' : '21023',
	'Breathitt' : '21025',
	'Breckinridge' : '21027',
	'Bullitt' : '21029',
	'Butler' : '21031',
	'Caldwell' : '21033',
	'Calloway' : '21035',
	'Campbell' : '21037',
	'Carlisle' : '21039',
	'Carroll' : '21041',
	'Carter' : '21043',
	'Casey' : '21045',
	'Christian' : '21047',
	'Clark' : '21049',
	'Clay' : '21051',
	'Clinton' : '21053',
	'Crittenden' : '21055',
	'Cumberland' : '21057',
	'Daviess' : '21059',
	'Edmonson' : '21061',
	'Elliott' : '21063',
	'Estill' : '21065',
	'Fayette' : '21067',
	'Fleming' : '21069',
	'Floyd' : '21071',
	'Franklin' : '21073',
	'Fulton' : '21075',
	'Gallatin' : '21077',
	'Garrard' : '21079',
	'Grant' : '21081',
	'Graves' : '21083',
	'Grayson' : '21085',
	'Green' : '21087',
	'Greenup' : '21089',
	'Hancock' : '21091',
	'Hardin' : '21093',
	'Harlan' : '21095',
	'Harrison' : '21097',
	'Hart' : '21099',
	'Henderson' : '21101',
	'Henry' : '21103',
	'Hickman' : '21105',
	'Hopkins' : '21107',
	'Jackson' : '21109',
	'Jefferson' : '21111',
	'Jessamine' : '21113',
	'Johnson' : '21115',
	'Kenton' : '21117',
	'Knott' : '21119',
	'Knox' : '21121',
	'Larue' : '21123',
	'Laurel' : '21125',
	'Lawrence' : '21127',
	'Lee' : '21129',
	'Leslie' : '21131',
	'Letcher' : '21133',
	'Lewis' : '21135',
	'Lincoln' : '21137',
	'Livingston' : '21139',
	'Logan' : '21141',
	'Lyon' : '21143',
	'Madison' : '21151',
	'Magoffin' : '21153',
	'Marion' : '21155',
	'Marshall' : '21157',
	'Martin' : '21159',
	'Mason' : '21161',
	'Mccracken' : '21145',
	'Mccreary' : '21147',
	'Mclean' : '21149',
	'Meade' : '21163',
	'Menifee' : '21165',
	'Mercer' : '21167',
	'Metcalfe' : '21169',
	'Monroe' : '21171',
	'Montgomery' : '21173',
	'Morgan' : '21175',
	'Muhlenberg' : '21177',
	'Nelson' : '21179',
	'Nicholas' : '21181',
	'Ohio' : '21183',
	'Oldham' : '21185',
	'Owen' : '21187',
	'Owsley' : '21189',
	'Pendleton' : '21191',
	'Perry' : '21193',
	'Pike' : '21195',
	'Powell' : '21197',
	'Pulaski' : '21199',
	'Robertson' : '21201',
	'Rockcastle' : '21203',
	'Rowan' : '21205',
	'Russell' : '21207',
	'Scott' : '21209',
	'Shelby' : '21211',
	'Simpson' : '21213',
	'Spencer' : '21215',
	'Taylor' : '21217',
	'Todd' : '21219',
	'Trigg' : '21221',
	'Trimble' : '21223',
	'Union' : '21225',
	'Warren' : '21227',
	'Washington' : '21229',
	'Wayne' : '21231',
	'Webster' : '21233',
	'Whitley' : '21235',
	'Wolfe' : '21237',
	'Woodford' : '21239'
};
 
// Function to use the lookup table to do the conversion
// sc argument is a string containing the two char
// state abbreviation
var CountyToFips = function(sc) {
	return +fips[sc];
};