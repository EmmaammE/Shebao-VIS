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
  created() {
    this.setHtmlFontSize();

    window.addEventListener('resize', this.setHtmlFontSize);
  },
  methods: {
    setHtmlFontSize() {
      // const screenRatioByDesign = 16 / 9;
      // const docEle = document.documentElement;
      // const screenRatio = docEle.clientWidth / docEle.clientHeight;
      // const fontSize = ((
      //   screenRatio > screenRatioByDesign
      //     ? (screenRatioByDesign / screenRatio)
      //     : 1
      // ) * docEle.clientWidth) / 10;

      // console.log(fontSize);
      // docEle.style.fontSize = `${fontSize.toFixed(3)}px`;
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

.v-input__slot {
  background: $she-bg;
}

html {
  overflow: hidden!important;
}

  // html::-webkit-scrollbar {
  //   width: 0px;
  // }
</style>
