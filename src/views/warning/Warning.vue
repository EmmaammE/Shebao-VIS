<template>
  <div class="map-container">
    <div class="cards-container">
      <v-card v-for="(d,index) in info" :key="index"
        outlined
        width="13vw"
      >
        <span class="badge-icon">
          <component :is= "d.icon"></component>
        </span>
        <span>{{d.title}}</span>
        <span class="number">{{nums[index]}}</span>
      </v-card>
    </div>

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
      <l-circle
        :lat-lng="circle.center"
        :radius="circle.radius"
        @click="clickMarker"
      >
      </l-circle>
      <l-marker :lat-lng="[30.260574, 120.125254]">
        <!-- l-icon必须写在这 -->
        <l-icon class-name="ring-icon" :iconSize="[radius, radius]">
          <ring-mark :data="faked" :hover="fakeh" />
        </l-icon>
      </l-marker>
    </l-map>

    <!-- 地图上显示的图表container-->
    <div :class="isShowing?'map-charts-container active':'map-charts-container'">
      <svg viewBox="0 0 100 200" class="line-box">
        <path d="M5 80, L70,20 L100,20"/>
        <!-- TODO circle加上外发光 -->
        <circle cx="95" cy="20" r="5" />
      </svg>
      <v-card class="card-container">
        <h4>{{title}}</h4>
        <h4>{{type}} {{ id}}</h4>
        <div class="two-charts">
          <p>均次指标</p>
          <!-- 日期和图例 -->
          <div class="c-header">
            <div>--------</div>
            <div class="legends">
              <span>实际</span>
              <span>预算</span>
            </div>
          </div>
          <!-- 图表一 -->
          <div class="s-two">
            <div>
              人次人头比（次）
            </div>
            <div>
              均次费用（元）
            </div>
          </div>
        </div>
        <hr/>
        <div>
          <p>年度指标</p>
          <!-- 图表一 -->
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import layout from '@/mixins/layout';
// import Map from '@/components/Map.vue';
import Icon1 from '@/assets/warning/icon_1.svg';
import Icon2 from '@/assets/warning/icon_2.svg';
import Icon3 from '@/assets/warning/icon_3.svg';

import RingMark from '@/views/warning/RingMark.vue';

import { token, style } from '@/util/type';

import L, { latLng } from 'leaflet';
import {
  LMap, LTileLayer, LCircle, LPopup, LMarker, LIcon,
} from 'vue2-leaflet';

export default {
  name: 'Warning',
  components: {
    // Map,
    LMap,
    LMarker,
    LTileLayer,
    LCircle,
    LPopup,
    RingMark,
    LIcon,
  },
  data: () => ({
    info: [
      { icon: Icon1, title: '异常机构数量' },
      { icon: Icon2, title: '高危机构数量' },
      { icon: Icon3, title: '正常机构数量' },
    ],
    nums: [77, 155, 72],

    zoom: 15,
    center: [30.260574, 120.125254],
    currentCenter: L.latLng([30.260574, 120.125254]),
    circle: {
      center: latLng(30.260574, 120.125254),
      radius: 45,
    },

    // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    url: `https://api.mapbox.com/styles/v1/${style}/tiles/{z}/{x}/{y}?access_token=${token}`,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, '
        + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
      + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',

    // 地图上显示的图表
    isShowing: false,

    title: '杭州市富阳区第一人民医院',
    type: '医疗机构',
    id: 5026,

    // 被点击的地图
    clickPos: [0, 0],

    // 图标fake数据
    faked: [5, 7, 10, 20],
    fakeh: [3, 9],

    // 计算一个像素值范围
    radius: 100,
  }),

  mixins: [layout],

  methods: {
    clickMarker(e) {
      if (this.isShowing) {
        this.isShowing = false;
      } else {
        // 获得点击的这个点的x,y坐标
        // eslint-disable-next-line
        const { x: targetX, y: targetY } = e.target._point;
        const map = this.$refs.map.mapObject;
        // eslint-disable-next-line
        const { x, y } = map._size;

        // 会放于地图左侧150px的地方
        const pointNewCenter = L.point(x / 2 + targetX - 150, targetY);

        // convert to lat/lng space
        const pointlatlng = map.layerPointToLatLng(pointNewCenter);

        map.panTo(pointlatlng);
        this.isShowing = true;
        this.clickPos = [targetX, targetY];
      }
      // const pos = e.target.getLatLng();
    },
    zoomUpdated(zoom) {
      // if (this.zoom !== zoom) {
      //   // 在放大缩小时，隐层tooltip
      // this.isShowing = false;
      this.zoom = zoom;
      // }
    },
    centerUpdate(center) {
      // // 只保留三位小数，因为有点误差
      // if (center.lat.toFixed(3) !== this.clickCenter.lat.toFixed(3)
      //   || center.lng.toFixed(3) !== this.clickCenter.lng.toFixed(3)) {
      //   this.isShowing = false;
      // }
      this.currentCenter = center;
    },
    onLayerReady() {
      const map = this.$refs.map.mapObject;

      map.on('movestart', () => {
        this.isShowing = false;
      })
        .on('resize', () => {
          this.isShowing = false;
        });
    },
  },

};
</script>

<style scoped lang="scss">
  .map-container {
    width: 99%;
    margin: 4px;
    background: #fff;
  }

  .cards-container {
    position: absolute;
    top: 35px;
    right: 8%;
    z-index: 1100;
    width: 100%;
    padding: 0 10% 0 20%;
    display: flex;
    justify-content: space-around;

    .v-card {
      background: rgba(255,255,255,.8)!important;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: rem;

      .number {
        margin-right: 1rem;
      }
    }

    .badge-icon {
      display: flex;
      align-items: center;

      svg {
        transform: scale(0.7);
      }
    }
  }

  // 显示的图标
  .map-charts-container {
    z-index: 500;
    height: 45vh;
    opacity: 0;
    position: absolute;
    // 地图容器高度的一半90vh - 一半的container高度22.5vh
    top: 22.5vh;
    left: 150px;
    // width: 25vw;
    // display: grid;
    // grid-template-columns: 14vw 20vw;
    display: flex;
    pointer-events: none;
    user-select: none;
    transition: height 100ms ease-in-out;
    overflow: hidden;

    svg {
      z-index: 510;
      width: 10vw;;
    }

    svg path{
      stroke: #cc4b58;
      fill: none;
    }

    svg circle {
      fill: #cc4b58;
    }

    .card-container {
      height: 100%;
      width: 20vw;
      margin-left: -0.5vw;
      padding: 15px;
      display: grid;
      grid-template-rows: 4% 4% 40% 2% 40%;
      justify-items: center;

      hr {
        width: 100%;
        height: 1px;
      }

      .two-charts {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .c-header {
        display: flex;
        justify-content: space-between;
        width: 18vw;
      }

      .s-two {
        display: flex;
      }

      // 图表的附件
      .legends {
        $size: 10px;
        $color1: #1e5dc3;
        $color2: #d40309;

        span {
          position: relative;
          display: inline-block;
          margin: 0 15px;
        }

        span::before {
          content: '';
          position: absolute;
          // TODO 大小和行高一样
          width: $size;
          height: $size;

          border-radius: 50%;
          left: -1.5*$size;
        }

        span:nth-child(1) {
          &::before {
            background: $color1;
          }
        }

         span:nth-child(2) {
          &::before {
            background: $color2;
          }
        }
      }
    }
  }

  .active {
    height: 55vh;
    opacity: 1;
  }

</style>
