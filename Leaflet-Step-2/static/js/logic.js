function getColor(d) {
  return d > 600 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 400  ? '#E31A1C' :
         d > 300  ? '#FC4E2A' :
         d > 200   ? '#FD8D3C' :
         d > 100   ? '#FEB24C' :
         d > -5  ? '#FED976' :
                    '#FFEDA0';
}


var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var tectonicPlates = "static/tectonicplates-master/tectonicplates-master/GeoJSON/PB2002_boundaries.json"

  d3.json(tectonicPlates).then(function(platesData){
  console.log(platesData.features)
  });

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
      var place = property.properties.place;

      var earthquakeMarker = L.circleMarker([lat, lon], {
        radius: mag * 3.5,
        stroke: true,
        color: "red",
        weight: 1,
        fillColor: getColor(depth),
        fillOpacity: 0.75
    }).bindPopup(`<b><u>Earthquake Details</u></b><hr><b>Magnitude:</b> ${mag} <br><b>Depth:</b> ${depth}<br><b>Coordinates:</b> (${lat},${lon})<br><b>Place:</b> ${place}`);
    

        markers.push(earthquakeMarker);
        mags.push(mag);
        depths.push(depth);
    })


    var min = Math.min(...depths)
    var max = Math.max(...depths);

    console.log(min)
    console.log(max)
    console.log(markers)
    console.log(depths)

    var earthquakes = L.layerGroup(markers)

    console.log(earthquakes)

    d3.json(tectonicPlates).then(function (boundaries) {
      // Creating a GeoJSON layer with the retrieved data
      var plates = L.geoJson(boundaries, {
          "color": '#0000FF',
          "weight": 1,
          "opacity": .75});
      

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
      });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/dark-v10",
      accessToken: API_KEY
      });

      var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
        });

        var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
          tileSize: 512,
          maxZoom: 18,
          zoomOffset: -1,
          id: "mapbox/satellite-v9",
          accessToken: API_KEY
          });

          var baseMaps = {
            "Satellite": satellitemap,
            "Outdoor": outdoormap,
            "Light": lightmap,
            "Dark": darkmap
        };

        var overlayMaps = {
          "Earthquakes": earthquakes,
          "Tectonic Plates": plates
      }

      var myMap = L.map("map",{
        center: [26.41, 17.84],
        zoom: 3,
        layers: [satellitemap, plates, earthquakes]
      });
      
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
      
    earthquakes.addTo(myMap);
    });

   

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-5, 100, 200, 300, 400, 500, 600],
            labels = ['<strong> Depth </strong>'],
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
    
  });