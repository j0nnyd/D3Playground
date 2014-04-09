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
    alumniDonors[id] = +d.AL_DONORS;
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
	'AFG': '004',
	'ALA': '248',
	'ALB': '008',
	'DZA': '012',
	'ASM': '016',
	'AND': '020',
	'AGO': '024',
	'AIA': '660',
	'ATA': '010',
	'ATG': '028',
	'ARG': '032',
	'ARM': '051',
	'ABW': '533',
	'AUS': '036',
	'AUT': '040',
	'AZE': '031',
	'BHS': '044',
	'BHR': '048',
	'BGD': '050',
	'BRB': '052',
	'BLR': '112',
	'BEL': '056',
	'BLZ': '084',
	'BEN': '204',
	'BMU': '060',
	'BTN': '064',
	'BOL': '068',
	'BIH': '070',
	'BWA': '072',
	'BVT': '074',
	'BRA': '076',
	'VGB': '092',
	'IOT': '086',
	'BRN': '096',
	'BGR': '100',
	'BFA': '854',
	'BDI': '108',
	'KHM': '116',
	'CMR': '120',
	'CAN': '124',
	'CPV': '132',
	'CYM': '136',
	'CAF': '140',
	'TCD': '148',
	'CHL': '152',
	'CHN': '156',
	'HKG': '344',
	'MAC': '446',
	'CXR': '162',
	'CCK': '166',
	'COL': '170',
	'COM': '174',
	'COG': '178',
	'COD': '180',
	'COK': '184',
	'CRI': '188',
	'CIV': '384',
	'HRV': '191',
	'CUB': '192',
	'CYP': '196',
	'CZE': '203',
	'DNK': '208',
	'DJI': '262',
	'DMA': '212',
	'DOM': '214',
	'ECU': '218',
	'EGY': '818',
	'SLV': '222',
	'GNQ': '226',
	'ERI': '232',
	'EST': '233',
	'ETH': '231',
	'FLK': '238',
	'FRO': '234',
	'FJI': '242',
	'FIN': '246',
	'FRA': '250',
	'GUF': '254',
	'PYF': '258',
	'ATF': '260',
	'GAB': '266',
	'GMB': '270',
	'GEO': '268',
	'DEU': '276',
	'GHA': '288',
	'GIB': '292',
	'GRC': '300',
	'GRL': '304',
	'GRD': '308',
	'GLP': '312',
	'GUM': '316',
	'GTM': '320',
	'GGY': '831',
	'GIN': '324',
	'GNB': '624',
	'GUY': '328',
	'HTI': '332',
	'HMD': '334',
	'VAT': '336',
	'HND': '340',
	'HUN': '348',
	'ISL': '352',
	'IND': '356',
	'IDN': '360',
	'IRN': '364',
	'IRQ': '368',
	'IRL': '372',
	'IMN': '833',
	'ISR': '376',
	'ITA': '380',
	'JAM': '388',
	'JPN': '392',
	'JEY': '832',
	'JOR': '400',
	'KAZ': '398',
	'KEN': '404',
	'KIR': '296',
	'PRK': '408',
	'KOR': '410',
	'KWT': '414',
	'KGZ': '417',
	'LAO': '418',
	'LVA': '428',
	'LBN': '422',
	'LSO': '426',
	'LBR': '430',
	'LBY': '434',
	'LIE': '438',
	'LTU': '440',
	'LUX': '442',
	'MKD': '807',
	'MDG': '450',
	'MWI': '454',
	'MYS': '458',
	'MDV': '462',
	'MLI': '466',
	'MLT': '470',
	'MHL': '584',
	'MTQ': '474',
	'MRT': '478',
	'MUS': '480',
	'MYT': '175',
	'MEX': '484',
	'FSM': '583',
	'MDA': '498',
	'MCO': '492',
	'MNG': '496',
	'MNE': '499',
	'MSR': '500',
	'MAR': '504',
	'MOZ': '508',
	'MMR': '104',
	'NAM': '516',
	'NRU': '520',
	'NPL': '524',
	'NLD': '528',
	'ANT': '530',
	'NCL': '540',
	'NZL': '554',
	'NIC': '558',
	'NER': '562',
	'NGA': '566',
	'NIU': '570',
	'NFK': '574',
	'MNP': '580',
	'NOR': '578',
	'OMN': '512',
	'PAK': '586',
	'PLW': '585',
	'PSE': '275',
	'PAN': '591',
	'PNG': '598',
	'PRY': '600',
	'PER': '604',
	'PHL': '608',
	'PCN': '612',
	'POL': '616',
	'PRT': '620',
	'PRI': '630',
	'QAT': '634',
	'REU': '638',
	'ROU': '642',
	'RUS': '643',
	'RWA': '646',
	'BLM': '652',
	'SHN': '654',
	'KNA': '659',
	'LCA': '662',
	'MAF': '663',
	'SPM': '666',
	'VCT': '670',
	'WSM': '882',
	'SMR': '674',
	'STP': '678',
	'SAU': '682',
	'SEN': '686',
	'SRB': '688',
	'SYC': '690',
	'SLE': '694',
	'SGP': '702',
	'SVK': '703',
	'SVN': '705',
	'SLB': '090',
	'SOM': '706',
	'ZAF': '710',
	'SGS': '239',
	'SSD': '728',
	'ESP': '724',
	'LKA': '144',
	'SDN': '736',
	'SUR': '740',
	'SJM': '744',
	'SWZ': '748',
	'SWE': '752',
	'CHE': '756',
	'SYR': '760',
	'TWN': '158',
	'TJK': '762',
	'TZA': '834',
	'THA': '764',
	'TLS': '626',
	'TGO': '768',
	'TKL': '772',
	'TON': '776',
	'TTO': '780',
	'TUN': '788',
	'TUR': '792',
	'TKM': '795',
	'TCA': '796',
	'TUV': '798',
	'UGA': '800',
	'UKR': '804',
	'ARE': '784',
	'GBR': '826',
	'USA': '840',
	'UMI': '581',
	'URY': '858',
	'UZB': '860',
	'VUT': '548',
	'VEN': '862',
	'VNM': '704',
	'VIR': '850',
	'WLF': '876',
	'ESH': '732',
	'YEM': '887',
	'ZMB': '894',
	'ZWE': '716'
};
 
// Function to use the lookup table to do the conversion
// sc argument is a string containing the two char
// state abbreviation
var CountryToISO = function(sc) {
	return +fips[sc];
};