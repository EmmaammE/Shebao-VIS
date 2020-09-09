<template>
  <v-card class="line-card">
    <h4>{{title}}</h4>
    <p>{{amount.toLocaleString()}}{{tick}}</p>
    <h1>{{rank}}</h1>
    <!-- line -->

    <svg
      :viewBox="`0 0 ${width} ${height}`"
    >
      <linearGradient id="2020" gradientUnits="userSpaceOnUse"
        x1="0" y1="0" x2="0" y2="100%">
        <stop offset="0%" stop-color="#9d60fb" stop-opacity="0.2"></stop>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient id="2019" gradientUnits="userSpaceOnUse"
        x1="0" y1="0" x2="0" y2="100%">
        <stop offset="0%" stop-color="#3a96fd" stop-opacity="0.2"></stop>
        <stop offset="80%" stop-color="#fff" stop-opacity="0"></stop>
      </linearGradient>
      <g class="barchart-axis"
        :transform='`translate(${margin.left}, ${margin.top})`'
      >
        <g v-axis:x="{scale: xScale, tickFormat: d => `${d+1}月` }"
          :transform='`translate(0, ${chartHeight})`'
          class="xaxis"
        />

        <g v-axis:y="{scale: yScale}"
          class="yaxis"
          transform="translate(-10,0)"
        />

        <!-- gridline -->
        <g v-axis:x="{
          scale: xScale,
          inner: chartHeight,
          tickFormat: ''}"
          class="gridline"
        />
        <g v-axis:y="{
          scale: yScale,
          inner: -chartWidth,
          tickFormat: ''}"
          class="gridline"
        />
      </g>

      <g class="lines" :transform='`translate(${margin.left}, ${margin.top})`'>
        <path fill="url(#2019)" :d="area(Object.values(data['2019']))" />
        <path fill="url(#2020)" :d="area(Object.values(data['2020']))" />
        <path fill="none" stroke="#3a96fd" :d="line(Object.values(data['2019']))" />
        <path fill="none" stroke="#9d60fb" :d="line(Object.values(data['2020']))" />
      </g>
    </svg>

  </v-card>
</template>

<script>
import * as d3 from 'd3';
import { axisDirective } from '@/directives/axis';

export default {
  props: {
    title: String,
    rank: Number,
    tick: String,
    data: {
      type: Object,
      default: () => ({
        2019: {},
        2020: {},
      }),
    },
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
      width: 400,
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
      return d3.scaleLinear()
        .domain([0, 11])
        .range([0, this.chartWidth]);
    },
    yScale() {
      return d3.scaleLinear()
        .domain(d3.extent([...Object.values(this.data['2019']),
          ...Object.values(this.data['2020'])])).nice()
        .range([this.chartHeight, 0]);
    },
    area() {
      return d3
        .area()
        .x((d, index) => this.xScale(index))
        .y0(this.chartHeight)
        .y1((d) => this.yScale(d));
    },
    line() {
      return d3
        .line()
        .x((d, index) => this.xScale(index))
        .y((d) => this.yScale(d));
    },
    amount() {
      // 2020年的总和
      return Object.values(this.data['2020'])
        .reduce((a, b) => a + b, 0).toFixed(2);
    },
  },
  directives: {
    axis: axisDirective,
  },

};
</script>

<style lang="scss">
  .line-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;

    h1, h4, p {
      margin: 0;
      font-weight: 500;
    }

    h1 {
      position: absolute;
      top: 20px;
      right: 10px;
      color: #c60001;
    }

    // svg
    svg {
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
          stroke: $text;
        }
        path {
          display: none;
        }
      }

      .lines {
        path {
          stroke-width: 2;
        }
      }
    }
  }
</style>
