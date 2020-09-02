<template>
  <svg viewBox="0 0 170 20">
    <rect x="0" y="3"
      fill="#769edc"
      stroke="#2562c5"
      :width="scale(data)" height="14" />
    <line :x1="scale(standard)" y1="2" :x2="scale(standard)" y2="18" stroke="#1d44ad" />
    <!-- TODO 高标准 -->
    <line x1="100" y1="2" :x2="100" y2="18" stroke="#eb6001" />
  </svg>
</template>

<script>

export default {
  // 有line指标的bar
  props: {
    data: Number,
    standard: Number,
    scale: Function,
  },
};
</script>
