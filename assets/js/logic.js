// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var markerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var magColors = ["#d5ff80","#8cff66","#ffd9b3","#ffaa80","#ff9933","#ff471a"]

function markerColor(magnitude){
  magnitude = +magnitude;
  if(magnitude > 5){
    return magColors[5];
  }
  else if(magnitude > 4)
  {
    return magColors[4];
  }
  else if(magnitude > 3)
  {
    return magColors[3];
  }
  else if(magnitude > 2)
  {
    return magColors[2];
  }
  else if(magnitude > 1)
  {
    return magColors[1];
  }
  else
  {
    return magColors[0];
  }
}

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

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
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

  // Sending our earthquakes layer to the createMap function
  var myMap = createMap(earthquakes);
  createLegend(earthquakes).addTo(myMap);
}

function createMap(earthquakes) {

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
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [grayscale, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  return myMap;
}
