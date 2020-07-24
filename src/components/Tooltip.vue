<template>
  <div class="tooltip-container"
    :style="{'left': left+'px', 'top': top+'px'}"
  >
    <!-- <p>{{title}}</p> -->
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'Tooltip',

  props: {
    // title: String,
    left: Number,
    top: Number,
  },

};
</script>

<style scoped lang="scss">
  .tooltip-container {
    padding: 10px 5px;
    border-radius: 5px;
    background: #7f7f7f;
    color: #fff;
    opacity: .5;
    z-index: 100;
    position: absolute;
  }
</style>
