<template>
    <Layout :links="links">
      <template v-slot:page-main>

        <v-card>
           <line-chart-container />
        </v-card>
      </template>
    </Layout>
</template>

<script>
import Layout from '@/views/Layout.vue';
import LineChartContainer from '@/views/home/LineChartContainer.vue';

export default {
  name: 'Monitor',
  components: {
    Layout,
    LineChartContainer,
  },
  data: () => ({
    links: [
      {
        action: '1',
        title: '基金本地情况',
        active: true,
        items: [
          { title: '公立医院' },
          { title: '民营医院' },
        ],
      },
      {
        action: '2',
        title: '基金异地情况',
        items: [

        ],
      },
      {
        action: '3',
        title: '基金明细监测',
        items: [

        ],
      },
    ],
  }),
};
</script>

<style>

</style>
