<template>
  <div id="map-id">
    <!-- 地图 -->
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: 90vh; width: 100%"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdate"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
        @ready="onLayerReady"
      />
      <slot :clickMarker="clickMarker" :map="mapObject"/>
    </l-map>
  </div>
</template>

<script>
import { token, style } from '@/util/type';

import L from 'leaflet';
import { LMap, LTileLayer } from 'vue2-leaflet';

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
  },

  props: {
    isShowing: Boolean,
    zoomcb: Function,
  },

  data() {
    return {
      zoom: 12,
      currentCenter: L.latLng([30.05, 119.95]),
      circle: {
        center: L.latLng(30.05, 119.95),
        radius: 45,
      },

      url: `https://api.mapbox.com/styles/v1/${style}/tiles/{z}/{x}/{y}?access_token=${token}`,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, '
        + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
      + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',

      // 被点击的地图
      clickPos: [0, 0],

      // 图标fake数据
      faked: [5, 7, 10, 20],
      fakeh: [3, 9],
      // 计算一个像素值范围
      radius: 100,

      center: [30.05, 119.95],
      mapObject: null,
    };
  },

  methods: {
    clickMarker(e) {
      // 获得点击的这个点的x,y坐标
      const { x: targetX, y: targetY } = e.layerPoint;
      if (this.isShowing
        && this.clickPos[0] === targetY
        && this.clickPos[1] === targetY) {
        this.updateShowStatus(false);
      } else {
        const map = this.$refs.map.mapObject;
        const { x, y } = map._size;

        // 会放于地图左侧150px的地方
        const pointNewCenter = L.point(x / 2 + targetX - 150, targetY);

        // convert to lat/lng space
        const pointlatlng = map.layerPointToLatLng(pointNewCenter);

        map.panTo(pointlatlng);
        // map.setView(pointlatlng);
        this.updateShowStatus(true);
        this.clickPos = [targetX, targetY];
      }

      // const pos = e.target.getLatLng();
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
      if (this.zoomcb) {
        this.zoomcb(zoom);
      }
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    onLayerReady() {
      const map = this.$refs.map.mapObject;
      this.mapObject = this.$refs.map;

      map.on('movestart', () => {
        this.updateShowStatus(false);
      })
        .on('resize', () => {
          this.updateShowStatus(false);
        });
    },
    updateShowStatus(value) {
      this.$emit('update', value);
    },
  },
};
</script>

<style lang="scss">

  #map-id {
    height: 90vh;
  };

  .leaflet-left {
    right: 0;
    left: auto;
    margin-right: 10px;
  }

</style>
