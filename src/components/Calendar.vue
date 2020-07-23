<template>
  <div class="calendar-container">
    <svg :width="width" :height="height">
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <text v-for="(day,index) in daysLabel" :key="index"
          :x="-marginLeft"
          :y="(cellSize+cellPadding)*(index+0.5)"
          font-size="10px"
        >{{day}}</text>

        <rect v-for="(d,i) in handledDatum" :key="i+'r'"
          :width="cellSize-cellPadding*2"
          :height="cellSize-cellPadding*2"
          :x="cellX(d)"
          :y="d.date.getUTCDay()*cellSize+cellPadding"
          :fill="colorSchema(d.value)"
        >
          <title>{{d.date}}</title>
        </rect>
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
  },

  methods: {
    cellX(d) {
      return d3.utcSunday.count(d3.utcYear(d.date), d.date)
         * this.cellSize + this.cellPadding;
    },
  },
};
</script>

<style scoped lang="scss">

</style>
