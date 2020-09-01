<template>
  <svg
    class="rounded-chart"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <g class="barchart-axis"
      :transform='`translate(${margin.left}, ${margin.top})`'
    >
      <g v-axis:x="{scale:xScale}"
        :transform='`translate(0, ${chartHeight})`'
        class="xaxis"
      />

      <g v-axis:y="{scale: yScale }"
        class="yaxis"
      />

      <g v-axis:y="{
        scale: yScale,
        inner: -chartWidth,
        tickFormat: ''}"
        class="gridline"
      />
    </g>

    <g :transform='`translate(${margin.left}, ${margin.top})`'>
     <path
        v-for="(value, name) in data"
        :key="name"
        fill="#2798f8"
        :transform="`translate(${(xScale.bandwidth()-w)/2},0)`"
        :d="`
          M${xScale(name)},${yScale(value) + ry}
          a${rx},${ry} 0 0 1 ${rx},${-ry}
          h${w - 2 * rx}
          a${rx},${ry} 0 0 1 ${rx},${ry}
          v${chartHeight - yScale(value) - ry}
          h${-(w)}Z`"
      />
    </g>

  </svg>
</template>

<script>
import * as d3 from 'd3';
import { axisDirective } from '@/directives/axis';

export default {
  props: {
    data: Object,
  },
  data() {
    return {
      // 基本设置
      margin: {
        top: 20,
        right: 10,
        bottom: 20,
        left: 50,
      },
      width: 800,
      height: 220,
    };
  },
  computed: {
    chartWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    chartHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3.scaleBand()
        .domain(Object.keys(this.data))
        .rangeRound([0, this.chartWidth])
        .padding(0.4);
    },
    yScale() {
      return d3.scaleLinear()
        .domain([0, d3.max(Object.values(this.data))]).nice()
        .range([this.chartHeight, 0]);
    },
    // 矩形的宽
    w() {
      return Math.min(this.xScale.bandwidth(), 10);
    },
    rx() {
      return 2;
    },
    ry() {
      return 2;
    },
  },
  directives: {
    axis: axisDirective,
  },
};
</script>

<style lang="scss">
  .rounded-chart {
    .yaxis,.xaxis {
        line,
        path {
          display: none;
        }
        text {
          color: $text;
        }
      }

    .gridline {
      line {
        stroke-dasharray: 2 2;
        stroke: #e4e9ec;
      }
      path {
        display: none;
      }
    }
  }
</style>
