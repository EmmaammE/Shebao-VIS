<template>
  <div class="map-container">
    <Map
    />
    <v-sheet class="table-container">
      <div class="header">
        <span>序号</span>
        <span>参保人编号</span>
        <span>参保人</span>
        <span>异常机构</span>
        <span class="type-icon"></span>
        <span class="type-icon"></span>
        <span class="type-icon"></span>
        <span class="type-icon"></span>
      </div>
      <div class="content"></div>
    </v-sheet>
  </div>
</template>

<script>
import Map from '@/components/charts/Map.vue';

export default {
  components: {
    Map,
  },
  data() {
    return {

    };
  },
};
</script>

<style scoped lang="scss">
  .map-container{
    position: relative;
  }
  .table-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 23vw;
    height: 90vh;
    margin: 15px;
    padding: 10px;
    opacity: .8;
    background: #f7f7f7;
  }

  .header {
    font-weight: bold;
    display: flex;
    justify-content: space-evenly;
    line-height: 26px;
    align-items: center;
    font-size: 14px;

    .type-icon {
      display: block;
      $radius: 10px;
      $space: 3px;

      border-radius: 50%;
      position: relative;
      width: 2*$radius;
      height: 2*$radius;
      background: #fff;
      margin: 0;
      padding: 0;

      &::after  {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 2 * ($radius - $space);
        height: 2 * ($radius - $space);
        border-radius: 50%;
        top: 2px;
        left: 2px;
      }

    }

    @each $c in $yujing {
      $i: index($yujing, $c);
      span:nth-child(#{$i+4})::after {
        background: $c;
      }

      span:nth-child(#{$i+4}) {
        border: 1px solid $c;
      }
    }

  .content::-webkit-scrollbar {
    width: 4px;
    overflow: auto;
    max-height: calc(88vh - 40px);
  }

}
</style>
