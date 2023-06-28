// Initialize the map
let map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Fetch earthquake data from USGS GeoJSON
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // Iterate over each earthquake and create a marker
    data.features.forEach(function (earthquake) {
      let coordinates = earthquake.geometry.coordinates;
      let magnitude = earthquake.properties.mag;
      let depth = coordinates[2];

      // Define marker size based on magnitude
      let markerSize = magnitude * 5;

      // Define marker color based on depth
      let markerColor = getColor(depth);

      // Create a marker with a popup
      let marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Create a popup with earthquake information
      let popupContent = `<b>Magnitude:</b> ${magnitude}<br>
                          <b>Depth:</b> ${depth}<br>
                          <b>Location:</b> ${earthquake.properties.place}<br>
                          <b>Time:</b> ${new Date(earthquake.properties.time)}`;

      marker.bindPopup(popupContent);
    });

    // Create a legend control
    let legend = L.control({ position: 'bottomright' });

    // Add the legend to the map
    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'legend');
      let grades = [-10, 10, 30, 50, 70, 90];
      let labels = [];

      labels.push('<strong>Depth</strong>');
      for (let i = 0; i < grades.length; i++) {
        let from = grades[i];
        let to = grades[i + 1] || '+';
        let color = getColor(from + 1);
        labels.push(
          '<i style="background:' + color + '"></i> ' +
          from + (to ? '&ndash;' + to : '')
        );
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    // Add legend control to the map
    legend.addTo(map);
  });

// Helper function to determine marker color based on depth
function getColor(depth) {
  return depth >= 90 ? '#FF0000' :
    depth >= 70 ? '#FF6E00' :
    depth >= 50 ? '#FFB300' :
    depth >= 30 ? '#FFD800' :
    depth >= 10 ? '#FFFF00' :
    depth >= -10 ? '#ADFF2F' :
    '#ADFF2F';
}






