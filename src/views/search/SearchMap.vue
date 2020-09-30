<template>
  <div class="search-map">
    <v-overlay v-if="loading" :value="loading" color="#fff" absolute z-index="600">
      <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
    </v-overlay>

    <v-card flat class="filter-card">
      <p class="she-title">筛选条件</p>
      <div class="divider" />
      <p>时间区间</p>

      <!-- 时间选择 -->
      <div class="time-container">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :return-value.sync="dateStart"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <input
              v-model="dateStart"
              v-bind="attrs"
              v-on="on"
              class="date-input"
            />
          </template>
          <v-date-picker v-model="dateStart" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu1 = false">取消</v-btn>
            <v-btn text color="primary" @click="$refs.menu1.save(dateStart)">保存</v-btn>
          </v-date-picker>
        </v-menu>
        <div>|</div>
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :return-value.sync="dateEnd"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
          <input
              v-model="dateEnd"
              v-bind="attrs"
              v-on="on"
              class="date-input"
            />
          </template>
          <v-date-picker v-model="dateEnd" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu2 = false">取消</v-btn>
            <v-btn text color="primary" @click="$refs.menu2.save(dateEnd)">保存</v-btn>
          </v-date-picker>
        </v-menu>
      </div>
      <!-- 时间选择 end-->

      <!-- slot-->
      <div v-if="$route.meta.type>0" class="s-legends">
        <div class="divider" />
        <span :class="active?'checked':''"
          @click="toggleZongdian"
        >总店汇总</span>

        <div class="divider" />
        <p :style="{marginLeft: '-10px'}">地域类型</p>
        <div class="type-check">
          <span
            v-for="(value, name) in areaType"
            :key="name"
            :class="value?'checked':''"
            @click="toggleArea(name)"
          >
            {{name}}
          </span>
        </div>

        <div class="divider" />
        <p :style="{marginLeft: '-10px'}">机构类型</p>
        <div class="color">
          <span
            v-for="(value, name) in orgType"
            :key="name"
            :class="value?'checked':''"
            @click="toggleOrg(name)"
          >
            {{name}}
          </span>
        </div>
      </div>

      <div v-else class="s-legends">

        <p :style="{marginLeft: '-10px'}">机构类型</p>
        <div class="color">
          <span
            v-for="(value, name) in orgType"
            :key="name"
            class="checked"
          >
            {{name}}
          </span>
        </div>
      </div>

      <div class="divider" />

      <!-- footer -->
      <input
        v-model="condition"
        :placeholder="label"
        class="s-input"
      />

      <div class="divider" />

      <div class="btn-container">
        <button @click="reset">重置</button>
        <button class="primary--text" @click="getData">查询</button>
      </div>
    </v-card>

    <Map
      :zoomcb="zoomUpdated"
      :class="openPopup?'':'hide-popup'"
    >
      <!-- marker 机构汇总-->
      <template v-if="$route.meta.type > 0">
        <template
          v-for="value in datum"
        >
          <l-marker
            v-for="(d,key) in value.value"
            :key="key"
            :lat-lng="[d.ji_ben_qing_kuang.LAT, d.ji_ben_qing_kuang.LNG]"
            :icon="defaultIcons[value.type]"
            @add="openPopupAction"
            @click="onClickMarker($event, key)"
          >
            <l-popup
              :options = "options"
            >{{d.ji_ben_qing_kuang.ji_gou_ming_cheng}}</l-popup>
          </l-marker>
        </template>
      </template>

      <!-- 费用明细 markers -->
      <template v-else>
        <v-marker-cluster
          :options="clusterOption"
        >
          <l-marker
            v-for="(d,key) in datum"
            :key="key"
            :lat-lng="[d.lat, d.lng]"
            :icon="d.icon"
            @add="openPopupAction"
            @click="onClickFeiyongMarker($event, key)"
          >
            <l-popup
              :options = "{...options, type: d.orgType}"
            >{{d.ji_gou_ming_cheng}}</l-popup>
          </l-marker>
        </v-marker-cluster>
      </template>
    </Map>

    <div class="map-tip" v-if="latLng"
      :style="{left: latLng.x+'px', top: latLng.y+'px'}"
    >
      <div class='inner' v-if="$route.meta.type > 0">
        <h2><router-link :to="'/search/profile/'+tipId">{{tip.name}}</router-link></h2>
        <p>机构编码：{{tip.ji_gou_dai_ma}}</p>
        <p>法定代表人：{{tip.fa_ding_dai_biao_ren}}</p>
        <p>地址：{{tip.di_zhi}}</p>
        <p>盈利类型：{{tip.ying_li_lei_xing}}</p>
      </div>

      <div class="inner" v-else>
        <v-data-table
          dense
          :headers="tableHeaders"
          :items="tableItems"
          :hide-default-footer="true"
          item-key="index"
          height="20vh"
          disable-sort
          fixed-header
          class="s-table"
        >
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import Map from '@/components/charts/Map.vue';
import {
  fetchOrgPortraitBasic, fetchDetail, fetchOrgInfo,
} from '@/util/http';
import { LMarker, LPopup } from 'vue2-leaflet';
import L from 'leaflet';
import image1 from '@/assets/search/map/1.png';
import image2 from '@/assets/search/map/2.png';
import image3 from '@/assets/search/map/3.png';
import image4 from '@/assets/search/map/4.png';
import image5 from '@/assets/search/map/5.png';
import image6 from '@/assets/search/map/6.png';
import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster';
// import * as d3 from 'd3';
import Piechart from '@/components/small/Piechart.vue';
import Vue from 'vue';

const HASH = {
  本地: 'local',
  市内异地: 'city',
  省内异地: 'province',
  跨省异地: 'trans_province',
  公立医院: 'public',
  民营医院: 'private',
  社区卫生服务中心: 'community',
  零售药店: 'drugstore',
  其他门诊部: 'outpatient',
  口腔内门诊部: 'oral',
};

const iconFactory = (image = image1, type = '', num = 0.5) => L.icon({
  iconUrl: image,
  iconSize: [60 * num, 100 * num],
  iconAnchor: [30 * num, 100 * num],
  type,
});

const initSatus = {
  dateStart: new Date('2019-01-01').toISOString().substr(0, 10),
  dateEnd: new Date().toISOString().substr(0, 10),
  active: 1,
  // 地域类型
  areaType: {
    本地: true, 市内异地: false, 省内异地: false, 跨省异地: false,
  },
  orgType: {
    公立医院: true,
    民营医院: false,
    社区卫生服务中心: false,
    零售药店: false,
    其他门诊部: false,
    口腔内门诊部: false,
  },
};

const getClusterData = (markers) => {
  const count = [0, 0, 0, 0, 0, 0];

  const hash = {
    public: 0,
    private: 1,
    community: 2,
    oral: 3,
    outpatient: 4,
    drugstore: 5,
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const marker of markers) {
    // console.log(marker.options.icon.options.type);
    const index = hash[marker.options.icon.options.type];
    if (index) {
      count[index] += 1;
    }
  }

  return count;
};

const EnhancedPiechart = Vue.extend(Piechart);

// marker cluster icon
const initicon = (cluster) => {
  const children = cluster.getAllChildMarkers();
  const data = getClusterData(children);

  const myPiechart = new EnhancedPiechart({
    propsData: {
      data,
    },
  }).$mount().$el;

  // console.log(myPiechart);

  const radius = 30 * Math.log(children.length);

  return L.divIcon({
    html: myPiechart.outerHTML,
    className: 'pie-chart-cluster',
    iconSize: new L.Point(radius, radius),
    iconAnchor: new L.Point(radius / 2, radius / 2),
  });
};

export default {
  name: 'SearchMap',
  components: {
    Map,
    LMarker,
    LPopup,
    'v-marker-cluster': Vue2LeafletMarkercluster,
  },
  props: {
    routeType: String,
  },
  data() {
    return {
      loading: true,
      dateStart: new Date('2019-01-01').toISOString().substr(0, 10),
      dateEnd: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,

      // 查询条件
      condition: null,

      // 总店汇总: 选中为 1，否则为 0,
      active: 1,
      // 地域类型
      areaType: {
        本地: true, 市内异地: false, 省内异地: false, 跨省异地: false,
      },
      orgType: {
        公立医院: true,
        民营医院: false,
        社区卫生服务中心: false,
        零售药店: false,
        其他门诊部: false,
        口腔内门诊部: false,
      },

      datum: {},

      icons: {},

      defaultIcons: {
        public: iconFactory(image2),
        private: iconFactory(image1),
        community: iconFactory(image3),
        oral: iconFactory(image4),
        outpatient: iconFactory(image5),
        drugstore: iconFactory(image6),
      },
      openPopup: false,

      options: {
        offset: new L.Point(1, 50),
        autoClose: false,
        closeOnClick: false,
        autoPan: false,
        closeButton: false,
      },

      latLng: null,
      tip: {},
      tipId: null,

      // cluster设置
      clusterOption: {
        spiderLegPolylineOptions: { weight: 1.5, color: '#efefef', opacity: 0.5 },
        iconCreateFunction(cluster) {
          return initicon(cluster);
        },
        // disableClusteringAtZoom: 14,
      },
      // icon: initicon('red'),

      tableHeaders: [
        {
          align: 'center', value: 'dan_jia', text: '单价', width: 50,
        },
        {
          align: 'center', value: 'fei_yong_zhan_bi', text: '费用占比', width: 70,
        },
        {
          align: 'center', value: 'fu_wu_yi_bao_ren_ci', text: '服务医保人次', width: 90,
        },
        {
          align: 'center', value: 'lie_zhi_fei_yong', text: '列支费用', width: 70,
        },
        {
          align: 'center', value: 'yao_pin_fu_wu_xiang_mu', text: '药品服务项目', width: 100,
        },
        {
          align: 'center', value: 'zong_fei_yong_zhi_chi', text: '总费用支出', width: 70,
        },
      ],
      tableItems: [],
    };
  },

  computed: {
    label() {
      return ['药品/服务项目', '药品/服务项目', '医疗机构编码或名称'][this.$route.meta.type];
    },
  },
  created() {
    // 组件创建完后获取数据，
    this.getData();
  },

  watch: {
    $route: 'getData',
  },

  methods: {
    async getOrgInfo() {
      const area = [];
      Object.keys(this.areaType).forEach((key) => {
        if (this.areaType[key]) {
          area.push(HASH[key]);
        }
      });

      const org = [];
      Object.keys(this.orgType).forEach((key) => {
        if (this.orgType[key]) {
          org.push(HASH[key]);
        }
      });

      Promise.all(org.map((d) => fetchOrgInfo({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        headquarters: this.active,
        areaType: area,
        orgType: d,
        searchItem: this.condition,
        pageNum: null,
      }))).then((values) => {
        const table = {
          page: {},
          total: 0,
        };

        const datum = values.map((d, index) => {
          table.page = { ...d.org_page };
          table.total += d.total_org_num;

          return {
            type: org[index],
            value: d.org_page,
          };
        });

        this.datum = datum;

        this.loading = false;

        // 将数据存成表格数据
        this.$store.commit({
          type: 'updateTableData',
          data: table,
        });
      });
    },

    toggleArea(name) {
      this.areaType[name] = !this.areaType[name];
    },

    toggleOrg(name) {
      this.orgType[name] = !this.orgType[name];
    },

    toggleZongdian() {
      this.active = (this.active + 1) % 2;
    },

    async getDetail() {
      const data = await fetchDetail({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        searchItem: this.condition,
        pageNum: null,
      });

      // 按照机构名称分组数据
      const result = {};

      Object.keys(data.fee_detail_page).forEach((key) => {
        const item = data.fee_detail_page[key];
        const org = item.ji_gou_ming_cheng;
        if (result[org] === undefined) {
          result[org] = {
            ji_gou_ming_cheng: org,
            lng: item.lng,
            lat: item.lat,
            orgType: item.orgType,
            children: [],
          };

          switch (result[org].orgType) {
            case 'private':
              result[org].icon = iconFactory(image1, result[org].orgType);
              break;
            case 'community':
              result[org].icon = iconFactory(image3, result[org].orgType);
              break;
            case 'oral':
              result[org].icon = iconFactory(image4, result[org].orgType);
              break;
            case 'outpatient':
              result[org].icon = iconFactory(image5, result[org].orgType);
              break;
            case 'drugstore':
              result[org].icon = iconFactory(image6, result[org].orgType);
              break;
            default:
              result[org].icon = iconFactory(image2, result[org].orgType);
              break;
          }
        }

        result[org].children.push({
          yao_pin_fu_wu_xiang_mu: item.yao_pin_fu_wu_xiang_mu,
          zong_fei_yong_zhi_chu: item.zong_fei_yong_zhi_chu,
          lie_zhi_fei_yong: item.lie_zhi_fei_yong,
          fei_yong_zhan_bi: item.fei_yong_zhan_bi,
          dan_jia: item.dan_jia,
          fu_wu_yi_bao_ren_shu: item.fu_wu_yi_bao_ren_shu,
          fu_wu_yi_bao_ren_ci: item.fu_wu_yi_bao_ren_ci,
        });
      });

      this.datum = result;
      this.loading = false;

      // 将数据存成表格数据
      this.$store.commit({
        type: 'updateTableData',
        data: {
          page: data.fee_detail_page,
          total: 0,
        },
      });
    },

    getData() {
      this.loading = true;
      switch (this.$route.meta.type) {
        // 机构画像
        case 2:
        case 1:
          // 机构汇总
          this.getOrgInfo();
          break;
        case 0:
          this.getDetail();
          break;
        default:
          console.log(this.$route.meta);
      }
    },

    reset() {
      this.areaType = { ...initSatus.areaType };
      this.dateStart = initSatus.dateStart;
      this.dateEnd = initSatus.dateEnd;
      this.active = initSatus.active;
      this.orgType = { ...initSatus.orgType };
      this.condition = '';
    },

    openPopupAction(event) {
      this.$nextTick(() => {
        event.target.openPopup();
      });
    },

    zoomUpdated(zoom) {
      if (zoom > 14) {
        this.openPopup = true;
      } else {
        this.openPopup = false;
      }
      this.tipId = null;
      this.latLng = null;
    },

    async onClickMarker(e, id) {
      if (id === this.tipId) {
        this.latLng = null;
        this.tipId = null;
      } else {
        const data = await fetchOrgPortraitBasic({
          orgId: id,
        });
        // console.log(e);
        this.latLng = e.containerPoint;
        this.tip = data;
        this.tipId = id;
      }
    },

    onClickFeiyongMarker(e, id) {
      this.latLng = e.containerPoint;
      this.tableItems = this.datum[id].children;
    },
  },

};
</script>

<style scoped lang="scss">
  @import "~leaflet.markercluster/dist/MarkerCluster.css";

  p {
    margin: 0;
  }

  .filter-card {
    $check: #034ec3;
    font-size: 0.8rem;

    border-radius: 10px;
    width: 11vw;
    background: rgba($color: #fcfcfc, $alpha: 0.85);
    position: absolute;
    top: 3vh;
    left: 2vw;
    z-index: 500;
    padding: 15px;
    box-shadow: 1px 2px 5px rgba($color: #000, $alpha: 0.1)!important;

    .time-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      background: #fcfcfc;
    }

    .date-input {
      border: 2px solid #efefef;
      padding: 5px 10px;
      color: #7589a2;
    }

    .date-input:focus {
      outline: none;
    }

    .divider {
      background: #efefef;
      height: 2px;
      border-color: #efefef;
      width: 100%;
      margin: 5px 0;
    }

    .s-input {
      padding: 5px 7px;
      color: #9c9c9c;
      padding: 5px 0;
      border: 1px solid;
      text-indent: 4px;

      &:focus {
        color: #000;
        outline: none;
      }
    }

    .btn-container {
      margin: 15px auto 5px;
      display: flex;
      flex-direction: column;
      width: 5vw;

      button {
        padding: 3px 15px;
        border: 1px solid #c0c0c0;
        border-radius: 15px;
        letter-spacing: 4px;
        margin: 5px 0;
        outline:none;
      }
    }

    .type-check {
      display: flex;
      flex-direction: column;
    }

    .s-legends {
      display: flex;
      flex-direction: column;
      padding-left: 14px;

      $type: #4c7dfe,#44b500,#ff9c29,#ff5345,#543ba4,#2db9cf;

      .color {
        display: flex;
        flex-direction: column;

        @each $c in $type {
          $i: index($type, $c);
          span:nth-child(#{$i}).checked::after {
              background: $c;
            }

          span:nth-child(#{$i}).checked::before {
            border: 1px solid $c;
          }
        }
      }

      span.checked::after {
        background: $check;
      }

      span.checked::before {
        border: 1px solid $check;
      }
      span {
        position: relative;
        margin: 5px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      span::before {
        content: '';
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid #c0c0c0;
        position: absolute;
        left: -20px;
      }

      span::after {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #c0c0c0;
        position: absolute;
        left: -18px;
      }
    }
}

.map-tip {
  z-index: 700;
  position: absolute;
  left: 0;
  top: 0;
  transition: all 300ms ease-in-out;
  text-align: center;
  padding-top: 15px;

  .inner {
    margin-left: -50%;
    margin-right: 50%;
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 8px -3px rgba($color: #000000, $alpha: .4);
    opacity: 0.9;

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left:  -7*1.414px;
      width: 0;
      height: 0;
      border: transparent solid 14px;
      border-bottom: 14px solid #fff;
    }
    p, h2 {
      margin: 0;
    }

    p {
      font-size: 14px;
    }

    h2 {
      font-size: 16px;
    }

    a {
      color: #000;
      text-decoration: none;
    }
  }
}
</style>
