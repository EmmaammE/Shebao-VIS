<template>
    <Layout :links="links">
      <template v-slot:page-main>
        hhhh
      </template>
    </Layout>
</template>

<script>
import Layout from '@/views/Layout.vue';

export default {
  name: 'Warning',
  components: {
    Layout,
  },
  data: () => ({
    links: [
      {
        action: '1',
        title: '机构预算预警',
        active: true,
        items: [
          { title: '公立医院' },
          { title: '民营医院' },
          { title: '零售药店' },
          { title: '社区卫生服务中心' },
          { title: '其他社会办医' },

        ],
      },
      {
        action: '2',
        title: '违规行为预警',
        items: [

        ],
      },
    ],
  }),
};
</script>

<style>

</style>
