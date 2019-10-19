import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
import Tabbar from '@/views/tabbar'
import Home from '@/views/Home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
      // component: () => { '@/views/login' }// 路由懒加载
    },
    {
      name: 'search',
      path: '/search',
      component: Search
      // component: () => { '@/views/login' }// 路由懒加载
    },
    {
      name: 'searchresult',
      path: '/searchresult/:q',
      component: SearchResult
      // component: () => { '@/views/login' }// 路由懒加载
    },

    {
      path: '/',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '',
          component: Home
        }
      ]
    }
  ]
})

export default router
