<template>
  <div class="calendar-container">
    <!-- <svg width='100%' height='100%'> -->
    <svg  height='100%' :viewBox="`0 0 ${width} ${height}`">
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
            fill="#eee"
          >
            <title>{{d}}</title>
          </rect>
          <rect
            v-show="type!==1"
            :key="j+year"
            :x="cellX(data[data.length-7]) + cellLength - 3"
            :y="cellY(data[data.length-7]) - 3"
            :width="3"
            :height="3"
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

const format = d3.timeFormat('%Y%m%d');
/** d: Date */
const getWeekday = (d) => d.getUTCDay();
// 默认0表示星期天
const daysLabel = Array.from({ length: 7 }, (d, i) => `星期${'一二三四五六日'[i]}`);

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

    cellWidth(i) {

    },
  },
};
</script>

<style scoped lang="scss">

</style>
