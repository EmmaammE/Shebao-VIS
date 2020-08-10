<template>
  <div id="map-id">
    <slot />
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const token = 'pk.eyJ1IjoienJjY2NyeiIsImEiOiJjank2bjgzMzcwZmJqM2RsYjBtbjh2Z3F6In0.Bi-7OaOTBaJ43pJM-hAT-g';
const style = 'zrcccrz/ckd1yvaxs13an1imn3552xkss';
export default {
  name: 'Map',

  components: {
  },

  data() {
    return {
      map: L.map(),
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

    const circle = L.circle([30.260574, 120.125254], 50, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
    });
    circle.on('click', this.onClick);

    circle.addTo(map);

    this.map = map;
  },

  methods: {
    onClick(e) {
      console.log(e.latlng);
      const pos = e.target.getLatLng();
      // pos[1] += 1;
      const { lat, lng } = pos;
      console.log(lat, lng);
      this.map.setView(L.latlng({ lat: lat + 0.01, lng }), 15);
      // this.map.panTo([lat + 1, lng]);
    },
  },
};
</script>

<style lang="scss">

#map-id {
 height: 90vh;
};

</style>
