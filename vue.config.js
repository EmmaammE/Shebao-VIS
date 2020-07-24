module.exports = {
  transpileDependencies: [
    'vuetify',
  ],

  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/styles/global.scss"',
      },
      scss: {
        prependData: '@import "~@/styles/global.scss";',
      },
    },
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },

};
