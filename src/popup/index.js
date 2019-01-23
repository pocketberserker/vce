import Vue from "vue";
import Vuetify from "vuetify";
import root from "./root.vue";
import "vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false;
Vue.use(Vuetify);
new Vue({
  el: "#root",
  render: h => h(root)
});
