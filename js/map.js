/*!
 *< CampusMap - UFAM's Campus Map App with own route system >
 *Copyright (C) <2015>  <Cyfth - jackson@cyfth.com - cyfth.com>>
 *
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU Affero General Public License as published
 *by the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU Affero General Public License for more details.
 *
 *You should have received a copy of the GNU Affero General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Leaflet = require('Leaflet');
var Geolocation = require('./geolocation.js');

var map = new Leaflet.map('map', {
  zoomControl: false
});

var bounds = [[-3.0805, -59.9467], [-3.1074, -59.9873]];
var sourceMarker;
var isInsideUfam;

function resolvePosition(data) {
  if (data.latitude < bounds[0][0] && data.latitude > bounds[1][0] &&
    data.longitude < bounds[0][1] && data.longitude > bounds[1][1]) {
    isInsideUfam = true;
    return [data.latitude, data.longitude];

  } else {
    isInsideUfam = false;
    return [-3.101187, -59.9825066];
    //'Ops! A sua localização está fora dos limites da UFAM. Então colocamos
    // como ponto de partida, a entrada da UFAM.'
  }
}

function initialize() {
  Leaflet.Icon.Default.imagePath = './css/leaflet/images';

  // bounds limit the tiles to download just for the bound area.
  Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //'bounds': bounds,
    'attribution': '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.setView([-3.0929649, -59.9661264], 15);

  var zoomControl = Leaflet.control.zoom({position: "bottomleft"});
  map.addControl(zoomControl);
  // This limit the user from go elsewhere beyond bounds
  map.setMaxBounds(bounds);

  Geolocation.getGeolocation(function (data) {
    if(typeof data == "object") {
      var sourcePosition = resolvePosition(data);
      var sourcePopup = isInsideUfam ? 'Você está aqui!' : 'Entrada da UFAM';
      var sourceMarker = Leaflet.marker(sourcePosition)
        .addTo(map)
        .bindPopup(sourcePopup)
        .openPopup();
    } else {
      // Error
      console.log(data);
    }
  });
}

module.exports = {
  "initialize": initialize
}