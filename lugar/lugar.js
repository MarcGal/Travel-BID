const axios = require('axios');


const getLugarLatLong = async (direccion) => {
  let encodedUrl = encodeURI(direccion);
  let resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedUrl}.json?access_token=pk.eyJ1IjoibWFyZ2FsIiwiYSI6ImNqdDRqbGJ2MzA0Mmc0NG55Y29sNnR1djUifQ.7_iCD0Qq6rri-WgOaFmCAg`);
  if (resp.data.features.length == 0) {
    throw new Error('No hay resultados para la ciudad');
  }
  return {
    direccion: resp.data.features[1].place_name,
    lat: resp.data.features[1].geometry.coordinates[1],
    long: resp.data.features[1].geometry.coordinates[0]
  };
};
module.exports = { getLugarLatLong };
