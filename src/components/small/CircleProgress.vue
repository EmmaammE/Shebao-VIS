<template>
  <svg width="150px" height="150px" viewBox="0 0 200 200">
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
    <text x="50%" y="50%"
      v-if="ratio"
      dominant-baseline="middle"
      text-anchor="middle"
    >{{(ratio*100).toFixed(2) + '%'}}</text>
    <text x="50%" y="88%"
      class="label"
      dominant-baseline="middle"
      text-anchor="middle"
    >{{label}}</text>
  </svg>
</template>

<script>
export default {
  props: {
    ratio: Number,
    label: String,
  },

};
</script>''

<style scoped>

    path {
      will-change: auto;
      stroke-miterlimit: round;
      transition: stroke-dashoffset 850ms ease-in-out;
    }

    text {
      font-size: 30px;
    }

    text.label {
      font-size: 24px;
    }
</style>
