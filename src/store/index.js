import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 页面左侧选中的子菜单
    submenu: [0, 0],
  },
  mutations: {
    changeMenu(state, payload) {
      state.submenu = [payload.i, payload.j];
    },
  },
  actions: {
  },
  modules: {
  },
});
