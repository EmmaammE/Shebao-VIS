<template>
  <component :is="comp[$route.params.routeType]" :routeType="$route.params.routeType" />
</template>

<script>
import layout from '@/mixins/layout';
import Layout from '@/views/Layout.vue';
import WarningList from '@/views/warning/WarningList.vue';
import WarningMap from './WarningMap.vue';
import WarningPeople from './WarningPeople.vue';

export default {
  name: 'Search',
  components: {
    Layout,
  },

  mixins: [layout],

  data() {
    return {
      comp: {
        public: WarningMap,
        community: WarningMap,
        private: WarningMap,
        social: WarningMap,
        drugstore: WarningMap,
        organization: WarningMap,
        renyuan: WarningPeople,
        yaoshi: WarningList,
      },
    };
  },

};
</script>
