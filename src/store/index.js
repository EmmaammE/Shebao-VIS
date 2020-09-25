import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // wei_gui_lie_zhi_fei_yong
    // wei_gui_ren_shu: 0,
    // wei_gui_ji_gou_shu: 0,
    menudata: [0, 0, 0],

    // 表格的数据
    tableData: {
      page: {},
      total: 0,
    },
  },
  mutations: {
    updatemenu(state, payload) {
      state.menudata = payload.data;
    },

    updateTableData(state, payload) {
      console.log(payload);
      state.tableData = { ...state.tableData, ...payload.data };
    },
  },
  actions: {
  },
  modules: {
  },
});
