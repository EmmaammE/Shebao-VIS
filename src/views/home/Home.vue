<template>
  <div class="home">
    <line-chart-container></line-chart-container>
  </div>
</template>

<script>
// @ is an alias to /src
import lineChartContainer from '@/views/home/LineChartContainer.vue';

export default {
  name: 'Home',
  components: {
    lineChartContainer,
  },
  data() {
    return {
    };
  },
};
</script>
