<template>
  <div id="map-id">
  </div>
</template>

<script>
import L from 'leaflet';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const token = 'pk.eyJ1IjoienJjY2NyeiIsImEiOiJjank2bjgzMzcwZmJqM2RsYjBtbjh2Z3F6In0.Bi-7OaOTBaJ43pJM-hAT-g';
const style = 'zrcccrz/ckd1yvaxs13an1imn3552xkss';
export default {
  name: 'Map',

  data() {
    return {

    };
  },

  mounted() {
    const map = L.map('map-id', {
      zoomControl: false,
      maxZoom: 18,
      minZoom: 5,
    }).setView([30.260574, 120.125254], 15);

    L.control.zoom({
      position: 'topright',
    }).addTo(map);

    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`, {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, '
        + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
      + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      // id: 'mapbox/light-v10',
      id: style,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);
  },

  methods: {
  },
};
</script>

<style lang="scss">

#map-id {
 height: calc(100vh - 80px);
};

</style>
