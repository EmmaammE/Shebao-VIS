<template>
  <div class="line-chart">
    <svg :width='width' :height='height'
        v-if ="datum.y !== undefined"
    >
      <defs>
        <clipPath id="clip">
          <rect x="0" y="0" :width="chartWidth" :height="chartHeight" />
        </clipPath>
      </defs>

      <g :transform='`translate(${margin.left}, ${margin.top})`'
        clip-path ="url(#clip)"
      >
        <path
          v-for="kind in Object.keys(datum.y)" :key="kind"
          :d="line(datum.y[kind])" :stroke="color(kind)"
        />
      </g>

      <g class="barchart-axis">
        <g
          v-axis:x="{scale: chartX, tickFormat: xTickFormat}"
          :transform='`translate(${margin.left}, ${height-margin.bottom})`'
        />
        <g
          v-axis:y="{scale: chartY}"
          :transform='`translate(${margin.left}, ${margin.top})`'
        />
      </g>

      <slot></slot>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { axisDirective } from '@/directives/axis';
import { color } from '@/mixins/color';
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
    scale: Object,
    xTickFormat: Function,
    xTicks: Number,
    yTickFormat: Function,
    yTicks: Number,
    // 数据
    datum: Object,
  },

  data() {
    return {
      color: d3
        .scaleOrdinal()
        .domain(Object.keys(this.datum.y))
        .range(color),
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
      return d3[this.scale.xType]().domain(this.scale.xDomain).range([0, this.chartWidth]);
    },
    chartY() {
      return d3[this.scale.yType]().domain(this.scale.yDomain).range([this.chartHeight, 0]).nice();
    },

    line() {
      const { chartX, chartY } = this;
      return d3
        .line()
        .x((d, i) => chartX(this.datum.x[i]))
        .y((d) => chartY(d));
    },
  },

  directives: {
    axis: axisDirective,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

path {
  fill:none;
  stroke-width: 1px;
}

</style>
