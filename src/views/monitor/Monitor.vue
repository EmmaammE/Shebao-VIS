<template>
  <v-sheet class="m-container">
    <v-card class="s-charts">
      <div class="s-tab-lists">
        <badge v-for="(item, index) in tabTitle" :key="item"
          :active="index === tabActive"
          :data="tabNumber[index]"
          :type="item"
          @click.native="changeTab(index)"
        />
      </div>
      <!-- menu -->
      <div class="s-header">
        <div class="text-lg-h6 text-md-h6">
          <span>{{menuTitle}}</span> |
          <span>{{menuSubtitle[tabActive]}}</span>
        </div>

        <div class="select-area">
          <!-- 时间选择 -->
          <time-picker
            :dateEnd="dateEnd"
            :dateStart="dateStart"
            :menu1="menu1"
            :menu2="menu2"
          />
          <!-- 时间选择 end-->

          <v-select
            :items="items"
            v-model="itemSelect"
            item-text="title"
            item-value="value"
            height= "5"
            solo
            dense
            hide-details
            flat
          ></v-select>
        </div>
      </div>

      <div class="s-charts-list">
        <!-- 折线图-->
        <div class="zhexian-c">
          <div class="chart-legends text-lg-body-2">
            <span class="legend"> <i></i> 2019</span>
            <span class="legend"> <i></i>2020</span>
            <!-- <v-select
              :items="items"
              v-model="itemSelect"
              item-text="title"
              item-value="value"
              height= "5"
              solo
              dense
              hide-details
              flat
            ></v-select> -->
          </div>

          <line-chart
            v-bind="chart1Size"
            :gridLine = "true"
            :yScale="yscale"
            :type="itemSelect"
            :datum="lineDatum"
            @tooltip="updateTooltip"
          >
            <line
              v-if="isShowing"
              stroke="#babec7"
              stroke-dasharray="4 2"
              :x1="tipPos.x" :y1="chart1Size.margin.top" :x2="tipPos.x"
              :y2="chart1Size.height-chart1Size.margin.bottom-chart1Size.margin.top" />
          </line-chart>

          <Tooltip v-show="isShowing && datum['2019'][tipData.date]
            && tipData.type === 0" v-bind="tipPos">
            <div class="s-tip">
              <div>
                <p>{{tipData.date}}</p>
                <p>2019：{{datum['2019'][tipData.date]}}万元</p>
                <p>2020：{{datum['2020'][tipData.date]}}例</p>
              </div>
            </div>
          </Tooltip>
        </div>

        <v-divider></v-divider>

        <div class="calendar-view">
          <div class="chart-legends text-lg-body-2">
            <span
              :class="type === 1 ? 'active': ''"
              @click="type = 1"
            >环比</span>
            <span
              :class="type === 0 ? 'active': ''"
              @click="type = 0"
            >同比</span>

            <!-- <v-select
              :items="items2"
              v-model="itemSelect2"
              item-text="title"
              item-value="value"
              height= "5"
              solo
              dense
              hide-details
              flat
            ></v-select> -->
          </div>

          <!-- 日历图 -->
          <calendar
            v-for='n in 2'
            :key="n+'c'"
            v-bind="setting"
            :datum="calendarDatum[n-1]"
            :year="years[n-1]"
            :type="itemSelect"
            :dataType="type"
            :colorSchema="colorScale[type]"
            @tooltip="updateTooltip"
          />

          <Tooltip v-show="isShowing && tipData.type === 1" v-bind="tipPos">
            <div class="s-tip">
              <div>
                <p>{{tipData.date}}</p>
                <p>同比：{{tipData.number > 0 ?
                   '↑'+tipData.number.toFixed(2):'↓'+(-tipData.number).toFixed(2)}}</p>
                <p>环比：{{tipData.number2 > 0 ?
                   '↑'+tipData.number2.toFixed(2):'↓'+(-tipData.number2).toFixed(2)}}</p>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    </v-card>
  </v-sheet>
</template>

<script>
import Badge from '@/views/monitor/badge.vue';
import Calendar from '@/components/Calendar.vue';
import {
  fetchFeeStatistics, fetchFeeTimeSeries, fetchFundDetailStatistics, fetchFundDetailTimeSeries,
} from '@/util/http';
import { FUND_TYPE, ROUTE_PARAM } from '@/util/type';
import TimePicker from '@/components/small/TimePicker.vue';
import LineChart from '@/components/LineChart.vue';
import * as d3 from 'd3';
import tooltip from '@/mixins/tooltip';
import Tooltip from '@/components/Tooltip.vue';

const chart1Size = {
  width: 1200,
  height: 400,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};

const setting = {
  width: 850,
  height: 100,
  cellSize: 14,
  marginLeft: 40,
  marginTop: 20,
};

const FEE_TYPE = {
  总医疗费用: 'total',
  医保列支费用: 'liezhi',
  基金支出费用: 'fund',
  门诊均次费用: 'outpatient_average',
  住院均次费用: 'inpatient_average',
  人次人头: 'person_time_head_count',
};

const FEE_STRUCTURE = {
  // fee_structure
  药品费用: 'drug_fee',
  检查费用: 'check_fee',
  手术治疗: 'surgical_fee',
  物理治疗: 'physical_fee',
  中医治疗: 'tcm_fee',
  口腔治疗: 'oral_fee',
};

const LIE_ZHI_TYPE = {
  // liezhi
  统筹金额: 'overall_fund',
  当年账户: 'current_year',
  历年账户: 'past_year',
  大病保险: 'serious_illness',
  医疗救助: 'medical_assistance',
};

const funds = {
  liezhi: LIE_ZHI_TYPE,
  fee_structure: FEE_STRUCTURE,
};

const DATA_TYPE = ['chain_ratio', 'year_ratio'];
export default {
  name: 'Monitor',

  components: {
    Badge,
    Calendar,
    TimePicker,
    LineChart,
    Tooltip,
  },

  props: {
    routeType: String,
  },

  data: () => ({
    tabActive: 0,
    tabTitle: ['总医疗（元）', '医保列支（元）', '基金支出（元）', '门诊均次（元）', '人次人头（次）'],
    tabNumber: [32678903, 0, 0, 0, 0],

    // menuTitle: '公立医院',
    menuSubtitle: ['总医疗费用', '医保列支费用', '基金支出费用', '门诊均次费用', '人次人头'],

    dateStart: new Date('2019-01-01').toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menu1: false,
    menu2: false,

    chart1Size,
    items: [
      { value: 0, title: '月', key: 'month' },
      { value: 1, title: '周', key: 'week' },
      { value: 2, title: '日', key: 'day' },
    ],
    itemSelect: 1,
    lineDatum: [],
    xscale: d3.scaleLinear(),
    yscale: d3.scaleLinear(),

    // 日历图
    // itemSelect2: 0,
    // items2: [
    //   { value: 0, title: '月', key: 'month' },
    //   { value: 1, title: '周', key: 'week' },
    //   { value: 2, title: '日', key: 'day' },
    // ],
    setting,
    years: [2019, 2020],
    calendarDatum: [{}, {}],

    // type为0： 同比， 1：环比
    type: 1,
    // 获得的数据原始值
    datum: {
      2019: {},
      2020: {},
    },

    // 0就是默认的， 1是liezhi, 2fee_structure
    param_type: '',
    lidu: ['month', 'week', 'day'],

    // tooltip
    isShowing: false,
    tipData: {},
    tipPos: {
      left: 0,
      top: 0,
      x: 0,
    },

    colorScale: [null, null],
  }),

  // mixins: [tooltip],

  mounted() {
    // fetch 总医疗的四个值
    this.getData(this.routeType);
  },

  computed: {
    menuTitle() {
      return ROUTE_PARAM[this.routeType];
    },
  },

  watch: {
    routeType(newValue) {
      this.tabActive = 0;
      this.getData(newValue);
    },
    tabActive() {
      if (this.$route.params.routeType === 'liezhi'
        || this.$route.params.routeType === 'feiyong') {
        this.getFeeTimeSeries(0);
      } else {
        this.getFeeTimeSeries(1);
      }
    },
    itemSelect() {
      if (this.$route.params.routeType === 'liezhi'
        || this.$route.params.routeType === 'feiyong') {
        this.getFeeTimeSeries(0);
      } else {
        this.getFeeTimeSeries(1);
      }
    },
  },

  methods: {
    // updateTooltip(showing, tipData, tipPos) {
    // },
    updateTooltip(isShowing, tipPos, tipData) {
      // console.log(isShowing, tipPos, tipData);

      this.isShowing = isShowing;
      this.tipPos = {
        left: tipPos.left,
        top: tipPos.top,
        x: tipPos.x,
      };
      this.tipData = tipData;
    },
    getData(value) {
      let type = 0;
      if (value === 'liezhi') {
        this.param_type = 'liezhi';
        this.getFund();
      } else if (value === 'feiyong') {
        this.param_type = 'fee_structure';
        this.getFund();
      } else {
        type = 1;
        this.getFeeStatistics();
      }

      this.getFeeTimeSeries(type);
    },

    changeTab(index) {
      this.tabActive = index;
    },

    async getFeeStatistics() {
      const data = await fetchFeeStatistics({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        fundType: this.routeType,
      });

      this.tabNumber = [
        data.total,
        data.liezhi,
        data.fund,
        data.outpatient_average,
        data.inpatient_average,
        data.person_time_head_count,
      ];
    },

    async getFund() {
      const data = await fetchFundDetailStatistics({
        startDay: this.dateStart,
        endDay: this.dateEnd,
        type: this.param_type,
      });

      this.tabNumber = Object.values(funds[this.param_type]).map((value) => data[value]);

      this.tabTitle = Object.keys(funds[this.param_type]).map((d) => `${d}（元)`);

      this.menuSubtitle = Object.keys(funds[this.param_type]);
    },

    async getFeeTimeSeries(type) {
      const granularity = this.lidu[this.itemSelect];
      let datafetch;
      if (type === 1) {
        datafetch = await fetchFeeTimeSeries({
          fundType: this.routeType,
          feeType: FEE_TYPE[this.menuSubtitle[this.tabActive]],
          granularity,
          startDay: this.dateStart,
          endDay: this.dateEnd,
        });
      } else {
        datafetch = await fetchFundDetailTimeSeries({
          mainType: this.param_type,
          secondType: Object.keys(funds[this.param_type])[this.tabActive],
          granularity,
          startDay: this.dateStart,
          endDay: this.dateEnd,
          // TODO thirdType
          thirdType: null,
        });
      }

      this.datum = datafetch;
      // 日历图的数据
      const data = [{}, {}];
      // 折线图的数据
      const data2 = [{}, {}];
      let maxValue = Number.MIN_VALUE;

      const minV = [Number.MAX_VALUE, Number.MAX_VALUE];
      const maxV = [Number.MIN_VALUE, Number.MIN_VALUE];

      Object.keys(datafetch).forEach((key) => {
        const item = {};
        const item2 = [];
        Object.keys(datafetch[key]).forEach((d) => {
          item[d] = [datafetch[key][d].year_ratio, datafetch[key][d].chain_ratio];
          const { value } = datafetch[key][d];

          maxValue = Math.max(maxValue, value);
          minV[0] = Math.min(minV[0], datafetch[key][d].year_ratio);
          maxV[0] = Math.max(maxV[0], datafetch[key][d].year_ratio);
          minV[1] = Math.min(minV[1], datafetch[key][d].chain_ratio);
          maxV[1] = Math.max(maxV[1], datafetch[key][d].chain_ratio);

          item2.push(value);
          if (d === '2019-02-28') {
            item2.push(0);
          }
        });
        if (key === '2019') {
          data[0] = item;
          data2[0] = item2;
        } else {
          data[1] = item;
          data2[1] = item2;
        }
      });

      const extent = minV.map((min, index) => Math.max(Math.abs(min), Math.abs(maxV[index])));

      this.calendarDatum = data;
      this.lineDatum = data2;
      this.yscale = this.yscale.domain([0, maxValue]).nice();
      this.colorScale = extent.map((e) => d3.scaleLinear()
        .range(['#73cdbb', '#efefef', '#eb745f'])
        .domain([-e, 0, e]));
    },
  },

};
</script>

<style scoped lang="scss">
  .m-container {
    display: flex;
    height: 100%;
    padding: 0.8rem;
    background: $she-bg;

    .s-tab-lists {
      display: flex;
      justify-content: space-between;
      // padding: 0 20px;
    }

    .s-header {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }

    .s-charts {
      display: flex;
      flex-direction: column;
      padding: 2rem;
      width: 100%;

      .s-charts-list {
        display: flex;
        flex-direction: column;
        height: 68vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 2rem;
      }

      .select-area {
        display: flex;

        .v-input {
          border: 1px solid #cfcfcf;
          width: 100px;
        }

      }

      .chart-legends {
        display: flex;
        width: 20%;
        align-items: center;
        margin: 20px 0;

        .zhexian-c {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .v-input {
          border: 1px solid #cfcfcf;
        }

        span {
          flex: 0 0 30%;
          display: flex;
          align-items: center;
          position: relative;
          padding: 4px 10px;
          border: 1px solid #cfcfcf;
          border-radius: 4px;
          margin-right: 15px;
          cursor: pointer;

          i {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            margin: 0 0.5rem 0 0;
          }
        }

        span:nth-child(1) {
          i {
            background: #6672fb;
          }
        }

        span:nth-child(2) {
          i {
            background: #d8adf2;
          }
        }

        span.active {
          color: #1976d2;
        }
      }
    }

    .calendar-view {
      flex: 1 0 45%;
      position: relative;
    }

    .s-tip {
      div {
        margin: 5px 7px;
      }
      p {
        margin: 0;
        font-size: 14px;
      }
      pointer-events: none;
    }
  }
</style>
