<template>
  <div class="map-container">
    <div class="cards-container">
      <v-card v-for="(d,index) in info" :key="index"
        outlined
        width="13vw"
      >
        <span class="badge-icon">
          <component :is= "d.icon"></component>
        </span>
        <span>{{d.title}}</span>
        <span class="number">{{nums[index]}}</span>
      </v-card>
    </div>
    <Map/>
  </div>
</template>

<script>
import layout from '@/mixins/layout';
import Map from '@/components/Map.vue';
import Icon1 from '@/assets/warning/icon_1.svg';
import Icon2 from '@/assets/warning/icon_2.svg';
import Icon3 from '@/assets/warning/icon_3.svg';

export default {
  name: 'Warning',
  components: {
    Map,
  },
  data: () => ({
    info: [
      { icon: Icon1, title: '异常机构数量' },
      { icon: Icon2, title: '高危机构数量' },
      { icon: Icon3, title: '正常机构数量' },
    ],
    nums: [77, 155, 72],
  }),

  mixins: [layout],

};
</script>

<style scoped lang="scss">
  .map-container {
    width: 99%;
    margin: 4px;
    background: #fff;
  }

  .cards-container {
    position: absolute;
    top: 35px;
    right: 8%;
    z-index: 1100;
    width: 100%;
    padding: 0 10% 0 20%;
    display: flex;
    justify-content: space-around;

    .v-card {
      background: rgba(255,255,255,.8)!important;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: rem;

      .number {
        margin-right: 1rem;
      }
    }

    .badge-icon {
      display: flex;
      align-items: center;

      svg {
        transform: scale(0.7);
      }
    }
  }
</style>
