<template>
  <div class="pie-container">
    <svg viewBox="-150 -150 300 300">
      <g v-for="(d,index) in dataReady"
        :key="index"
      >
        <path
          :d="arc(d)"
          :fill="colorScale[index]"
        ></path>
        <text
          :transform="`translate(${label.centroid(d)})`"
          text-anchor="middle"
          v-if="data[index]>0"
        >
          {{orgType[index]}}:{{data[index]}}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    data: Array,
  },

  data() {
    return {
      colorScale: [
        '#4c7dfe',
        '#44b500',
        '#ff9c29',
        '#ff5345',
        '#543ba4',
        '#2db9cf',
      ],
      orgType: [
        '公立医院',
        '民营医院',
        '社区卫生服务中心',
        '零售药店',
        '其他门诊部',
        '口腔内门诊部',
      ],
    };
  },
  computed: {
    dataReady() {
      // console.log(this.data);
      // 处理后的piechart数据
      return d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value((d) => d)(this.data);
    },

    arc() {
      return d3.arc().innerRadius(0)
        .outerRadius(100)
        .cornerRadius(2);
    },

    label() {
      return d3.arc().innerRadius(0)
        .outerRadius(120)
        .cornerRadius(2);
    },

  },

};
</script>

<style scoped lang="scss">
  .line {
    fill: none;
    stroke: #707176;
  }

  path {
    cursor: pointer;
  }
</style>
