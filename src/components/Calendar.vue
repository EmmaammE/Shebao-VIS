<template>
  <div class="calendar-container">
    <!-- <svg width='100%' height='100%'> -->
    <svg  height='100%' :viewBox="`0 0 ${width} ${height}`">
      <foreignObject x="0" y="0" width="100%" height="100%" class="mask">
        <Tooltip v-show="isShowing" v-bind="tipPos"
        >
          <div class="s-tip">
            <p>{{tipData.date}}</p>
            <p>{{tipData.number.toFixed(2)}}</p>
          </div>
        </Tooltip>
      </foreignObject>

      <text x="5" y="50%">{{year}}</text>
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <!-- <text v-for="(day,index) in daysLabel" :key="index"
          :x="-marginLeft"
          :y="(cellSize+cellPadding)*(index+0.5)"
          font-size="10px"
        >{{day}}</text> -->

        <template v-for="(data,j) in cellData">
          <rect v-for="(d,i) in data" :key="i+'r'+j"
            :width="i>=data.length-7 && !type ? cellLength-3 : cellLength"
            :height="i===data.length-1 && !type && d.getDay()!==0
              ? cellLength-3
              : (type === 1 ? cellLength + 3:cellLength )"
            :x="cellX(d)"
            :y="cellY(d)"
            :fill="cellColor(d)"
            @mousemove="showTooltip(d)"
          >
            <title>{{d}}</title>
          </rect>
          <rect
            v-show="type===0"
            :key="j+year"
            :x="cellX(data[data.length-7]) + cellLength - 3"
            :y="cellY(data[data.length-7]) - 3"
            :width="4"
            :height="4"
            fill="#fff"
          />
          <text
            :key="year+j+'t'"
            :x="cellX(data[15])"
            :y="-10"
          >{{j+1}}</text>
        </template>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Tooltip from '@/components/Tooltip.vue';

const format = d3.timeFormat('%Y%m%d');
/** d: Date */
const getWeekday = (d) => d.getUTCDay();
// 默认0表示星期天
const daysLabel = Array.from({ length: 7 }, (d, i) => `星期${'一二三四五六日'[i]}`);

export default {
  name: 'Calendar',
  components: {
    Tooltip,
  },
  props: {
    width: Number,
    height: Number,
    marginLeft: {
      type: Number,
      default: 20,
    },
    marginRight: {
      type: Number,
      default: 20,
    },
    marginBottom: {
      type: Number,
      default: 20,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
    cellSize: {
      type: Number,
      default: 10,
    },
    datum: Object,
    year: Number,
    /*
      NOTE 显示的格子的粒度
      月 周 日 （0，1，2）
    */
    type: Number,
  },

  data() {
    return {
      daysLabel,
      // 方块间的间距
      cellPadding: 1,
      // 是否显示tooltip
      isShowing: false,
      tipData: {
        date: '',
        number: 0.0,
      },
      tipPos: {
        left: 0,
        top: 0,
      },
    };
  },

  computed: {
    colorSchema() {
      const { extent } = this.handledDatum;
      return d3.scaleLinear()
        .range(['#ff5f43', '#5bd7c2'])
        .domain([-extent, extent]);
    },

    handledDatum() {
      const data = {};
      let minV = Number.MAX_VALUE;
      let maxV = Number.MIN_VALUE;

      let month = 1; let
        week = 0;
      let sum = 0;
      let tmp = [];

      const datumArr = Object.keys(this.datum);

      switch (this.type) {
        case 0:
          // 按月平均
          datumArr.forEach((key, index) => {
            if (+key.substr(5, 2) !== month || index === datumArr.length - 1) {
              if (index === datumArr.length - 1) {
                tmp.push(key);
                sum += this.datum[key];
              }

              const value = sum / tmp.length;
              tmp.forEach((day) => {
                data[day] = value;
              });
              minV = Math.min(minV, value);
              maxV = Math.max(maxV, value);

              sum = 0;
              month += 1;
              tmp = [];
            }
            tmp.push(key);
            sum += this.datum[key];
          });
          break;

        case 1:
          sum = 0;
          tmp = [];
          datumArr.forEach((key, index) => {
            const d = new Date(key);
            const currentWeek = d3.utcMonday.count(d3.utcYear(d), d);
            if (currentWeek !== week || index === datumArr.length - 1) {
              if (index === datumArr.length - 1) {
                tmp.push(key);
                sum += this.datum[key];
              }

              const value = sum / tmp.length;
              tmp.forEach((day) => {
                data[day] = value;
              });
              minV = Math.min(minV, value);
              maxV = Math.max(maxV, value);

              sum = 0;
              week += 1;
              tmp = [];
            }
            tmp.push(key);
            sum += this.datum[key];
          });
          break;

        case 2:
          // 按日计算
          datumArr.forEach((key) => {
            const value = this.datum[key];
            data[key] = value;
            minV = Math.min(minV, value);
            maxV = Math.max(maxV, value);
          });
          break;
        default:
      }

      const extent = Math.max(Math.abs(minV), Math.abs(maxV));

      return { data, extent };
    },

    actualData() {
      return this.handledDatum.data;
    },

    cellData() {
      // 按年份计算日期
      const cellData = Array.from({ length: 12 }, () => []);
      const dt = new Date(Date.UTC(this.year, 0, 1));
      while (dt <= new Date(Date.UTC(this.year, 11, 31))) {
        const month = dt.getMonth();
        cellData[month].push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }

      return cellData;
    },
    cellLength() {
      if (this.type) {
        return this.cellSize - this.cellPadding * 2;
      }
      return this.cellSize;
    },
  },

  methods: {
    cellX(d) {
      return d3.utcMonday.count(d3.utcYear(d), d)
         * this.cellSize + this.cellPadding;
    },

    cellY(d) {
      // 0代表星期天
      const index = d.getUTCDay() % 7;
      return ((index + 6) % 7) * this.cellSize + this.cellPadding;
    },

    cellColor(d) {
      const key = d.toISOString().substr(0, 10);
      if (this.actualData[key]) {
        if (this.actualData[key] === 0) {
          return '#fff';
        }
        return this.colorSchema(this.actualData[key]);
      }
      return '#eee';
    },

    showTooltip(d) {
      const key = d.toISOString().substr(0, 10);

      this.tipData = {
        number: this.actualData[key],
        date: key,
      };

      this.tipPos = {
        left: this.cellX(d),
        top: this.cellY(d) - 20,
      };

      this.isShowing = true;
    },
  },
};
</script>

<style scoped lang="scss">
  .s-tip {
    margin: 0;
    user-select: none;

    p {
      margin: 0;
    }
  }

  rect {
    cursor: pointer;
  }
</style>
