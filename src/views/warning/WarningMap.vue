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
        <span class="number">{{Object.keys(datum[index]).length}}</span>
      </v-card>
    </div>

    <Map :isShowing="isShowing"
      @update="updateShowStatus"
    >
     <template v-slot="{clickMarker}">
      <v-marker-cluster
        v-for="(d,index) in datum"
        :key="index"
        :options="clusterOptions[index]"
        @clusterclick="click()"
        @ready="ready"
      >
        <l-marker v-for="(value, name) in d"
          :key="name" :lat-lng="[value.LAT, value.LNG]"
          :icon="icons[index]"
          @click="onClick($event,name,index,clickMarker)"
        >
          <!-- <l-popup :content="value.ji_gou_ming_cheng"></l-popup> -->
        </l-marker>
      </v-marker-cluster>
     </template>
    </Map>

    <!-- 地图上显示的图表container-->
    <div :class="['map-charts-container',
      compType===1?'cmp':'',isShowing?'active':''].join(' ')">
      <svg viewBox="0 0 100 200" class="line-box">
        <path d="M5 80, L70,20 L100,20"/>
        <!-- TODO circle加上外发光 -->
        <circle cx="95" cy="20" r="5" />
      </svg>

      <!-- 地图上显示不同类型的图表 -->
      <v-card class="card-container" v-if="compType===0">
        <!-- <div> -->
          <h4>{{title}}</h4>
          <h4>{{type}} {{ id}}</h4>
        <!-- </div> -->
        <div class="two-charts">
          <p>均次指标</p>
          <!-- 图例 -->
          <div class="c-header">
            <div class="legends">
              <span>实际</span>
              <span>预算</span>
            </div>
          </div>
          <!-- 图表一 -->
          <div class="s-two">
            <div>
              <span>人次人头比（次）</span>
              <span>均次费用（元）</span>
            </div>
            <barchart
              :type="1"
              :width="200"
              :height="100"
              :datum = "tipData"
              :yDomain="upX"
            />
          </div>
        </div>
        <div>
          <p>年度指标</p>
          <!-- 图表一 -->
        </div>
      </v-card>

      <!-- 机构预警 -->
      <org-table v-else-if="compType===1"
        :title="title"
        :id="id"
        :data="tipData"
      />
    </div>
  </div>
</template>

<script>
import Icon1 from '@/assets/warning/icon_1.svg';
import Icon2 from '@/assets/warning/icon_2.svg';
import Icon3 from '@/assets/warning/icon_3.svg';
import Map from '@/components/charts/Map.vue';
import OrgTable from '@/views/warning/comp/OrgTable.vue';
import { fetchFundMonitorInfo, fetchOrgViolationInfo } from '@/util/http';
import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster';
import { divIcon, Point } from 'leaflet';
import Barchart from '@/components/charts/Barchart.vue';

import {
  LMarker, LPopup,
} from 'vue2-leaflet';

const defaulticon = (style, count) => divIcon({
  html: `<div><span> ${count || ''}</span></div>`,
  className: `marker-cluster cluster-${style}`,
  iconSize: new Point(40, 40),
});

// 后端参数名
const TITLE_P = 'ji_gou_ming_cheng';

export default {
  name: 'Warning',
  components: {
    Map,
    OrgTable,
    'v-marker-cluster': Vue2LeafletMarkercluster,
    LMarker,
    LPopup,
    Barchart,
  },

  data() {
    return {
      info: [
        { icon: Icon1, title: '异常机构数量' },
        { icon: Icon2, title: '高危机构数量' },
        { icon: Icon3, title: '正常机构数量' },
      ],
      datum: [0, 0, 0],
      icons: [defaulticon('red'), defaulticon('yellow'), defaulticon('green')],

      // 地图的设置
      clusterOptions: [
        {
          spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
          iconCreateFunction(cluster) {
            return defaulticon('red', cluster.getChildCount());
          },
        },
        {
          spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
          iconCreateFunction(cluster) {
            return defaulticon('yellow', cluster.getChildCount());
          },
        },
        {
          spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
          iconCreateFunction(cluster) {
            return defaulticon('green', cluster.getChildCount());
          },
        },
      ],

      // 地图上显示的图表
      isShowing: false,

      title: '杭州市富阳区第一人民医院',
      type: '医疗机构',
      id: ' 5026',
      tipData: [],

      // x轴
      upX: [
        { title: '家庭病床', key: 'jia_ting_bing_chuang' },
        { title: '规定病种', key: 'gui_ding_bing_zhong' },
        { title: '普通门诊', key: 'pu_tong_men_zhen' },
        { title: '购药', key: 'gou_yao' },
      ],
      downX: [

      ],
    };
  },

  computed: {
    // 组件类型
    compType() {
      if (this.$route.params.routeType === 'organization') {
        return 1;
      }
      return 0;
    },
  },

  mounted() {
    this.getData();
  },

  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'getData',
  },

  methods: {
    getData() {
      if (this.compType === 0) {
        this.getFundInfo();
      } else {
        this.getOrganizationInfo();
      }
      this.isShowing = false;
    },
    updateShowStatus(value) {
      this.isShowing = value;
    },

    async getFundInfo() {
      const data = await fetchFundMonitorInfo({
        orgType: this.$route.params.routeType,
      });

      this.datum = [data.red ? data.red : {},
        data.yellow ? data.yellow : {},
        data.green ? data.green : {}];
    },

    async getOrganizationInfo() {
      const data = await fetchOrgViolationInfo();

      this.datum = [data.red, data.yellow, data.green];
    },

    click: (e) => console.log('clusterclick', e),
    ready: (e) => console.log('ready', e),

    // 点击marker
    onClick(e, name, index, cb) {
      // 计算展示的属性
      this.getOrgShowData(name, index);
      cb(e);
    },

    getOrgShowData(name, index) {
      this.id = name;
      this.title = this.datum[index][name][TITLE_P];

      this.tipData = [
        this.datum[index][name].ren_tou_ren_ci_bi,
        this.datum[index][name].jun_ci_fei_yong,
      ];
    },
  },

};
</script>

<style scoped lang="scss">
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

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
    p {
      margin: 0;
    }
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

    svg.line-box {
      z-index: 510;
      width: 10vw;;

      path {
        stroke: #cc4b58;
        fill: none;
      }
      circle {
        fill: #cc4b58;
      }
    }

    .card-container {
      height: 100%;
      width: 22vw;
      margin-left: -0.5vw;
      padding: 15px;
      display: grid;
      // display: flex;
      // flex-direction: column;
      grid-template-rows: 4% 4% 46% 46%;
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
        justify-content: flex-end;
        width: 18vw;
      }

      .s-two {
        display: flex;
        width: 100%;
        flex-direction: column;

        div {
          display: flex;
          justify-content: space-evenly;
        }
      }

      // 图例
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
    height: 60vh;
    opacity: 1;
  }

</style>
