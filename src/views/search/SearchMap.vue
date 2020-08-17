<template>
  <div>
    <v-card flat class="filter-card">
      <p class="sub-title">筛选条件</p>
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
      <div v-if="$route.meta.type===1" class="s-legends">
        <div class="divider" />
        <span :class="active?'checked':''">总店汇总</span>

        <div class="divider" />
        <p>地域类型</p>
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
        <p>机构类型</p>
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

    <Map>
      <!-- marker -->
      <template
        v-for="value in datum"
      >
        <l-marker
          v-for="(d,key) in value"
          :key="key"
          :lat-lng="[d.LAT, d.LNG]"
          :icon="icons[key]"
          >
        </l-marker>
      </template>
    </Map>
  </div>
</template>

<script>
import Map from '@/components/charts/Map.vue';
import { fetchOrgViolationInfo, fetchDetail } from '@/util/http';
import { LMarker } from 'vue2-leaflet';
import L from 'leaflet';
import image from '@/assets/search/下载.png';
import * as d3 from 'd3';

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
// TODO 切换图片
const iconFactory = (num) => L.icon({
  iconUrl: image,
  iconSize: [60 * num, 100 * num],
  iconAnchor: [30 * num, 100 * num],
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

export default {
  name: 'SearchMap',
  components: {
    Map,
    LMarker,
  },
  props: {
    routeType: String,
  },
  data() {
    return {
      dateStart: new Date('2019-01-01').toISOString().substr(0, 10),
      dateEnd: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,

      // 查询条件
      condition: '',

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

      datum: {
        red: {},
        green: {},
        yellow: {},
      },

      icons: {},
    };
  },

  computed: {
    label() {
      return ['医疗机构编码或名称', '药品/服务项目'][this.$route.meta.type];
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
      // TODO 确认这个参数
      const data = await fetchOrgViolationInfo({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        headquarters: this.active,
        areaType: 'local',
        orgType: 'public',
        searchItem: this.condition,
        pageNum: 1,
      });

      let minV = Number.MAX_VALUE;
      let maxV = Number.MIN_VALUE;
      const icons = {};
      Object.keys(data).forEach((key) => {
        Object.keys(data[key]).forEach((d) => {
          // 按数量获得比例尺
          minV = Math.min(minV,
            data[key][d].duo_di_kai_yao.num,
            data[key][d].qun_ti_jiu_yi.num,
            data[key][d].shua_kong_ka.num,
            data[key][d].xu_jia_zhu_yuan.num);

          maxV = Math.max(maxV,
            data[key][d].duo_di_kai_yao.num,
            data[key][d].qun_ti_jiu_yi.num,
            data[key][d].shua_kong_ka.num,
            data[key][d].xu_jia_zhu_yuan.num);
          // TODO 确认用什么数量
          icons[d] = data[key][d].xu_jia_zhu_yuan.num;
        });
      });

      const scale = d3.scaleLinear().domain([minV, maxV]).range([0.1, 1]);

      Object.keys(icons).forEach((d) => {
        icons[d] = iconFactory(scale(icons[d]));
      });

      this.datum = { ...data };
      this.icons = { ...icons };
    },

    toggleArea(name) {
      this.areaType[name] = !this.areaType[name];
    },

    toggleOrg(name) {
      this.orgType[name] = !this.orgType[name];
    },

    async getDetail() {
      const data = await fetchDetail({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        searchItem: this.condition,
        pageNum: 1,
      });
    },
    getData() {
      if (this.$route.meta.type === 1) {
        this.getOrgInfo();
      } else {
        this.data = [];
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
  },

};
</script>

<style scoped lang="scss">
  p.sub-title {
    font-family:PingFangSC-Semibold;
    font-size: 18px;
    color:#262626;
    letter-spacing:0;
    text-align:left;
    font-weight: bold;
    margin: 0;
  }

  p {
    margin: 0;
  }

  .filter-card {
    $check: #034ec3;

    border-radius: 10px;
    width: 11vw;
    background: rgba($color: #fcfcfc, $alpha: 0.85);
    position: absolute;
    top: 3vh;
    left: 2vw;
    z-index: 1100;
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
      :focus {
        color: #000;
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
        text-indent: 15px;
        margin: 5px 10px;
        cursor: pointer;
      }

      span::before {
        content: '';
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid #c0c0c0;;
        position: absolute;
        left: -10px;
      }

      span::after {
        content: '';
        width: 10px;
        height: 10px;
        top: 2px;
        border-radius: 50%;
        border: 1px solid #c0c0c0;
        position: absolute;
        left: -8px;
      }
    }

  }
</style>
