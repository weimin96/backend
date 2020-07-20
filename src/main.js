import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueBus from 'vue-bus'


require('./mock');

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.use(VueBus)
Vue.prototype.$axios = axios

// 路由拦截登录
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 微信管理平台`
  const role = $cookies.get('role')
  if (!role && to.path !== '/login') {
    next('/login')
  } else if (to.meta.permission) {
    // TODO 请求校验
    role === 'admin' ? next() : next('/login')
  } else {
    next()
  }
})

const app = new Vue({
  router,
  render: h => h(App),
  mounted () {
    this.$cookies.config(24 * 60 * 60 * 1000, '/')
  }
}).$mount('#app')

