<template>
  <v-sheet class="m-container">
    <v-card class="s-tab-lists">
      <badge v-for="(item, index) in tabTitle" :key="item"
        :active="index === tabActive"
        :data="tabNumber[index]"
        :type="item"
        @click.native="changeTab(index)"
      />
    </v-card>

    <v-card class="s-charts">
      <!-- menu -->
      <div class="s-header">
        <div class="text-lg-h6 text-md-h6">
          <span>{{submenu}}</span> |
          <span>{{menuSubtitle[tabActive]}}</span>
        </div>

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
          <div>—</div>
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
      </div>

      <div class="s-charts-list">
        <!-- 折线图-->
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

        <v-divider></v-divider>

        <div class="calendar-view">
          <div class="chart-legends text-lg-body-2">
            <span class="legend">同比</span>
            <span class="legend">环比</span>
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
            :datum="data2019"
            :year="years[0]"
            :month="itemSelect2==='月'"
            :type="itemSelect2"
          />
          <calendar
            v-bind="setting"
            :datum="data2020"
            :year="years[1]"
            :month="itemSelect2==='月'"
            :type="itemSelect2"
          />
        </div>
      </div>
    </v-card>
  </v-sheet>
</template>

<script>
import LineChart from '@/components/LineChart.vue';
import layout from '@/mixins/layout';
import Badge from '@/views/monitor/badge.vue';
import Calendar from '@/components/Calendar.vue';
import { fetchFeeStatistics, fetchFeeTimeSeries } from '@/util/http';
import FUND_TYPE from '@/util/type';

const chart1Size = {
  width: 800,
  height: 350,
  margin: {
    bottom: 50, left: 80, top: 10, right: 20,
  },
};

const setting = {
  width: 800,
  height: 130,
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

export default {
  name: 'Monitor',

  components: {
    Badge,
    // LineChart,
    Calendar,
  },

  props: {
    submenu: String,
  },

  data: () => ({
    tabActive: 0,
    tabTitle: ['总医疗（元）', '医保列支（元）', '基金支出（元）', '门诊均次（元）', '人次人头（次）'],
    tabNumber: [32678903, 0, 0, 0, 0],

    menuTitle: '公立医院',
    menuSubtitle: ['总医疗费用', '医保列支费用', '基金支出费用', '门诊均次费用', '人次人头'],

    dateStart: new Date(2019, 0).toISOString().substr(0, 10),
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
      { value: 0, title: '月' },
      { value: 1, title: '周' },
      { value: 2, title: '日' },
    ],
    setting,
    data2019: [],
    data2020: [],
    years: [2019, 2020],
  }),

  mixins: [layout],

  mounted() {
    // fetch 总医疗的四个值
    this.getFeeStatistics();
    this.getFeeTimeSeries();
  },

  watch: {
    submenu() {
      this.getFeeStatistics();
      this.getFeeTimeSeries();
    },
    tabActive() {
      this.getFeeStatistics();
    },
  },

  methods: {
    changeTab(index) {
      this.tabActive = index;
    },

    async getFeeStatistics() {
      if (FUND_TYPE[this.submenu]) {
        const data = await fetchFeeStatistics({
          startDay: this.dateStart,
          endDay: this.dateEnd,
          fundType: FUND_TYPE[this.submenu],
        });

        this.tabNumber = [
          data.total,
          data.liezhi,
          data.fund,
          data.outpatient_average,
          data.inpatient_average,
          data.person_time_head_count,
        ];
      }
    },

    async getFeeTimeSeries(granularity = 'day') {
      const data = await fetchFeeTimeSeries({
        year: 2020,
        fundType: FUND_TYPE[this.submenu],
        feeType: FEE_TYPE[this.menuSubtitle[this.tabActive]],
        granularity,
        startDay: this.dateStart,
        endDay: this.dateEnd,
      });

      //  计算同比环比的最值 -》 映射color -> 更新color
    },
  },

};
</script>

<style scoped lang="scss">
  .m-container {
    display: flex;
    // grid-template-columns: 22% auto;
    // grid-gap: 0.8rem;
    height: 100%;
    padding: 0.8rem;
    background: $she-bg;

    .s-tab-lists {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      padding: 0 20px;
      min-width: max-content;
      flex-grow: 1;
    }

    .s-header {
      display: flex;
      justify-content: space-between;

      .time-container {
        display: flex;
        align-items: center;
        background: #fcfcfc;
      }

      .date-input {
        border: 2px solid #efefef;
        padding: 2px 5px;
        color: #7589a2;
        border-radius: 15px;
        width: 70px;
      }

      .date-input:focus {
        outline: none;
      }
    }

    .s-charts {
      display: flex;
      flex-direction: column;
      padding: 1rem 2rem;
      // width: 100%;
      margin-left: 1rem;
      width: 100%;

      .s-charts-list {
        display: grid;
        grid-template-rows: auto 1% 30vh;
        width: 100%;
      }

      .chart-legends {
        display: flex;
        width: 20%;
        align-items: center;
        margin: 20px 0;

        .v-input {
          border: 1px solid #cfcfcf;
        }

        .legend {
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
      }
    }

    .caledar-view {
      display: flex;
    }
  }
</style>
