<template>
  <div class="map-container warning-people">
    <Map
      :class="openPopup?'':'hide-popup'"
    >
      <template v-if="datum[activeIndex]">
        <l-marker
          v-for="orgData in datum[activeIndex].chart"
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
              <!-- {{orgData.key}} -->
              <template v-if="openPopup">
                <div v-for="(d,index) in warning"
                  :key="index"
                >
                  <div v-if="wData[index][orgData.key]"
                    class="bar"
                  >
                    <span>{{d.value}}</span>
                    <bar
                      :scale="widthScale"
                      :data="wData[index][orgData.key]"
                      :color="d.color"
                    />
                  </div>
                </div>
              </template>
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
      <div class="content" @scroll="onScroll">
        <div
          v-for="(d,i) in datum"
          :key = "i"
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
      activeIndex: -1,
      radius: 200,
      rScale: d3.scaleLinear().range([200, 350]),
      options: {
        offset: new L.Point(1, 100),
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
      widthScale: d3.scaleLinear().range([0, 70]),

      // 是否显示Popup
      openPopup: false,
      pageNum: 1,

      // 是否正在处理
      busy: false,
    };
  },
  mounted() {
    this.getPatientViolationInfo();
  },

  watch: {
    activeIndex(newV) {
      this.getAllDetail(newV);
    },
  },

  methods: {
    onScroll(e) {
      const { target } = e;
      const bottomOff = target.getBoundingClientRect().height + target.scrollTop
        >= target.scrollHeight - 10;
      if (bottomOff && !this.busy) {
        this.busy = true;
        this.getPatientViolationInfo().then(() => {
          this.busy = false;
        });
      }
    },

    async getPatientViolationInfo() {
      // const data = await fetchPatientViolationInfo({
      //   // TODO 这个参数
      //   pageNum: 1,
      // });
      const { pageNum } = this;

      Promise.all([fetchPatientViolationInfo({
        pageNum,
      }), fetchPatientViolationInfo({
        pageNum: pageNum + 1,
      })]).then((res) => {
        this.pageNum = pageNum + 2;

        // NOTE 后端传过来的是数组
        this.$store.commit({
          type: 'updatemenu',
          data: [
            res[0].wei_gui_lie_zhi_fei_yong[0] + res[1].wei_gui_lie_zhi_fei_yong[0],
            res[0].wei_gui_ren_shu[0] + res[1].wei_gui_ren_shu[0],
            res[0].wei_gui_ji_gou_shu[0] + res[1].wei_gui_ji_gou_shu[0],
          ],
        });

        const result = this.datum.slice();
        let index = this.datum.length;

        res.forEach((d) => {
          Object.keys(d.patient_page).forEach((key) => {
            const chart = Object.keys(d.patient_page[key].yi_chang_ji_gou).map((orgKey) => {
              const orgData = d.patient_page[key].yi_chang_ji_gou[orgKey];

              const a = orgData.qun_ti_jiu_yi.patient;
              const b = orgData.shua_kong_ka.patient;
              const c = orgData.shua_xiao_ka.patient;
              const e = orgData.xu_jia_zhu_yuan.patient;

              return { ...orgData, ...{ sum: a + b + c + e, key: orgKey } };
            });

            result.push(
              {
                tableData: [index + 1,
                  key,
                  d.patient_page[key].name,
                  Object.keys(d.patient_page[key].yi_chang_ji_gou).length,
                  d.patient_page[key].qun_ti_jiu_yi,
                  d.patient_page[key].shua_kong_ka,
                  d.patient_page[key].shua_xiao_ka,
                  d.patient_page[key].xu_jia_zhu_yuan],
                chart,
              },
            );

            index += 1;
          });
        });

        this.datum = result;

        if (this.activeIndex === -1) {
          this.activeIndex = 0;
        }
        // this.$nextTick(() => {
        //   this.getAllDetail();
        // });
      });
    },

    async getPatientDetail(id) {
      const param = {
        patientId: id.trim(),
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

    getAllDetail(activeIndex) {
      // 对现在加载的请求详细信息
      if (activeIndex !== -1) {
        const id = this.datum[activeIndex].tableData[1];
        this.getPatientDetail(id);
      }
    },

    onClick(index) {
      this.activeIndex = index;
      this.wData = [
        // {id(机构代码): 次数}
        {}, {}, {}, {},
      ];
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
      border-radius: 50%;
      position: relative;
      width: 17px;
      height:17px;
      background: #fff;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after  {
        content: '';
        left: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
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
    overflow: auto;
  }
  .content::-webkit-scrollbar {
    width: 4px;
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

      span {
        display:inline-block;
        width:40%;
        word-wrap:break-word;
        white-space:normal;
      }

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
