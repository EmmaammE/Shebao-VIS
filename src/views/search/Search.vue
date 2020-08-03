<template>
  <component :is="comp[submenu]" />
  <!-- <Layout>
    <router-view />
  </Layout> -->
</template>

<script>
import SearchPanel from '@/views/search/SearchPanel.vue';
import SearchRank from '@/views/search/SearchRank.vue';
import SearchMap from '@/views/search/SearchMap.vue';
import layout from '@/mixins/layout';
import Layout from '@/views/Layout.vue';

export default {
  name: 'Search',
  props: {
    submenu: String,
  },
  components: {
    Layout,
  },
  mixins: [layout],
  // created() {
  //   this.$emit('update:layout', 'div');
  // },
  data() {
    return {
      comp: {
        排名查看: SearchRank,
        机构汇总: SearchMap,
        参保人员汇总: SearchPanel,
        药师医师汇总: SearchPanel,
        费用明细: SearchMap,
        就诊信息: SearchPanel,
      },
    };
  },

};
</script>

<style>

</style>
