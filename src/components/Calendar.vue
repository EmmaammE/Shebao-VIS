<template>
  <div class="calendar-container">
    <!-- <svg width='100%' height='100%'> -->
    <svg  height='100%' :viewBox="`0 0 ${width} ${height}`">
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="100%" y2="0%">
          <stop offset="0%" stop-color="#73cdbb" />
          <stop offset="50%" stop-color="#eee" />
          <stop offset="100%" stop-color="#eb745f" />
        </linearGradient>
      </defs>
      <text x="5" y="50%">{{year}}</text>

      <g :transform="`translate(${width-marginRight-marginLeft}, ${marginTop})`"
        v-if="year===2019">
          <text>{{colorSchema && colorSchema.domain()[0].toFixed(2)}}</text>
          <rect x="10" y="12" class="legend"
            width="5" :height="height/2" />
          <text y="75%">{{colorSchema && colorSchema.domain()[1].toFixed(2)}}</text>
        </g>
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <!-- <text v-for="(day,index) in daysLabel" :key="index"
          :x="-marginLeft"
          :y="(cellSize+cellPadding)*(index+0.5)"
          font-size="10px"
        >{{day}}</text> -->
        <template v-for="(data,j) in cellData">
          <rect v-for="(d,i) in data" :key="i+'r'+j"
            :width="i>=data.length-7 && !type ? cellLength-3 : cellLength-1"
            :height="i===data.length-1 && !type && d[2].getDay()!==0
              ? cellLength-3
              : (type === 1 ? cellLength + 3:cellLength-1 )"
            :x="cellX(d)"
            :y="cellY(d)"
            :fill="cellColor(d)"
            @mousemove="showTooltip($event, d)"
          >
            <!-- <title>{{d}}</title> -->
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
            :x="cellX(data[14])"
            :y="-10"
          >{{j+1}}</text>
        </template>

        <rect width="100%" height="100" @mouseleave="hideTooltip" fill="none" stroke="none"/>

      </g>

    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

// // 默认0表示星期天
const daysLabel = Array.from({ length: 7 }, (d, i) => `星期${'一二三四五六日'[i]}`);

export default {
  name: 'Calendar',

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
    // 按同比（0）还是环比（1）
    dataType: Number,
    colorSchema: Function,
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
        number: [0, 0],
      },
      tipPos: {
        left: 0,
        top: 0,
      },
    };
  },

  computed: {
    cellData() {
      const hash = {
        2019: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        2020: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      };
      // 按年份计算日期
      const cellData = Array.from({ length: 12 }, () => []);
      const dt = new Date(Date.UTC(this.year, 0, 1));
      let index = 0;
      if (this.year === 2019) {
        index = 7;
      } else {
        index = 6;
      }

      let count = 0;
      let indexMonth = 0;
      while (dt <= new Date(Date.UTC(this.year, 11, 31))) {
        const month = dt.getMonth();

        if (count === 7) {
          index += 7;
          count = 0;

          if (index > hash[this.year][indexMonth]) {
            index -= hash[this.year][indexMonth];
            indexMonth += 1;
          }
        }

        cellData[month].push(
          [
            `${this.year}-${String(`0${month + 1}`).slice(-2)}-01`,

            `${this.year}-${String(`0${indexMonth + 1}`).slice(-2)}-${String(`0${index}`).slice(-2)}`,

            new Date(dt),
          ],
        );
        dt.setDate(dt.getDate() + 1);
        count += 1;
      }

      return cellData;
    },
    cellLength() {
      if (this.type) {
        return this.cellSize - this.cellPadding;
      }
      return this.cellSize;
    },
  },

  methods: {
    cellX(d) {
      return d3.utcMonday.count(d3.utcYear(d[2]), d[2])
         * this.cellSize + this.cellPadding;
    },

    cellY(d) {
      // 0代表星期天
      const index = d[2].getUTCDay() % 7;
      return ((index + 6) % 7) * this.cellSize + this.cellPadding;
    },

    cellColor(d) {
      let key;
      if (typeof d[this.type] !== 'string') {
        key = d[this.type].toISOString().substr(0, 10);
      } else {
        key = d[this.type];
      }
      if (this.datum[key]) {
        if (this.datum[key].value === 0) {
          return '#eee';
        }
        return this.colorSchema(this.datum[key][this.dataType]);
      }
      // console.log(key);
      return '#eee';
    },

    showTooltip(e, d) {
      // console.log(e);
      const key = d[2].toISOString().substr(0, 10);
      let valueKey;
      if (this.type === 2) {
        valueKey = key;
      } else {
        valueKey = d[this.type];
      }

      if (this.datum[valueKey] === undefined) {
        return;
      }

      this.$emit('tooltip', true, {
        left: e.offsetX,
        top: e.offsetY - 15 + (+this.year - 2019) * 155,
        x: null,
      }, {
        number: this.datum[valueKey][0],
        number2: this.datum[valueKey][1],
        date: key,
        type: 1,
      });
    },

    hideTooltip() {
      this.$emit('tooltip', false, {
        left: 0,
        top: 0,
        x: 0,
      }, {
      });
    },
  },
};
</script>

<style scoped lang="scss">
  text {
    font-size: 10px;
  }

  .mask {
    pointer-events: none;
    transform: scale(0.6);

      p {
        margin: 0;
      }
  }

  rect {
    cursor: pointer;
  }

  rect.legend {
     fill: url(#gradient) #fff
  }
</style>
