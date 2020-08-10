import Vue from 'vue';
import { Icon } from 'leaflet';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'leaflet/dist/leaflet.css';

// 删掉获得url的方法，(●ˇ∀ˇ●)!
delete Icon.Default.prototype._getIconUrl;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
