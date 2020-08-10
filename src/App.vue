<template>
  <component :is="layout" id="app" :links="$route.meta.links"
    :submenu="submenu"
    :routeType="$route.params.routeType"
  >
    <router-view :layout.sync="layout" :submenu="submenu" :routeType="$route.params.routeType"/>
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

  computed: {
    submenu() {
      try {
        if (this.layout === 'div' || !this.$route.meta) {
          return '';
        }

        // 如果不是主页就计算submenu
        const { submenu } = this.$store.state;
        const temp = this.$route.meta.links[submenu];
        return temp.key;
      } catch (err) {
        console.log(err);
      }
      return '';
    },
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

html {
  overflow: hidden!important;
}

  // html::-webkit-scrollbar {
  //   width: 0px;
  // }

    .my-div-icon {
  background-color: aqua;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 0 20px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
}
</style>
