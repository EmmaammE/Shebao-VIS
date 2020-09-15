<template>
  <div>
    <svg
      class="rounded-chart"
      :viewBox="`0 0 ${width} ${height}`"
    >
      <text class="unit"
        x="0"
        y="10"
        text-anchor="right"
        v-if="unit"
      >单位：{{unit}}</text>

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

      <g :transform='`translate(${margin.left}, ${margin.top})`'
        ref="bars"
      >
        <path
          v-for="(value, name) in data"
          :key="name"
          fill="#2798f8"
          :transform="`translate(${(xScale.bandwidth()-w)/2},0)`"
          :d="value>0?`
            M${xScale(name)},${yScale(value) + ry}
            a${rx},${ry} 0 0 1 ${rx},${-ry}
            h${w - 2 * rx}
            a${rx},${ry} 0 0 1 ${rx},${ry}
            v${chartHeight - yScale(value) - ry}
            h${-(w)}Z`:''"
          :value="value"
        />
      </g>

    </svg>

    <Tooltip v-bind="tipPos">
      <div class="s-tip" v-show="isShowing">
        <div class="inner" v-if="tipData!==null">
          <p>{{Number(tipData).toLocaleString()}}</p>
        </div>
      </div>
    </Tooltip>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { axisDirective } from '@/directives/axis';
import Tooltip from '@/components/Tooltip.vue';

export default {
  props: {
    data: Object,
    unit: String,
  },
  data() {
    return {
      // 基本设置
      margin: {
        top: 30,
        right: 10,
        bottom: 20,
        left: 50,
      },
      width: 800,
      height: 230,

      // tooltip
      isShowing: false,
      tipData: null,
      tipPos: {
        left: 0,
        top: 0,
      },
    };
  },

  components: {
    Tooltip,
  },

  mounted() {
    // init
    const that = this;
    const svg = d3.select(this.$refs.bars);
    svg.selectAll('path')
      .on('mousemove', function () {
        const yValue = d3.select(this).attr('value');

        that.tipData = yValue;
        that.tipPos = {
          left: d3.event.layerX,
          top: d3.event.layerY - 40,
        };
        that.isShowing = true;
      });
    svg.on('mouseout', () => {
      that.isShowing = false;
    });
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

    .unit {
      font-size: 12px;
    }

    path {
      cursor: pointer;
    }
  }
</style>
