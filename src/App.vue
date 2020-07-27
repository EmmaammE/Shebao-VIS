<template>
    <component :is="layout" id="app" :links="$route.meta.links">
    <router-view :layout.sync="layout"/>
  </component>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      layout: 'div',
    };
  },
};
</script>>

/**为了修改Vuetify中slot的样式，这个组件不设置scoped */
<style lang="scss">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

body {
  font-size: 62.5%;
}

header .v-input__slot {
  background: $she-bg!important;
}

.v-navigation-drawer__content {
  overflow: hidden!important;
}

.v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
  min-height: 28px!important;
}

html, body {
  height: 100%;
  overflow: hidden!important;
}
</style>
