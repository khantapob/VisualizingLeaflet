//URL to get API
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (d) {
    console.log("query results:", d);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(d.features);
});

function markerSize(size) {
    return (size * 10000);
}

function createFeatures(earthquakeMap) {
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakeMap);
}

function createMap(earthquakeMap) {

    // Create the tile layers that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var Markers = [];

    // Loop through the cities array
    for (var i = 0; i < earthquakeMap.length; i++) {

        // Conditionals for countries points
        var color = "";
        if (earthquakeMap[i].properties.mag >= 4.0) {
            color = "#4d9022";
        }
        else if (earthquakeMap[i].properties.mag >= 3.0) {
            color = "#82b164";
        }
        else if (earthquakeMap[i].properties.mag >= 2.0) {
          color = "#ffdc87";
        }
        else if (earthquakeMap[i].properties.mag >= 1.0) {
            color = "#ffe4b2";
        }
        else {
            color = "#fff1cf";
        }

        var location = [];
        location.push(earthquakeMap[i].geometry.coordinates[1]);
        location.push(earthquakeMap[i].geometry.coordinates[0]);

        Markers.push(
            L.circle(location, {
                stroke: false,
                fillOpacity: 0.70,
                color: "white",
                fillColor: color,
                // Setting  circle's radius 

                radius: markerSize(earthquakeMap[i].properties.mag)
            }).bindPopup("<h4 style='color: #3c3c3c; font-size: 10px'> Magnitude " + earthquakeMap[i].properties.mag +
                "</h4><hr><p>" + new Date(earthquakeMap[i].properties.time) + "</p>")
        );
    }


// Create two separate layer groups
  var featureLayer = L.layerGroup(Markers);

// Create a baseMaps object
    var baseMaps = {
        "Street Map": lightmap,
        "Dark Map": darkmap
    };

// Create an overlay object
    var overlayMaps = {
        "Earthquakes": featureLayer
    };

    var myMap = L.map("map", {
        center: [
            40.00, -120.00
        ],
        zoom: 5,
        layers: [lightmap, featureLayer]
    });

    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);
  
 

    //Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });

    // Add the info legend to the map
    info.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        grades = [0, 1, 2, 3, 4];
        labels = [];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="color:' + getColor(grades[i] + 1) + '">' +
                grades[i] + (grades[i + 1] ? '&nbsp;&ndash;&nbsp;' + grades[i + 1] + '</i><br>' : '+');
        }

        return div;
    };
    info.addTo(myMap);

}

function getColor(fill) {
    return fill >= 4 ? '#4d9022' :
           fill >= 3 ? '#82b164' :
           fill >= 2 ? '#ffdc87"' :
           fill >= 1 ? '#ffe4b2' :
           '#fff1cf' ;

}
