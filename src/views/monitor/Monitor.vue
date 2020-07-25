<template>
  <v-card>
    <line-chart-container />
  </v-card>
</template>

<script>
import LineChartContainer from '@/views/home/LineChartContainer.vue';
import layout from '@/mixins/layout';

export default {
  name: 'Monitor',
  components: {
    LineChartContainer,
  },
  data: () => ({

  }),

  mixins: [layout],
};
</script>

<style>

</style>
