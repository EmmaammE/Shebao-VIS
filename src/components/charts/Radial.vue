<template>
  <svg viewBox="0 0 100 100">
    <!-- grid -->
    <g class="axis-wrapper"
      v-for="(d,i) in tickData"
      :key="i"
      :transform="`translate(${placement.xOffset}, ${placement.yOffset})`"
    >
      <g class="s-g">
        <path :d="radarLine(d)"/>
        <!-- <line
          :x1="rScale(0) * Math.cos(angleSlice * i - Math.PI / 2)"
          :y1="rScale(0) * Math.sin(angleSlice * i - Math.PI / 2)"
          :x2="rScale(100) * Math.cos(angleSlice * i - Math.PI / 2)"
          :y2="rScale(100) * Math.sin(angleSlice * i - Math.PI / 2)"
        /> -->
        <text
          :x="rScale(100) * Math.cos(angleSlice * i - Math.PI / 2)"
          :y="rScale(100) * Math.sin(angleSlice * i - Math.PI / 2)"
          :dy="i > 0? 8: -8"
          dominant-baseline="middle"
          text-anchor="middle"
        >{{axisName[i]}}</text>
      </g>

      <path
        fill="#7fa6e0"
        stroke="#034ec3"
        opacity="0.3"
        :d="radarLine(handledData[0])"
      />

      <path
        fill="#88bb80"
        stroke="#137601"
        opacity="0.3"
        :d="radarLine(handledData[1])"
      />
    </g>

  </svg>
</template>

<script>
import * as d3 from 'd3';

const MARGIN = 10;
const placement = {
  radius: (100 - 2 * MARGIN) / 2,
  xOffset: 50,
  yOffset: MARGIN + 50,
};
export default {
  props: {
    scales: Array,
    data: Array,
    standard: Array,
  },
  data() {
    return {
      axisName: ['住院次数', '药占比', '住院总费用'],
      placement,
      angleSlice: Math.PI * (2 / 3),
      rScale: d3.scaleLinear().domain([0, 100])
        .range([0, placement.radius]),
      radarLine: d3.lineRadial().curve(d3.curveLinearClosed)
        .radius((d) => this.rScale(d))
        .angle((d, i) => i * this.angleSlice),
    };
  },

  computed: {
    tickData() {
      const axisTick = 4;
      return Array(axisTick).fill([])
        .map((item, index) => {
          const r = (100 / axisTick) * (index + 1);
          return [r, r, r];
        });
    },

    handledData() {
      return [
        this.standard.map((d, index) => this.scales[index](d)),
        this.data.map((d, index) => this.scales[index](d)),
      ];
    },
  },
};
</script>

<style scoped>
  .s-g {
    fill: transparent;
    stroke: #e0e0e0;
  }
  text {
    font-size: 8px;
    fill: #000;
    stroke: none;
  }
</style>
