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
    background: #777;
    color: #fff;
    opacity: .78;
    z-index: 100;
    position: absolute;
  }
// TODO 修改三角形的朝向
  .tooltip-container::before {
    content: '';
    position: absolute;
    bottom: -12px;
    left: calc(50% - 3*1.414px);
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-top: 6px solid #777;
  }
</style>
