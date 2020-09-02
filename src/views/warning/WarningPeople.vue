<template>
  <div class="map-container">
    <Map
      :class="openPopup?'':'hide-popup'"
    >
      <template v-if="this.datum[this.activeIndex]">
        <l-marker
          v-for="orgData in this.datum[this.activeIndex].chart"
          :key="orgData.name"
          :icon="defaultIcon"
          @add="openPopupAction"
          :lat-lng="[orgData.LAT, orgData.LNG]">
          <l-popup
            class="people-pop"
            :options = "options"
          >
            <div class="pop-tip">
              <p>({{orgData.sum}})次</p>
              <p>{{orgData.name}}</p>
              <hr />
              <div v-for="(d,index) in warning"
                :key="index"
              >
              <div v-if="wData[index][orgData.key]"
                class="bar"
              >
                {{d.value}}
                <bar :scale="widthScale" :data="wData[index][orgData.key]"
                  :color="d.color"
                />
              </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </template>
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
import {
  fetchPatientViolationInfo, fetchPatientViolationGroup,
  fetchPatientViolationLittleCard, fetchPatientViolationFalseHospital,
} from '@/util/http';
import { LMarker, LPopup } from 'vue2-leaflet';
import L from 'leaflet';
import * as d3 from 'd3';
import image2 from '@/assets/search/map/2.png';
import Bar from './comp/Bar.vue';

const iconFactory = (image = image2, num = 0.5) => L.icon({
  iconUrl: image,
  iconSize: [60 * num, 100 * num],
  iconAnchor: [30 * num, 100 * num],
});

export default {
  components: {
    Map,
    LMarker,
    LPopup,
    Bar,
  },
  data() {
    return {
      datum: [],
      activeIndex: 0,
      radius: 200,
      rScale: d3.scaleLinear().range([200, 350]),
      options: {
        offset: new L.Point(1, 70),
        autoClose: false,
        closeOnClick: false,
        autoPan: false,
        closeButton: false,
      },
      defaultIcon: iconFactory(),

      // 三种异常
      warning: [
        { value: '群体就医', color: '#c11f48' },
        { value: '虚假住院', color: '#f87e4b' },
        { value: '刷小卡', color: '#ffcc60' },
        { value: '刷空卡', color: '#d84e5e' },
      ],
      // 异常值
      wData: [
        // {id(机构代码): 次数}
        {}, {}, {}, {},
      ],
      widthScale: d3.scaleLinear().range([0, 80]),

      // 是否显示Popup
      openPopup: false,
    };
  },
  mounted() {
    this.getPatientViolationInfo();
  },
  methods: {
    async getPatientViolationInfo() {
      // const data = await fetchPatientViolationInfo({
      //   // TODO 这个参数
      //   pageNum: 1,
      // });

      Promise.all([fetchPatientViolationInfo({
        pageNum: 1,
      }), fetchPatientViolationInfo({
        pageNum: 2,
      })]).then((res) => {
        // console.log(res);
        const data = { ...res[0] };
        data.patient_page = { ...res[0].patient_page, ...res[1].patient_page };
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

              return { ...orgData, ...{ sum: a + b + c + d, key } };
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

        this.$nextTick(() => {
          this.getAllDetail();
        });
      });
    },

    async getPatientDetail(id) {
      const param = {
        // 有很多没有值
        patientId: id,
      };
      // 请求详细信息
      const data = await Promise.all([
        fetchPatientViolationGroup(param),
        fetchPatientViolationFalseHospital(param),
        fetchPatientViolationLittleCard(param),
      ]);
      // console.log(data);

      const counts = [{}, {}, {}, {}];
      let maxV = 0;
      data.forEach((d, i) => {
        const count = {};
        // 对每一类异常
        Object.values(d).forEach((item) => {
          if (count[item.ji_gou_dai_ma] === undefined) {
            count[item.ji_gou_dai_ma] = 0;
          }
          count[item.ji_gou_dai_ma] += 1;
        });

        maxV = Math.max(maxV, ...Object.values(count));
        counts[i] = count;
      });

      this.wData = counts;
      this.widthScale = this.widthScale.domain([0, maxV]);
      // 显示popup
      this.openPopup = true;
    },

    getAllDetail() {
      // 对现在加载的请求详细信息
      const id = this.datum[this.activeIndex].tableData[1];
      this.getPatientDetail(id);
    },

    onClick(index) {
      this.activeIndex = index;
      this.getAllDetail();
    },

    openPopupAction(event) {
      this.$nextTick(() => {
        event.target.openPopup();
      });
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
    height: 80vh;
    margin: 15px;
    padding: 10px;
    opacity: .8;
    background: #f7f7f7;
    overflow: auto;
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
    font-size: 0.95rem;

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
    font-size: 0.8rem;
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

  .pop-tip {
    p {
      margin: 0;
      text-align: center;
      font-size: 0.85rem;
      font-weight: 600;
    }

    div.bar {
      display: flex;

      svg {
        flex-grow: 1;
        margin: 0 2px;

        text {
          font-size: 0.75rem;
        }
      }
    }

    hr {
      margin: 5px 0;
    }
  }
</style>
