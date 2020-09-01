<template>
  <div class="line-chart">
    <svg
      v-if ="datum.length!==0"
      :viewBox="`0 0 ${width} ${height}`"
        ref="paths"

    >
      <defs>
        <clipPath id="clip">
          <rect x="0" y="0" :width="chartWidth" :height="chartHeight" />
        </clipPath>
      </defs>

      <g class="barchart-axis"
        :transform='`translate(${margin.left}, ${margin.top})`'
      >

        <g class="grid-line">
          <line :y2="chartHeight" v-for="n in 11" :key="n"
            :transform="`translate(${chartX[1](new Date(Date.UTC(2020, n, 1)))},0)`"
            :id="new Date(Date.UTC(2020, n, 0))"
           />
          <line :transform="`translate(${chartX[1](new Date(Date.UTC(2020, 12, 0)))},0)`"
            :y2="chartHeight"  />
          <line :transform="`translate(${chartX[1](new Date(Date.UTC(2020, 0, 0)))},0)`"
            :y2="chartHeight"  />
        </g>

        <g v-axis:x="{scale: chartX[1], tickFormat: timeParse}"
          :transform='`translate(0, ${chartHeight})`'
          class="xaxis"
        />

        <g v-axis:y="{scale: chartY}"
          class="yaxis"
           :transform='`translate(-20, 0)`'
        />
      </g>

      <g clip-path ="url(#clip)"
        :transform='`translate(${margin.left}, ${margin.top})`'
      >
        <path
          :d="line(datum[0])"
          stroke="#6672fb"
        />
        <path
          :d="line(datum[1])"
          stroke="#d8adf2"
        />
      </g>

      <slot></slot>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { axisDirective } from '@/directives/axis';
// d3 reference：
// https://observablehq.com/@connor-roche/multi-line-chart-focus-context-w-mouseover-tooltip
export default {
  name: 'LineChart',

  props: {
    width: Number,
    height: Number,
    margin: {
      type: Object,
      default: () => ({
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }),
    },
    // 比例尺
    // xScale: Function,
    yScale: Function,
    // 数据
    datum: Array,
    colorScheme: Array,

    // 是否有格子线
    gridLine: {
      type: Boolean,
      default: false,
    },
    /*
      NOTE 粒度
      月 周 日 （0，1，2）
    */
    type: Number,
  },

  data() {
    return {
      timeParse: d3.timeFormat('%m-%d'),
    };
  },

  computed: {
    chartWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    chartHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    // 设置比例尺的range
    chartX() {
      switch (this.type) {
        case 0:
          return [
            d3.scaleLinear()
              .domain([0, 11])
              .range([0, this.chartWidth]),
            d3.scaleTime()
              .domain([new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))])
              .range([0, this.chartWidth]),
          ];
        case 1:
          return [
            d3.scaleLinear()
              .domain([0, 51])
              .range([0, this.chartWidth]),
            d3.scaleTime()
              .domain([new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))])
              .range([0, this.chartWidth]),
          ];
        default:
          return [
            d3.scaleLinear()
              .domain([0, 365])
              .range([0, this.chartWidth]),
            d3.scaleTime()
              .domain([new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))])
              .range([0, this.chartWidth]),
          ];
      }
    },
    chartY() {
      return this.yScale.range([this.chartHeight, 0]).nice();
    },

    line() {
      const { chartX, chartY } = this;
      return d3
        .line()
        .curve(d3.curveCardinal)
        .x((d, index) => chartX[0](index))
        .y((d) => chartY(d));
    },
  },

  directives: {
    axis: axisDirective,
  },

  mounted() {
    const $paths = d3.select(this.$refs.paths);
    const that = this;
    $paths.on('mousemove', function mousemoveAction() {
      const { id } = d3.event.path[0];
      // that.focusMousemove(d3.mouse(this), id, {
      //   left: d3.event.pageX,
      //   top: d3.event.pageY,
      // });\
      // console.log('fuc');
      const mouse = d3.mouse(this);
      const date = that.chartX[1].invert(mouse[0]);

      that.$emit('tooltip', true, {
        left: d3.event.offsetX - 10,
        top: d3.event.offsetY + 150,
        x: mouse[0],
      }, {
        date: date.toISOString().substr(0, 10),
        type: 0,
      });
    });
  },

  methods: {
    // focusMousemove(mouse, id, coord) {
    //   const xOnMouse = this.chartX.invert(mouse[0]);
    //   const yOnMouse = this.chartY.invert(mouse[1]);
    //   // 返回鼠标映射的数值
    //   this.$emit('d3-mousemove', coord, { xOnMouse, yOnMouse });
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .line-chart {
    svg {
      cursor: pointer;
    }

    path {
      fill:none;
      stroke-width: 2px;
    }

    .grid-line {
      stroke: #ccc;
    }

    .xaxis, .yaxis {
      line {
        display: none;
      }
      path {
        display: none;
      }
    }
  }

</style>
