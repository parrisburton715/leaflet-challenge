// Initialize the map with US as the center
var map = L.map('map').setView([37.0902, -95.7129], 5); 

// Add the base tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
}).addTo(map);

// Function to style markers based on earthquake magnitude and depth
function style(feature) {
    return {
        radius: Math.max(feature.properties.mag, 1) * 5, // Adjust size based on magnitude
        fillColor: getColor(feature.geometry.coordinates[2]), // Get color based on depth
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Function to determine color based on earthquake depth
function getColor(depth) {
    var colors = ['#00ff00', '#ffff00', '#ffa500', '#ff4500', '#ff0000']; // Example color range
    if (depth < 10) {
        return colors[0];
    } else if (depth < 30) {
        return colors[1];
    } else if (depth < 50) {
        return colors[2];
    } else if (depth < 70) {
        return colors[3];
    } else {
        return colors[4];
    }
}

// Function to create popups for each earthquake marker
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
    }
}

// Use D3 to fetch GeoJSON data from USGS API (past 7 days)
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(function(data) {
        // Add GeoJSON layer to map
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, style(feature));
            },
            onEachFeature: onEachFeature
        }).addTo(map);

        // Add legend to map
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<b>Depth Legend</b><br>';
            
            var depths = [0, 10, 30, 50, 70];
            var colors = ['#00ff00', '#ffff00', '#ffa500', '#ff4500', '#ff0000'];

            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
            }
            
            return div;
        };

        legend.addTo(map);
    })
    .catch(function(error) {
        console.error('Error fetching data:', error);
    });
