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

        <!-- 时间选择 -->
        <time-picker
          :dateEnd="dateEnd"
          :dateStart="dateStart"
          :menu1="menu1"
          :menu2="menu2"
        />
        <!-- 时间选择 end-->
      </div>

      <div class="s-charts-list">
        <!-- 折线图-->
        <div class="zhexian-c">
          <div class="chart-legends text-lg-body-2">
            <span class="legend"> <i></i> 2019</span>
            <span class="legend"> <i></i>2020</span>
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

            <!-- :datum="datumXY"
            :scale ="{xDomain, xType, yDomain, yType}" -->
          <line-chart
            v-bind="chart1Size"
            :gridLine = "true"
          >
          </line-chart>

        </div>

        <v-divider></v-divider>

        <div class="calendar-view">
          <div class="chart-legends text-lg-body-2">
            <span
              :class="type === 0 ? 'active': ''"
              @click="type = 0"
            >同比</span>
            <span
              :class="type === 1 ? 'active': ''"
              @click="type = 1"
            >环比</span>
            <v-select
              :items="items2"
              v-model="itemSelect2"
              item-text="title"
              item-value="value"
              height= "5"
              solo
              dense
              hide-details
              flat
            ></v-select>
          </div>

          <!-- 日历图 -->
          <calendar
            v-bind="setting"
            :datum="calendarDatum[0]"
            :year="years[0]"
            :type="itemSelect2"
            :dataType="type"
          />
          <calendar
            v-bind="setting"
            :datum="calendarDatum[1]"
            :year="years[1]"
            :type="itemSelect2"
            :dataType="type"
          />
        </div>
      </div>
    </v-card>
  </v-sheet>
</template>

<script>
import Badge from '@/views/monitor/badge.vue';
import Calendar from '@/components/Calendar.vue';
import { fetchFeeStatistics, fetchFeeTimeSeries } from '@/util/http';
import { FUND_TYPE, ROUTE_PARAM } from '@/util/type';
import TimePicker from '@/components/small/TimePicker.vue';
import LineChart from '@/components/LineChart.vue';

const chart1Size = {
  width: 800,
  height: 350,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};

const setting = {
  width: 800,
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

const DATA_TYPE = ['chain_ratio', 'year_ratio'];
export default {
  name: 'Monitor',

  components: {
    Badge,
    Calendar,
    TimePicker,
    LineChart,
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
      { value: 0, title: '月' },
      { value: 1, title: '周' },
      { value: 2, title: '日' },
    ],
    itemSelect: 0,

    // 日历图
    itemSelect2: 0,
    items2: [
      { value: 0, title: '月', key: 'month' },
      { value: 1, title: '周', key: 'week' },
      { value: 2, title: '日', key: 'day' },
    ],
    setting,
    years: [2019, 2020],

    // type为0： 同比， 1：环比
    type: 0,
    // 获得的数据原始值
    datum: {},
  }),

  mounted() {
    // fetch 总医疗的四个值
    this.getFeeStatistics();
    this.getFeeTimeSeries();
  },

  computed: {
    calendarDatum() {
      // 日历图的数据
      const data = [{}, {}];
      Object.keys(this.datum).forEach((key) => {
        const item = {};
        Object.keys(this.datum[key]).forEach((d) => {
          item[d] = [this.datum[key][d].year_ratio, this.datum[key][d].chain_ratio];
        });
        if (key === '2019') {
          data[0] = item;
        } else {
          data[1] = item;
        }
      });

      return data;
    },
    menuTitle() {
      return ROUTE_PARAM[this.routeType];
    },
  },

  watch: {
    routeType() {
      this.getFeeStatistics();
      this.getFeeTimeSeries();
    },
    tabActive() {
      this.getFeeTimeSeries();
    },
  },

  methods: {
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

    async getFeeTimeSeries(granularity = 'day') {
      // if (FUND_TYPE[this.submenu]) {
      const data = await fetchFeeTimeSeries({
        fundType: this.routeType,
        feeType: FEE_TYPE[this.menuSubtitle[this.tabActive]],
        granularity,
        startDay: this.dateStart,
        endDay: this.dateEnd,
      });

      this.datum = data;
    },
  },

};
</script>

<style scoped lang="scss">
  .m-container {
    display: flex;
    height: 100%;
    padding: 0.5rem 0.8rem;
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
      padding: 1rem 2rem;
      width: 100%;

      .s-charts-list {
        display: flex;
        flex-direction: column;
        height: 68vh;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .chart-legends {
        display: flex;
        width: 20%;
        align-items: center;
        margin: 20px 0;

        .zhexian-c {
          display: flex;
          flex-direction: column;
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
            background: coral;
            border-radius: 50%;
            margin: 0 0.5rem 0 0;
          }
        }

        span.active {
          color: #1976d2;
        }
      }
    }

    .calendar-view {
      flex: 1 0 45%;
    }
  }
</style>
