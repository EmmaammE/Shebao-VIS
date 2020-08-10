<template>
  <div>
    <filter-card label="药品/服务项目">
    </filter-card>
    <Map/>
  </div>
</template>

<script>
import Map from '@/components/Map.vue';
import FilterCard from '@/components/filterCard.vue';

export default {
  name: 'SearchMap',
  components: {
    Map,
    FilterCard,
  },
  props: {
    routeType: String,
  },
  data() {
    return {

    };
  },

};
</script>

<style scoped lang="scss">

</style>
