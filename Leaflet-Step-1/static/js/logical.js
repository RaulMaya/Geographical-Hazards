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

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
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
    }).bindPopup(`<strong>Mag: ${mag}</strong><br><strong>&#x2022 Depth: </strong>${depth}`);

        markers.push(earthquakeMarker);
        mags.push(mag);
        depths.push(depth);
    })
    console.log(markers)
    console.log(mags)
    console.log(depths)

    
  })
 
