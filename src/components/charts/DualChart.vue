<template>
  <svg :viewBox="`0 0 ${width} ${height}`">
    <defs>
      <clipPath id="clip">
        <rect x="0" :y="-yScalePadding" :width="chartWidth" :height="chartHeight" />
      </clipPath>
    </defs>

    <!-- 坐标轴 -->
    <g class="barchart-axis"
      :transform='`translate(${margin.left}, ${margin.top})`'>
      <g v-axis:x="{scale: scales.xBottomScale, ticksAmount:8}"
        :transform='`translate(0, ${chartHeight})`'
        class="xaxis"
      />
      <g v-axis:top="{scale: scales.xTopScale, ticksAmount:8}"
        class="xaxis"
      />
      <g v-axis:y="{scale: scales.yScale}"
        class="yaxis"
      />
      <g v-axis:x="{
            scale: scales.xBottomScale,
            inner: chartHeight,
            ticksAmount:8, tickFormat: ''}"
        class="gridline"
      />
      <path class="grid" d="M0.5,240H620.5"></path>
      <path class="grid" d="M0.5,0H620.5"></path>
    </g>

    <g :transform='`translate(${margin.left}, ${margin.top})`'
      class="charts"
      >

      <g :transform='`translate(0, ${yScalePadding})`' clip-path ="url(#clip)">
        <!-- 折线图 -->
        <path id="line" :d="line(scales.datumArr)" />

        <g v-for="d in scales.datumArr"
          :key="d[0]">
<!-- TODO 把这些坐标存一下？老重复用 -->
          <!-- 柱状图 -->
          <rect
            :height="yScalePadding"
            :width="scales.xTopScale(d[1].money) - yScalePadding/2+1"
            :x="0"
            :y="scales.yScale(d[0]) - yScalePadding/2"
          />
          <!-- 柱状图上画一个半圆 -->
          <path class="eclipse"
              :d="`M ${scales.xTopScale(d[1].money)-yScalePadding/2}
                ${scales.yScale(d[0]) - yScalePadding/2}
                A ${yScalePadding/2} ${yScalePadding/2} 0 1 1
                ${scales.xTopScale(d[1].money)-yScalePadding/2}
                ${scales.yScale(d[0]) + yScalePadding/2}
                M ${scales.xTopScale(d[1].money)-yScalePadding/2}
                ${scales.yScale(d[0]) - yScalePadding/2} Z`"
            />

          <!-- 折线图上的点 -->
          <circle
            :cx="scales.xBottomScale(d[1].num)"
            :cy="scales.yScale(d[0])"
            r="2"
          />

        </g>

         <use xlink:href="#line" />
      </g>
    </g>

  </svg>
</template>

<script>
import { axisDirective } from '@/directives/axis';
import * as d3 from 'd3';

export default {
  props: {
    datum: Object,
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
  },

  directives: {
    axis: axisDirective,
  },

  computed: {
    chartWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    chartHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    scales() {
      // 金额
      const xTopDomain = [Number.MAX_VALUE, Number.MIN_VALUE];
      // 数量
      const xBottomDomain = [Number.MAX_VALUE, Number.MIN_VALUE];

      const datumArr = [];
      // 按金额升序排列
      const keys = Object.keys(this.datum);
      keys.sort((a, b) => this.datum[a].money - this.datum[b].money);

      keys.forEach((key) => {
        datumArr.push([key, this.datum[key]]);
        xTopDomain[0] = Math.min(xTopDomain[0], this.datum[key].money);
        xTopDomain[1] = Math.max(xTopDomain[1], this.datum[key].money);
        xBottomDomain[0] = Math.min(xBottomDomain[0], this.datum[key].num);
        xBottomDomain[1] = Math.max(xBottomDomain[1], this.datum[key].num);
      });

      const yScale = d3.scaleBand().domain(keys).range([this.chartHeight, 0]);
      const xTopScale = d3.scaleLinear()
        .domain(xTopDomain).nice()
        .range([0, this.chartWidth]);
      const xBottomScale = d3.scaleLinear()
        .domain(xBottomDomain).nice()
        .range([0, this.chartWidth]);

      return {
        yScale, xTopScale, xBottomScale, datumArr,
      };
    },

    line() {
      // 数量折线图
      const { xBottomScale, yScale } = this.scales;
      return d3
        .line()
        .x((d) => xBottomScale(d[1].num))
        .y((d) => yScale(d[0]));
    },

    yScalePadding() {
      // 纵轴格子的高度
      if (this.scales.datumArr.length) {
        return (this.chartHeight / this.scales.datumArr.length) / 2;
      }
      return 0;
    },
  },

};
</script>

<style lang="scss">
  .xaxis,
  .yaxis {
    path {
      display: none;
    }

    .tick line{
      display: none;
    }
  }

  .gridline {
    line {
      stroke-dasharray: 2 2;
      stroke: #ccc;
    }
    path {
      display: none;
    }
  }

  path.grid {
    stroke-dasharray: 2 2;
    stroke: #ccc;
  }

  // 图
  .charts {
    path {
      fill: none;
      stroke: #1c899f;
    }

    circle {
      fill: #b1d3dc;
      stroke: #1c899f;
    }

    rect {
      fill: #b1d3dc;
      stroke: #1c899f;
    }
    path.eclipse {
      fill:#b1d3dc;
    }
  }
</style>