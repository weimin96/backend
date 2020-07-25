import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '@/util/auth'
import whiteList from '@/router/whiteList'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { title: '自述文件' },
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
        meta: { title: '系统首页' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { title: '登录' }
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})

// 路由拦截登录
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 管理平台`

  // 判断用户是否处于登录状态
  if (Auth.isLogin()) {
    // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
    if (to.path === '/login') {
      next('/')
    } else if(to.path.indexOf("/error") >= 0){
      // 防止因重定向到error页面造成beforeEach死循环
      next()
    } else{
      // TODO 权限控制
      next()
    }
  } else{
    // 如果是免登陆的页面则直接进入，否则跳转到登录页面
    if (whiteList.indexOf(to.path) >= 0) {
      console.log('该页面无需登录即可访问')
      next()
    } else {
      console.log('当前未处于登录状态，请登录')
      next({path: "/login", replace: true})
      
    }
  }
  
})

export default router
