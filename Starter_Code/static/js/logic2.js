// Initialize the map centered on the US
var map = L.map('map').setView([19.8, -100], 3); 

// Add base tile layer (CartoDB light basemap)
var lightBaseMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
}).addTo(map);

// Function to style earthquake markers based on magnitude and depth
function styleEarthquakes(feature) {
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
function onEachEarthquakeFeature(feature, layer) {
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
    }
}

// Use D3 to fetch GeoJSON earthquake data from USGS API (past 7 days)
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(function(data) {
        // Add GeoJSON layer for earthquakes
        var earthquakesLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, styleEarthquakes(feature));
            },
            onEachFeature: onEachEarthquakeFeature
        });

        // Create a legend for earthquake depths
        var earthquakeLegend = L.control({ position: 'bottomright' });

        earthquakeLegend.onAdd = function(map) {
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

        earthquakeLegend.addTo(map);

        // Add earthquake layer to layer control
        var overlayMaps = {
            "Earthquakes": earthquakesLayer
        };

        // Use D3 to fetch GeoJSON tectonic plates data
        d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
            .then(function(data) {
                // Create GeoJSON layer for tectonic plates
                var tectonicPlatesLayer = L.geoJSON(data);

                // Add tectonic plates layer to overlay maps
                overlayMaps["Tectonic Plates"] = tectonicPlatesLayer;

                // Create additional base maps
                var satelliteBaseMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                });

                var grayscaleBaseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });

                var outdoorBaseMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://opentopomap.org/about/">OpenTopoMap</a> contributors'
                });

                // Add base maps to layer control
                var baseMaps = {
                    "Light": lightBaseMap,
                    "Satellite": satelliteBaseMap,
                    "Grayscale": grayscaleBaseMap,
                    "Outdoor": outdoorBaseMap
                };

                // Update layer control with all base maps and overlays
                L.control.layers(baseMaps, overlayMaps).addTo(map);
            })
            .catch(function(error) {
                console.error('Error fetching tectonic plates data:', error);
            });
    })
    .catch(function(error) {
        console.error('Error fetching earthquake data:', error);
    });