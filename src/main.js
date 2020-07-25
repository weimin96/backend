import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies from 'js-cookie'
import VueBus from 'vue-bus'
import axios from './util/axios'
import store from '@/store'


require('./mock');

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueBus)
Vue.prototype.$axios = axios



// // 路由拦截登录
// router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title} | 微信管理平台`
//   var isLogin = Auth.isLogin();

//   if (!role && to.path !== '/login') {
//     next('/login')
//   } else if (to.meta.permission) {
//     // TODO 请求校验
//     role === 'admin' ? next() : next('/login')
//   } else {
//     next()
//   }
// })

const app = new Vue({
  router,
  store,
  axios,
  render: h => h(App),
  mounted () {

  }
}).$mount('#app')

