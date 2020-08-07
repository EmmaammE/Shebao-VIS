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

  // 配置跨域请求
  devServer: {
    open: true, // 是否自动打开浏览器
    host: 'localhost',
    port: 8080, // 启动端口号
    https: false, // 是否开启https
    hotOnly: false,
    proxy: { // 配置跨域
      '/api': {
        target: 'http://49.232.152.200:8000/backend/',
        ws: true,
        changeOrigin: true, // 是否开启代理
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    before: (app) => {},
  },

};
