import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // wei_gui_ji_gou_shu: 0,
    //   wei_gui_ren_shu: 0,
    //   wei_gui_lie_zhi_fei_yong
    menudata: [0, 0, 0],

  },
  mutations: {
    updatemenu(state, payload) {
      state.menudata = payload.data;
    },
  },
  actions: {
  },
  modules: {
  },
});
