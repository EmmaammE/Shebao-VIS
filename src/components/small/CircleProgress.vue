<template>
  <svg width="200px" height="200px" viewBox="0 0 200 200">
    <path class="bg"
      stroke="#ccc"
      stroke-linecap="round"
      stroke-width="12"
      d="M41 149.5a77 77 0 1 1 117.93 0"
      fill="none"/>
    <path class="meter" stroke="#09c"
      d="M41 149.5a77 77 0 1 1 117.93 0" fill="none"
      stroke-linecap="round"
      stroke-width="12"
      :stroke-dasharray="`${350*ratio} ${350-350*ratio}`"
      stroke-dashoffset="350"/>
<!-- TODO 居中 -->
    <text x="74" y="100">{{ratio*100 + '%'}}</text>
  </svg>
</template>

<script>
export default {
  props: {
    ratio: Number,
  },

};
</script>

<style scoped>

    path {
      will-change: auto;
      stroke-miterlimit: round;
      transition: stroke-dashoffset 850ms ease-in-out;
    }

    text {
      font-size: 30px;
    }
</style>
