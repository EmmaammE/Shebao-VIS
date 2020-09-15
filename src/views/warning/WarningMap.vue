<template>
  <div class="map-container">
    <div class="cards-container">
      <v-card v-for="(d,index) in info" :key="index"
        outlined
        width="13vw"
        @click="clickBadge(index)"
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
        @clusterclick="click"
        @ready="ready"
      >
        <template v-if="indexArr[index] === true">
          <l-marker v-for="(value, name) in d"
            :key="name" :lat-lng="[value.LAT, value.LNG]"
            :icon="id===name||isShowing===false?iconsInit[index]:icons[index]"
            @click="onClick($event,name,index,clickMarker)"
          >
          </l-marker>
        </template>
      </v-marker-cluster>
     </template>
    </Map>

    <!-- 地图上显示的图表container-->
    <div :class="['map-charts-container',
      compType===1?'cmp':'',isShowing?'active':''].join(' ')">
      <svg viewBox="0 0 100 200" class="line-box" :fill="color[colorIndex]">
        <!-- <circle fill="#bc2933" fill-opacity="0.3" cx="90" cy="20" r="15" /> -->
        <circle fill-opacity="0.3" cx="90" :cy="circlePos[1]" r="10" />
        <circle fill-opacity="0.5" cx="90" :cy="circlePos[1]" r="8" />
        <path :stroke="color[colorIndex]"
          :d="`M5 ${circlePos[0]}, L65,${circlePos[1]} L95,${circlePos[1]}`"/>
        <circle cx="90" :cy="circlePos[1]" r="5" />
      </svg>

      <!-- 地图上显示不同类型的图表 -->
      <v-card class="card-container" v-if="compType===0">
        <div>
          <h4>{{title}}</h4>
          <h4>{{type}} {{ id}}</h4>
        </div>
        <div class="charts-wrapper">
          <div class="two-charts">
          <!-- 图例 -->
          <div class="c-header">
            <p class="chart-title">2020年均次指标</p>
            <div class="img-wrapper">
              <img src="@/assets/warning/图例2.png"/>
            </div>
          </div>
          <!-- 图表一 -->
          <div class="s-two">
            <div class="chart-title">
              <span>人次人头比（次）</span>
              <span>均次费用（元）</span>
            </div>
            <barchart
              :type="1"
              :width="250"
              :height="120"
              :datum = "tipData"
              :yDomain="upX"
            />
          </div>
        </div>
          <div class="down-chart">
            <!-- 图例 -->
            <div class="c-header">
              <p class="chart-title">2020年年度指标</p>
              <div class="img-wrapper">
                <img src="@/assets/warning/图例3.png"/>
              </div>
            </div>

            <!-- 图表一 -->
            <barchart
              :type="0"
              :width="250"
              :height="120"
              :datum = "downData"
              :yDomain="downX"
            />
          </div>
        </div>
      </v-card>

      <!-- 机构预警 -->
      <org-table v-else
        :title="title"
        :id="id"
        :data="tipData[0]"
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

// opacity:1
const initicon = (style, count) => divIcon({
  html: `<div class="outer">
    <div class="inner">
      <span> ${count || ''}</span>
    </div>
  </div>`,
  className: `marker-cluster cluster-${style}`,
  iconSize: new Point(40, 40),
});
// opacity:0.35
const defaulticon = (style, count) => divIcon({
  html: `<div class="outer hide"}">
    <div class="inner">
      <span> ${count || ''}</span>
    </div>
  </div>`,
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
      iconsInit: [initicon('red'), initicon('yellow'), initicon('green')],

      // 显示index
      indexArr: [true, true, true],
      // 地图的设置
      clusterOptions: [
        {
          spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
          iconCreateFunction(cluster) {
            if (this.isShowing) {
              return defaulticon('red', cluster.getChildCount());
            }
            return initicon('red', cluster.getChildCount());
          },
        },
        {
          spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
          iconCreateFunction(cluster) {
            if (this.isShowing) {
              return defaulticon('yellow', cluster.getChildCount());
            }
            return initicon('yellow', cluster.getChildCount());
          },
        },
        {
          spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
          iconCreateFunction(cluster) {
            if (this.isShowing) {
              return defaulticon('green', cluster.getChildCount());
            }
            return initicon('green', cluster.getChildCount());
          },
        },
      ],

      // 地图上显示的图表
      isShowing: false,

      title: '杭州市富阳区第一人民医院',
      type: '医疗机构',
      id: null,
      tipData: [],
      // 底部的数据
      downData: [[], []],

      // x轴
      upX: [
        { title: '家庭病床', key: 'jia_ting_bing_chuang' },
        { title: '规定病种', key: 'gui_ding_bing_zhong' },
        { title: '普通门诊', key: 'pu_tong_men_zhen' },
        { title: '购药', key: 'gou_yao' },
      ],
      downX: [
        { title: '家庭病床', key: 'jia_ting_bing_chuang' },
        { title: '规定病种', key: 'gui_ding_bing_zhong' },
        { title: '普通门诊', key: 'pu_tong_men_zhen' },
        { title: '住院', key: 'zhu_yuan' },
        { title: '购药', key: 'gou_yao' },
      ],

      // svglinebox的颜色
      color: ['#b31011', '#ffb844', '#3ea264'],
      colorIndex: 0,
    };
  },

  computed: {
    // 组件类型
    compType() {
      if (this.$route.meta.activeIndex === 1) {
        return 1;
      }
      return 0;
    },
    circlePos() {
      if (this.$route.meta.activeIndex === 1) {
        return [110, 5];
      }
      return [80, 0];
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
        // console.log('fund');
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

    click: (e) => console.log('clusterclick', e.layer.getAllChildMarkers()),
    ready: (e) => console.log('ready', e),

    // 点击marker
    onClick(e, name, index, cb) {
      // 计算展示的属性
      this.getOrgShowData(name, index);
      setTimeout(() => {
        cb(e);
      }, 0);
    },

    clickBadge(index) {
      if (this.indexArr.filter((d) => d).length > 1 || !this.indexArr[index]) {
        // 如果任意两个是true, 只显示被点击的
        this.indexArr = Array(3).fill(null).map((e, i) => {
          if (i === index) {
            return true;
          }
          return false;
        });
      } else {
        // 只有一个为true，恢复为都显示
        this.indexArr = [true, true, true];
      }

      // 隐藏tooltip
      this.isShowing = false;

      // console.log(index);
    },

    getOrgShowData(name, index) {
      this.id = name;
      this.title = this.datum[index][name][TITLE_P];
      this.colorIndex = index;

      if (this.compType === 1) {
        this.tipData = [this.datum[index][name]];
      } else {
        this.tipData = [
          this.datum[index][name].ren_tou_ren_ci_bi,
          this.datum[index][name].jun_ci_fei_yong,
        ];

        // 底部的数据
        this.downData = [
          this.datum[index][name].nian_du_zhi_biao,
          this.datum[index][name].yue_du_zhi_biao,
        ];
      }
    },
  },

};
</script>

<style scoped lang="scss">
  @import "~leaflet.markercluster/dist/MarkerCluster.css";

  .map-container {
    width: 99%;
    margin: 4px;
    background: #fff;
  }

  .cards-container {
    position: absolute;
    top: 35px;
    right: 8%;
    z-index: 420;
    width: 100%;
    padding: 0 10% 0 20%;
    display: flex;
    justify-content: space-around;

    .v-card {
      background: rgba(255,255,255,.8)!important;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 1rem;

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
    height: 0;
    opacity: 0;
    position: absolute;
    // 地图容器高度的一半45vh - 一半的container高度30vh 还要看svg的比例
    top: 18vh;
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
        fill: none;
      }
    }

    .card-container {
      height: 99%;
      width: 21vw;
      margin-left: -1vw;
      padding: 15px;
      // display: grid;
      display: flex;
      flex-direction: column;
      // grid-template-rows: 4% 4% 46% 46%;
      justify-items: center;
      align-items: center;
      text-align: center;
      border-radius: 15px;

      hr {
        width: 100%;
        height: 1px;
      }

      .charts-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .two-charts {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 0 0 53%;

        .c-header .img-wrapper {
          margin-right: -18px;
          margin-top: -10px;
        }
      }

      .c-header {
        display: flex;
        justify-content: space-between;
        width: 18vw;
        padding: 10px;
        line-height: 30px;
        align-items: center;

        .img-wrapper {
          height: 30px;
          width: 8vw;
          margin-right: 20px;

          img {
            object-fit: cover;
            height: 30px;
          }
        }
      }

      p.chart-title {
        font-size: $sub-title;
        font-weight: bold;
      }
      .s-two {
        display: flex;
        width: 100%;
        flex-direction: column;

        div.chart-title  {
          display: flex;
          justify-content: space-evenly;
          font-size: $f-small;
          font-weight: bold;
          margin-left: 17%;
        }
      }
      // 图例
      .legends {
        $size: 10px;
        $color1: #1e5dc3;
        $color2: #d40309;
        height: 15px;
        font-size: $f-small;
        margin: 0 0 4px 0;

        span {
          position: relative;
          margin: 0 5px;
          display: inline-flex;
          align-items: center;
          line-height: 15px;
        }

        span::before {
          content: '';
          display: inline-block;
          width: $size;
          height: $size;
          margin: 0 5px;
          border-radius: 50%;
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
    height: 62vh;
    opacity: 1;
  }

  .down-chart {
    border-top: 1px solid #c7c7c7;

    .c-header {
      margin-bottom: -15px;
    }

    .c-header img {
      height: 30px!important;
    }
  }

  .two-charts, .down-chart {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    height: 100%;

    svg {
      flex-grow: 1;
    }
  }
</style>
