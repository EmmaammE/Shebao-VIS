<template>
  <svg :viewBox="`0 0 100 20`">
    <rect
      x="2"
      y="3"
      :width="scale(data)"
      height="14"
      @mouseout="showTip"
    />

    <line v-for="(d,index) in datum"
      :key="index"
      :y1="3"
      :x1="scale(d)"
      :x2="scale(d)"
      :y2="17"
    >
    </line>
  </svg>
</template>

<script>
export default {
  props: {
    scale: Function,
    datum: Array,
    data: Number,
  },

  methods: {
    showTip() {
      // TODO tooltip
      console.log('.');
    },
  },
};
</script>

<style scoped>
  rect {
    fill: #769edc;
    stroke: #2965c8;
  }

  line {
    stroke: #000;
    stroke-dasharray: 2 1;
  }
</style>
