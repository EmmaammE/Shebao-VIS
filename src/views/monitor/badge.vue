<template>
  <v-sheet class="s-badge">
    <component :is="active?IconOn:Icon" class="svg-style" viewBox="0 0 59 59"/>
    <div :class="active?'s-info active':'s-info'">
      <p class="text-title">{{type}}</p>
      <p class="text-number">{{data?data.toLocaleString():0}}</p>
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
    justify-content: center;

    .svg-style {
      width: 4vw;
      height: auto;
    }

    svg {
      cursor: pointer;
    }

    .s-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #3365BB;

      p {
        margin: 0;
        color:#747474;
      }

      p.text-number {
        font-family:LcdD;
        font-size:1.5rem;
        letter-spacing:0;
        margin-bottom: 0px;
      }

      p.text-title {
        font-family:STHeitiSC-Medium;
        font-size: 0.9rem;
        letter-spacing:-0.96px;
      }

      &.active {
        p {
          color: $darkblue;
        }
      }
    }
  }
</style>
