// 为其他三个页面设置侧边栏布局
import Layout from '@/views/Layout.vue';

export default {
  created() {
    this.$emit('update:layout', Layout);
  },
};
