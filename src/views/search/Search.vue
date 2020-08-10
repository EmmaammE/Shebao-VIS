<template>
  <component :is="comp[$route.params.routeType]" :routeType="$route.params.routeType" />
</template>

<script>
import SearchPanel from '@/views/search/SearchPanel.vue';
import SearchRank from '@/views/search/SearchRank.vue';
import SearchMap from '@/views/search/SearchMap.vue';
import layout from '@/mixins/layout';
import Layout from '@/views/Layout.vue';

export default {
  name: 'Search',
  components: {
    Layout,
  },
  mixins: [layout],

  data() {
    return {
      comp: {
        rank: SearchRank,
        jigou: SearchMap,
        people: SearchPanel,
        doctor: SearchPanel,
        mingxi: SearchMap,
        info: SearchPanel,
      },
    };
  },

};
</script>

<style>

</style>
