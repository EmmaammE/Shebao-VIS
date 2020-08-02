<template>
  <div class="calendar-container">
    <svg :width="width" :height="height">
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <text v-for="(day,index) in daysLabel" :key="index"
          :x="-marginLeft"
          :y="(cellSize+cellPadding)*(index+0.5)"
          font-size="10px"
        >{{day}}</text>

        <template v-for="(data,j) in cellData">
          <rect v-for="(d,i) in data" :key="i+'r'+j"
            :width="i>=data.length-7 && month ? cellLength-3 : cellLength"
            :height="i===data.length-1 && month && d.getDay()!==6?cellLength-3:cellLength"
            :x="cellX(d)"
            :y="d.getUTCDay()*cellSize+cellPadding"
            fill="#eee"
          >
            <title>{{d}}</title>
          </rect>
          <rect
            :key="j+year"
            :x="cellX(data[data.length-7])+cellLength-3"
            :y="data[data.length-7].getUTCDay()*cellSize+cellPadding-3"
            :width="3"
            :height="3"
            fill="#fff"
          />
          <text
            :key="year+j+'t'"
            :x="cellX(data[15])"
          >{{j+1}}</text>
        </template>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

const format = d3.timeFormat('%Y%m%d');
/** d: Date */
const getWeekday = (d) => d.getUTCDay();
// 默认0表示星期天
const daysLabel = Array.from({ length: 7 }, (d, i) => `星期${'日一二三四五六'[i]}`);

export default {
  name: 'Calendar',
  components: {

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
    colorSchema: {
      type: Function,
      default: d3.scaleLinear().range(['#000', '#002b53']).domain([20000, 30000]),
    },

    datum: Array,
    year: Number,
    // 是否按月显示
    month: Boolean,
  },

  data() {
    return {
      daysLabel,
      // 方块间的间距
      cellPadding: 1,
    };
  },

  computed: {
    handledDatum() {
      const arr = [];
      // 将日期字符串处理为Date对象
      this.datum.forEach((d) => {
        arr.push({
          date: new Date(d.date),
          value: +d.value,
        });
      });
      return arr;
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
      if (!this.month) {
        return this.cellSize - this.cellPadding * 2;
      }
      return this.cellSize;
    },
  },

  methods: {
    cellX(d) {
      return d3.utcSunday.count(d3.utcYear(d), d)
         * this.cellSize + this.cellPadding;
    },

    cellY(d) {
      // 0代表星期天
      return ((d.getUTCDay() - 1) % 7) * this.cellSize + this.cellPadding;
    },
  },
};
</script>

<style scoped lang="scss">

</style>
