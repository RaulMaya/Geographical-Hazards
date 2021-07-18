function getColor(d) {
  return d > 90 ? '#800026' :
         d > 70  ? '#BD0026' :
         d > 60  ? '#E31A1C' :
         d > 50  ? '#FC4E2A' :
         d > 30   ? '#FD8D3C' :
         d > 10   ? '#FEB24C' :
         d > -10   ? '#FED976' :
                    '#FFEDA0';
}


link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



  d3.json(link).then(function(data){
    console.log(data.features)
    features =  data.features

    var markers = [];
    var mags = [];
    var depths = []; 

    features.forEach((property)=>{
      var mag = property.properties.mag;
      var lat = property.geometry.coordinates[1];
      var lon = property.geometry.coordinates[0];
      var depth = property.geometry.coordinates[2];

      var earthquakeMarker = L.circleMarker([lat, lon], {
        radius: mag * 3.5,
        stroke: true,
        color: "red",
        weight: 1,
        fillColor: getColor(depth),
        fillOpacity: 0.75
    }).bindPopup(`<b><u>Earthquake Details</u></b><hr><b>Magnitude:</b> ${mag} <br><b>Depth:</b> ${depth}<br><b>Coordinates:</b> (${lat},${lon})`);
    

        markers.push(earthquakeMarker);
        mags.push(mag);
        depths.push(depth);
    })
    console.log(markers)
    console.log(Math.max(mags[0]))
    console.log(depths)

    var earthquakes = L.layerGroup(markers)

    console.log(earthquakes)

    var myMap = L.map("map",{
      center: [26.41, 17.84],
      zoom: 3
    });
    
    
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    }).addTo(myMap);

    earthquakes.addTo(myMap);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 60, 70, 90],
            labels = ['<strong> Magnitude </strong>'],
            from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades [i];
                to = grades[i+1]-1;
        
            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
                }
                div.innerHTML = labels.join('<br>');
                return div;
    };

    legend.addTo(myMap);
  })
 
