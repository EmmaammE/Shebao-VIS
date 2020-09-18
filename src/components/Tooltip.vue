<template>
  <div class="tooltip-container"
    :style="{'left': left+'px', 'top': top+'px'}"
  >
    <!-- <p>{{title}}</p> -->
    <div class="inner">
      <slot></slot>
    </div>
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
    color: #fff;
    z-index: 100;
    position: absolute;
    transition: all ease-in-out 300ms;
  }

  .s-tip {
    background: #777;
    opacity: .78;
    position: relative;
    margin-left: -50%;
    margin-right: 50%;

    padding: 5px 7px;
    pointer-events: none;

    p {
      margin: 0;
      font-size: 0.7rem;
    }
  }

// TODO 修改三角形的朝向
  .s-tip::before {
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
