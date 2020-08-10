<template>
  <svg :viewBox="`-100 -100 200 200`  ">
    <path v-for="(d,index) in arcs"
      :key="index"
      :fill="color[index]"
      :d="arc(d)"
    />
  </svg>
</template>

<script>
import * as d3 from 'd3';

const color = ['#c11f48', '#f87e4b', '#ffcc60', '#d84e5e'];

export default {
  components: {
  },

  props: {
    // 大小
    data: Array,
    // data[hover[0]] = hover[1]
    hover: Array,
  },

  data() {
    return {
      color,
    };
  },

  computed: {
    arc() {
      return d3.arc().innerRadius(67)
        .outerRadius(99);
    },

    arcs() {
      const pie = d3.pie()
        .padAngle(0.005)
        .sort(null).value((d) => d);
      return pie(this.data);
    },
  },

};
</script>

<style lang="scss">
// icon样式需要全局设置

  .ring-icon {
    // // box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
    // text-align: center;
    // width: 10vw!important;
    // height: auto !important;
    // margin: -5vw 0 0 -5vw!important;
    outline: none!important;

    svg {
      filter: drop-shadow(1px 1px 4px rgba(0,0,0,.5));
    }
  }
</style>
