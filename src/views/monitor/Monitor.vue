<template>
  <div>
    <v-card>
      <zhexian />
    </v-card>
  </div>
</template>

<script>
import Zhexian from '@/views/home/Zhexian.vue';
import layout from '@/mixins/layout';

export default {
  name: 'Monitor',
  components: {
    Zhexian,
  },
  data: () => ({

  }),

  mixins: [layout],
};
</script>

<style>

</style>
