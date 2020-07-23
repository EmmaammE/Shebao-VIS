<template>
  <div
    v-show='isShowing'
    class="tooltip-container">
      <!-- <p>{{title}}</p> -->
      <slot></slot>
  </div>
</template>

<script>
import toggle from '../mixins/toggle';

export default {
  name: 'Tooltip',

  mixins: [toggle],

  props: {
    // title: String,

  },

};
</script>

<style scoped lang="scss">
    .tooltip-container {
        padding: 10px 5px;
        border-radius: 5px;
        background: #888;
        opacity: .5;
        z-index: 100;
        position: absolute;
    }
</style>
