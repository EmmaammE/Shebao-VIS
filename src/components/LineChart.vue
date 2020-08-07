<template>
  <div class="line-chart">
    <svg
      v-if ="datum.y"
      height='100%' :viewBox="`0 0 ${width} ${height}`"
    >
      <defs>
        <clipPath id="clip">
          <rect x="0" y="0" :width="chartWidth" :height="chartHeight" />
        </clipPath>
      </defs>

      <g class="barchart-axis"
        :transform='`translate(${margin.left}, ${margin.top})`'
      >
        <g v-axis:x="{scale: chartX, tickFormat: xTickFormat}"
          :transform='`translate(0, ${chartHeight})`'
          class="xaxis"
        />
        <!-- <g v-axis:x="{scale: chartX}" /> -->
        <g v-axis:x="{scale: chartX, inner: chartHeight, tickFormat: ''}"
          v-if="gridLine"
          class="grid-line"
        />

        <g v-axis:y="{scale: chartY}"
          class="yaxis"
        />
        <!-- <g v-axis:y="{scale: chartY, inner: -chartWidth, tickFormat: ''}"
          v-if="gridLine" class="grid-line"
        /> -->
      </g>

      <g clip-path ="url(#clip)"
        :transform='`translate(${margin.left}, ${margin.top})`'
        ref="paths"
      >
        <path
          v-for="kind in Object.keys(datum.y)" :key="kind"
          :id="kind"
          :d="line(datum.y[kind])"
          :stroke="color(kind)"
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

    // 是否有格子线
    gridLine: {
      type: Boolean,
      default: false,
    },
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
        .curve(d3.curveCardinal)
        .x((d, i) => chartX(this.datum.x[i]))
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
      that.focusMousemove(d3.mouse(this), id);
    });
  },

  methods: {
    focusMousemove(mouse, id) {
      const coord = [mouse[0] + this.margin.left, mouse[1] + this.margin.left - 35];
      const xOnMouse = this.chartX.invert(mouse[0]);
      const yOnMouse = this.chartY.invert(mouse[1]);
      // 返回鼠标映射的数值
      this.$emit('d3-mousemove', [xOnMouse, yOnMouse], id, coord);
    },
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
      stroke-width: 3px;
    }

    .grid-line {
      stroke: #ccc;
      opacity: 0.2;

      path {
        display: none;
      }
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
