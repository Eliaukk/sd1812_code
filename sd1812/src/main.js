import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import VueWechatTitle from "vue-wechat-title";
import { Tab, Tabs } from "vant";
import "vant/lib/button/style";
import { Icon } from "vant";
Vue.use(Icon);
Vue.use(VueAxios, axios);
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;
Vue.use(VueWechatTitle);
Vue.use(Tab);
Vue.use(Tabs);

//注册模块
new Vue({
  router,
  store,
  render: (h) => h(App),
  data: {
    foo: 1,
  },
}).$mount("#app");
