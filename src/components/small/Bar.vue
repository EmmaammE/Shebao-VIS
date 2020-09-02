<template>
  <svg :viewBox="`0 0 100 20`">
    <template v-if="type===1">
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
    </template>
    <template v-else>
      <g v-for="(d,index) in res"
        :key="index"
      >
        <rect
          :x="index===0?0:scale(datum[index-1])"
          y="3"
          :width="scale(d)"
          :fill="colorScale(d)"
          height="14"
          @mouseout="showTip"
        />
      </g>

      <line v-for="(d,index) in datum"
        :key="index+'l'"
        :y1="3"
        :x1="scale(d)"
        :x2="scale(d)"
        :y2="17"
      >
      </line>
    </template>
  </svg>
</template>

<script>
export default {
  props: {
    scale: Function,
    datum: Array,
    data: Number,
    colorScale: Function,
    type: Number,
  },

  computed: {
    res() {
      const arr = [0, ...this.datum, this.data];
      const res = [];
      arr.forEach((d, index) => {
        if (index) {
          res.push(arr[index] - arr[index - 1]);
        }
      });
      return res;
    },
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
    stroke: #ffffff;
    stroke-width: 1;
  }
</style>
