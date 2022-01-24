import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import Vuelidate from "vuelidate"
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import router from './router'

import store from "./store";

import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

Vue.use(Tooltip);


Vue.config.productionTip = false


Vue.use(Vuelidate)

Vue.use(router)


new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')