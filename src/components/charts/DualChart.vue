<template>
  <svg :viewBox="`0 0 ${width} ${wrapperHeight}`" class="dualchart">
    <defs>
      <clipPath id="clip">
        <rect x="0" :y="-yScalePadding" :width="chartWidth" :height="chartHeight" />
      </clipPath>
    </defs>

    <rect ref="chart" opacity="0" x="0" :y="-yScalePadding" width="100%" height="100%" />

    <!-- 坐标轴 -->
    <g class="barchart-axis"
      :transform='`translate(${margin.left}, ${margin.top})`'>
      <g v-axis:x="{scale: scales.xBottomScale, }"
        :transform='`translate(0, ${chartHeight})`'
        class="xaxis"
      />
      <g v-axis:top="{scale: scales.xTopScale, }"
        class="xaxis"
      />
      <g v-axis:y="{scale: scales.yScale}"
        class="yaxis"
      />
      <g v-axis:x="{
          scale: scales.xTopScale,
          inner: chartHeight,
          tickFormat: ''}"
        class="gridline"
      />
      <text :transform='`translate(${chartWidth+20}, -10)`'>金额（万元）</text>
      <text :transform='`translate(${chartWidth+20}, ${chartHeight+14})`'>数量（例）</text>
      <path class="grid" :d="`M0.5,${chartHeight}H620.5`"></path>
      <path class="grid" d="M0.5,0H620.5"></path>
    </g>

    <g :transform='`translate(${margin.left}, ${margin.top})`'
      class="charts" ref="svg">

      <g :transform='`translate(0, ${yScalePadding})`'  clip-path ="url(#clip)">
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
        </g>

        <!-- 折线图 -->
        <path id="line" :d="line(scales.datumArr)" />

        <!-- 折线图上的点 -->
        <circle
          v-for="d in scales.datumArr"
          :key="d[0]+'circle'"
          :cx="scales.xBottomScale(d[1].num)"
          :cy="scales.yScale(d[0])"
          :id="d[0]"
          r="2"
        />

        <line
          stroke="#babec7"
          stroke-dasharray="4 2"
          :x1="tipX" y1="-10" :x2="tipX" :y2="width-margin.bottom-margin.top" />

         <!-- <use xlink:href="#line" /> -->
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

  data() {
    return {
      tipX: 0,
      bbox: {},
    };
  },

  directives: {
    axis: axisDirective,
  },

  computed: {

    chartWidth() {
      return this.width - this.margin.left - this.margin.right;
    },

    chartHeight() {
      // 将高度改为和数量相关
      const size = Object.keys(this.datum).length;
      return size * 20;
    },

    wrapperHeight() {
      return this.chartHeight + this.margin.top + this.margin.bottom;
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

  mounted() {
    this.setTooltip();
  },

  methods: {
    setTooltip() {
      const $svg = d3.select(this.$refs.svg);
      const that = this;
      $svg.on('mousemove', function mousemoveAction() {
        const pos = d3.mouse(this);
        // eslint-disable-next-line
        that.tipX = pos[0];

        const { xBottomScale, xTopScale, yScale } = that.scales;

        const num = xBottomScale.invert(pos[0]).toFixed(2);
        const money = xTopScale.invert(pos[0]).toFixed(2);

        const eachBand = yScale.step();
        const index = Math.round(pos[1] / eachBand);
        const yValue = yScale.domain().reverse()[index];
        // console.log(yValue, pos, d3.event.layerX);

        that.$emit('tooltip', true, {
          left: d3.event.pageX,
          top: d3.event.pageY - 70,
        }, {
          num: that.datum[yValue].num,
          money: that.datum[yValue].money,
        });
      });
      d3.select(this.$refs.chart).on('mouseout', () => {
        that.tipX = 0;
        that.$emit('tooltip', false, { left: 0, top: 0 }, { money: 0, num: 0 });
      });
    },
  },
};
</script>

<style lang="scss">
  .dualchart {
    .barchart-axis {
      text {
        font-size: 9px;
      }

      .xaxis,
      .yaxis {
        path {
          display: none;
        }

        .tick line{
          display: none;
        }
        text {
          font-size: 9px;
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
    }

    path.grid {
      stroke-dasharray: 2 2;
      stroke: #ccc;
    }

    line {
      stroke: #babec7;
      // stroke-dasharray: 2 2;
    }

  }

  // 图
  .charts {
    path {
      fill: none;
      stroke: #1c899f;
      cursor: pointer;
    }

    circle {
      fill: #81d7e9;
      stroke: #1c899f;
      cursor: pointer;
    }

    rect {
      fill: #b1d3dc;
      stroke: #1c899f;
    }
    path.eclipse {
      fill:#b1d3dc;
    }
  }

  .mask {
    pointer-events: none;

    .s-tip {
      p {
        margin: 0;
        padding: 0;
        font-size: 10px;
        line-height: 15px;
      }
    }
  }
</style>
