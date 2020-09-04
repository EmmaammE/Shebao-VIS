<template>
  <div class="s-charts-list">
    <div v-if="subTitle" class="list-header">
      <v-divider></v-divider>
      <p>{{subTitle}}</p>
    </div>

    <!-- 折线图-->
    <div class="zhexian-c" ref="zheWrapper">
      <div class="chart-legends text-lg-body-2">
        <span class="legend"> <i></i> 2019</span>
        <span class="legend"> <i></i> 2020</span>
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
          :x1="lineTipPos.x" :y1="chart1Size.margin.top" :x2="lineTipPos.x"
          :y2="chart1Size.height-chart1Size.margin.bottom-chart1Size.margin.top" />
      </line-chart>

      <Tooltip v-show="isShowing" v-bind="lineTipPos">
        <div class="s-tip">
          <div class="inner">
            <p>{{tipData.date}}</p>
            <p v-if="tipData['2019']">2019：{{tipData['2019']}}万元</p>
            <p v-if="tipData['2020']">2020：{{tipData['2020']}}万元</p>
          </div>
        </div>
      </Tooltip>
    </div>

    <v-divider></v-divider>

    <div class="calendar-view" ref="calWrapper">
      <div class="chart-legends text-lg-body-2">
        <span
          :class="type === 1 ? 'active': ''"
          @click="type = 1"
        >
          环比
        </span>
        <span
          :class="type === 0 ? 'active': ''"
          @click="type = 0"
        >
          同比
        </span>
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

      <Tooltip v-show="isShowing" v-bind="tipPos">
        <div class="s-tip">
          <div class="inner">
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
</template>

<script>
import LineChart from '@/components/LineChart.vue';
import Calendar from '@/components/Calendar.vue';
import Tooltip from '@/components/Tooltip.vue';
import * as d3 from 'd3';

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

// 求对应的映射值
const hash = {
  2019: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  2020: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
};
const years = [
  [2019, 7],
  [2020, 6],
];

const YEAR_HASH = {};
years.forEach((d) => {
  // 按年份计算日期
  const year = d[0];
  let index = d[1];
  const dt = new Date(Date.UTC(year, 0, 1));

  let count = 0;
  let indexMonth = 0;
  while (dt <= new Date(Date.UTC(year, 11, 31))) {
    const month = dt.getMonth();

    if (count === 7) {
      index += 7;
      count = 0;

      if (index > hash[year][indexMonth]) {
        index -= hash[year][indexMonth];
        indexMonth += 1;
      }
    }

    YEAR_HASH[dt.toISOString().substr(0, 10)] = [
      `${year}-${String(`0${month + 1}`).slice(-2)}-01`,

      `${year}-${String(`0${indexMonth + 1}`).slice(-2)}-${String(`0${index}`).slice(-2)}`,

      dt.toISOString().substr(0, 10),
    ];

    dt.setDate(dt.getDate() + 1);
    count += 1;
  }
});

export default {
  // 折线图和日历图
  components: {
    LineChart,
    Calendar,
    Tooltip,
  },

  props: {
    // 当前的粒度
    itemSelect: Number,

    // 获得的数据
    dataFetch: Object,
    subTitle: String,
  },

  data() {
    return {
      chart1Size,
      setting,

      // 折线图
      xscale: d3.scaleLinear(),
      yscale: d3.scaleLinear(),
      lineDatum: [],
      linebox: {},

      // 日历图
      years: [2019, 2020],
      calendarDatum: [{}, {}],
      colorScale: [null, null],
      calbox: {},

      // type为0： 同比， 1：环比
      type: 1,

      // 获得的数据原始值
      datum: {
        2019: {},
        2020: {},
      },

      YEAR_HASH,

      // tooltip
      isShowing: false,
      tipData: {
        date: '2019-01-01',
      },
      tipPos: {
        left: 0,
        top: 0,
      },
      lineTipPos: {
        left: 0,
        top: 0,
        x: 0,
      },
    };
  },

  methods: {
    updateTooltip(isShowing, tipPos, tipData) {
      // console.log(isShowing, tipPos, tipData);
      if (tipData.date === undefined) {
        return;
      }

      this.isShowing = isShowing;

      this.tipPos = {
        left: tipPos.left,
        top: tipPos.top,
      };

      const { y, height } = this.linebox;
      this.lineTipPos = {
        x: tipPos.x,
        top: height / 2 - 40,
        left: tipPos.left,
      };

      const date = tipData.date.substr(5);
      const data1 = this.datum['2019'][YEAR_HASH[`2019-${date}`][this.itemSelect]];
      const data2 = this.datum['2020'][YEAR_HASH[`2020-${date}`][this.itemSelect]];
      this.tipData = {
        ...tipData,
        ...{
          2019: data1 ? data1.value.toLocaleString() : null,
          2020: data2 ? data2.value.toLocaleString() : null,
          date,
        },
      };
    },

    updateData(datafetch) {
      this.datum = datafetch;
      // tooltip
      this.isShowing = false;
      this.tipData = {};
      this.tipPos = {
        left: 0,
        top: 0,
      };
      this.lineTipPos = {
        left: 0,
        top: 0,
        x: 0,
      };

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
      this.yscale = this.yscale.domain([0, maxValue * 1.1]).nice();
      this.colorScale = extent.map((e) => d3.scaleLinear()
        .range(['#73cdbb', '#efefef', '#eb745f'])
        .domain([-e, 0, e]));
    },
  },

  watch: {
    dataFetch: {
      handler(datafetch) {
        this.updateData(datafetch);
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    this.linebox = this.$refs.zheWrapper.getBoundingClientRect();
    this.calbox = this.$refs.calWrapper.getBoundingClientRect();
  },

};
</script>

<style scoped lang="scss">
  .s-charts-list {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: hidden;
    padding-bottom: 2rem;

    .list-header {
      margin: 0.5rem 0;

      p {
        margin: 0.5rem 0 0 0;
      }
    }

    .zhexian-c {
      display: flex;
      flex-direction: column;
      position: relative;
    }

     .chart-legends {
        display: flex;
        width: 20%;
        align-items: center;
        margin: 20px 0;

        .v-input {
          border: 1px solid #cfcfcf;
        }

        span {
          display: flex;
          flex: 0 0 30%;
          justify-content: center;
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
    padding: 5px 7px;
    pointer-events: none;

    p {
      margin: 0;
      font-size: 0.5rem;
      text-align: center;
    }
  }

</style>
