// #################### Declare all global variables################################
// Store our API endpoint inside queryUrl for earthquake and tectonic plates
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tecPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

var markerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#595959",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var magColors = ["#d5ff80","#8cff66","#ffd9b3","#ffaa80","#ff9933","#ff471a"]


// Determine marker color based on earthquake magnitude
function markerColor(magnitude){
  magnitude = Math.floor(+magnitude);
  return(magnitude > 5? magColors[5]: magColors[magnitude]);
}

// Create legend based on Earthquake legend
function createLegend(geojson){
  var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["0-1","1-2","2-3","3-4","4-5", "5+"];
  var colors = magColors;
  var labels = [];
console.log(limits);
  // Add min & max
  // var legendInfo = "<p class=\"legendTitle\">EarthQuake Magnitude</p>"
  //   "<div class=\"labels\">" +
  //     "<div class=\"min\">" + limits[0] + "</div>" +
  //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //   "</div>";

  //  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push(`<div class='legendli' style='background-color: ${colors[index]}'>${limits[index]}</div>`);
  });

  div.innerHTML = "<div id = \"mapLegend\"><p class=\"legendTitle\">Magnitude</p>" + labels.join("") + "</div>";
  return div;
};

return legend;
// Adding legend to the map
legend.addTo(myMap);

}

// Add features - earthquake and tectonic plates to the map
function createFeatures(earthquakeData, tectonic_prm) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h5>" + feature.properties.place +
      "</h5><hr><p>" + new Date(feature.properties.time) + ", Magnitude : "+feature.properties.mag+"</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      markerOptions.radius = feature.properties.mag * 4.5;
      markerOptions.fillColor = markerColor(feature.properties.mag);
      
      return L.circleMarker(latlng, markerOptions);
  },
    onEachFeature: onEachFeature
  });

  tectonic_prm.then(function(tData){
    var tectonicPlates = L.geoJSON(tData, {
      style: function(feature) {
        return {
          stroke: true,
          color: "#b36b00",
          weight: 3
        };
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Tectonic Plate layer: " + feature.properties.Name);
      }
    });

    // Sending our earthquakes layer to the createMap function
    var myMap = createMap(earthquakes, tectonicPlates);
    createLegend(earthquakes).addTo(myMap);
  });
  
}

function createMap(earthquakes, tectonicPlates) {

  // Define streetmap and darkmap layers
  var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var outdoor = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Grayscale": grayscale,
    "Satellite": satellite,
    "Outdoor" : outdoor

  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    TectonicPlates : tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [satellite, earthquakes,tectonicPlates]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  return myMap;
}

function initMap(){
  
  var tectonic_prm = d3.json(tecPlatesURL);

  // Perform a GET request to the query URL
  d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features, tectonic_prm);

  });
}

initMap();