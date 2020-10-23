import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
Vue.use(Router);

//路由配置
export default new Router({
    mode: "hash",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "defaultPage",
            component: Home,
            meta: {
                title: "",
                keepAlive: false,
            },
        },
        {
            path: "/home",
            name: "home",
            component: Home,
            meta: {
                title: "",
                keepAlive: false,
            },
        },
        {
            path: "*",
            name: "errorPage",
            component: Home,
            meta: {
                title: "",
                keepAlive: false,
            },
        },
    ],
});
