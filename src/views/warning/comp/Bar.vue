<template>
  <svg viewBox="0 0 105 14">
    <rect x="0" y="0" :fill="color"
      :width="scale(data)" height="14" />
    <text
      dominant-baseline="middle"
      dy="8"
      :x="scale(data)+5" y="0">{{data}}次</text>
  </svg>
</template>

<script>

export default {
  // 就是一个普普通通平平无奇的bar
  props: {
    scale: Function,
    data: Number,
    color: String,
  },
};
</script>
