<template>
  <v-sheet class="s-badge">
    <component :is="active?IconOn:Icon" />
    <div class="s-info">
      <p class="text-lg-body-1 text-md-body-1">{{type}}</p>
      <p class="text-lg-h5 text-md-h6">{{data}}</p>
    </div>
  </v-sheet>
</template>

<script>
import Icon from '@/assets/monitor/icon_10.svg';
import IconOn from '@/assets/monitor/icon_11.svg';

export default {
  name: 'Badge',
  props: {
    // 是否被选中
    active: Boolean,
    // 展示的数值
    data: Number,
    type: String,
  },
  data() {
    return {
      Icon,
      IconOn,
    };
  },
};
</script>

<style scoped lang="scss">
  .s-badge {
    display: flex!important;

    svg {
      cursor: pointer;
      transform: scale(0.93);
    }

    .s-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #3365BB;
      margin: 0 4px;

      p {
        margin: 2px;
      }
    }
  }
</style>
