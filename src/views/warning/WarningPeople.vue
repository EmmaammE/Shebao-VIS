<template>
  <div class="map-container">
    <Map>
      <l-marker
        v-for="orgData in org"
        :key="orgData.name"
        :lat-lng="[orgData.LAT, orgData.LNG]">
        <l-icon class-name="ring-icon" :iconSize="[rScale(orgData.sum), rScale(orgData.sum)]">
          <ring-mark
            :data="[orgData.qun_ti_jiu_yi,
              orgData.shua_kong_ka,
              orgData.shua_xiao_ka,
              orgData.xu_jia_zhu_yuan]"
            :sum ="orgData.sum"/>
        </l-icon>
      </l-marker>
    </Map>
    <v-sheet class="table-container">
      <div class="header">
        <span>序号</span>
        <span>参保人编号</span>
        <span>参保人</span>
        <span>异常机构</span>
        <span class="type-icon"></span>
        <span class="type-icon"></span>
        <span class="type-icon"></span>
        <span class="type-icon"></span>
      </div>
      <div class="content">
        <div
          v-for="(d,i) in datum"
          :key = "d.tableData[1]"
          :class="activeIndex===i?'s-row active':'s-row'"
          @click="onClick(i)"
        >
          <span v-for="(data,index) in d.tableData"
            :key="index"
          >
            {{data}}
          </span>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import Map from '@/components/charts/Map.vue';
import { fetchPatientViolationInfo } from '@/util/http';
import { LMarker, LIcon } from 'vue2-leaflet';
import RingMark from '@/components/small/RingMark.vue';
import * as d3 from 'd3';

export default {
  components: {
    Map,
    LMarker,
    LIcon,
    RingMark,
  },
  data() {
    return {
      datum: [],
      activeIndex: 0,
      radius: 200,
      rScale: d3.scaleLinear().range([200, 350]),
    };
  },
  mounted() {
    this.getPatientViolationInfo();
  },
  computed: {
    org() {
      if (this.datum.length > 0) {
        return { ...this.datum[this.activeIndex].chart };
      }
      return {};
    },
  },
  methods: {
    async getPatientViolationInfo() {
      const data = await fetchPatientViolationInfo({
        // TODO 这个参数
        pageNum: 2,
      });
      // console.log(data);

      let minV = Number.MAX_VALUE;
      let maxV = Number.MIN_VALUE;

      this.$store.commit({
        type: 'updatemenu',
        data: [
          data.wei_gui_ji_gou_shu,
          data.wei_gui_ren_shu,
          data.wei_gui_lie_zhi_fei_yong,
        ],
      });

      this.datum = Object.keys(data.patient_page)
        .map((key, index) => {
          const chart = Object.values(data.patient_page[key].yi_chang_ji_gou).map((orgData) => {
            const a = orgData.qun_ti_jiu_yi.all;
            const b = orgData.shua_kong_ka.all;
            const c = orgData.shua_xiao_ka.all;
            const d = orgData.xu_jia_zhu_yuan.all;

            minV = Math.min(a, b, c, d, minV);
            maxV = Math.max(a, b, c, d, maxV);

            return { ...orgData, ...{ sum: a + b + c + d } };
          });

          // 获得最大值和最小值
          return {
            tableData: [index + 1,
              key,
              data.patient_page[key].name,
              Object.keys(data.patient_page[key].yi_chang_ji_gou).length,
              data.patient_page[key].qun_ti_jiu_yi,
              data.patient_page[key].shua_kong_ka,
              data.patient_page[key].shua_xiao_ka,
              data.patient_page[key].xu_jia_zhu_yuan],
            chart,
          };
        });

      this.rScale = this.rScale.domain([minV, maxV]);
    },

    onClick(index) {
      this.activeIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
  .map-container{
    position: relative;
  }
  .table-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 23vw;
    height: 90vh;
    margin: 15px;
    padding: 10px;
    opacity: .8;
    background: #f7f7f7;
  }

  .header {
    font-weight: bold;
    // display: flex;
    // justify-content: space-evenly;
    display: grid;
    grid-template-columns: 12% 25% 15% 18% 8% 8% 8% 7.5%;
    line-height: 26px;
    align-items: center;
    text-align: center;
    font-size: 14px;

    .type-icon {
      display: block;
      $radius: 10px;
      $space: 3px;

      border-radius: 50%;
      position: relative;
      width: 2*$radius;
      height: 2*$radius;
      background: #fff;
      margin: 0;
      padding: 0;

      &::after  {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 2 * ($radius - $space);
        height: 2 * ($radius - $space);
        border-radius: 50%;
        top: 2px;
        left: 2px;
      }

    }

    @each $c in $yujing {
      $i: index($yujing, $c);
      span:nth-child(#{$i+4})::after {
        background: $c;
      }

      span:nth-child(#{$i+4}) {
        border: 1px solid $c;
      }
    }
  }

  .content {
    margin: 10px 0;
  }
  .content::-webkit-scrollbar {
    width: 4px;
    overflow: auto;
    max-height: calc(88vh - 40px);
  }

  .s-row {
    display: grid;
    grid-template-columns: 12% auto 15% 17% 8% 8% 8% 8%;
    align-items: center;
    cursor: pointer;
    padding: 4px 0;
    border: 1px solid #dadada;
    border-width: 1px 0;

    span {
      text-align: center;
    }
  }

  .active {
    background: linear-gradient(to right, #c7dff7, #eceff4);
  }
</style>
