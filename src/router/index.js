/**
 * @Author: Caven
 * @Date: 2020-03-19 22:24:00
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'wind',
    component: () => import('../views/cesium/index')
  },
  {
    path: '/cesium-scalar',
    name: 'cesium-scalar',
    component: () => import('../views/cesium/scalar')
  },
  {
    path: '/maptalks-wind',
    name: 'maptalks-wind',
    component: () => import('../views/maptalks/index')
  },
  {
    path: '/maptalks-scalar',
    name: 'maptalks-scalar',
    component: () => import('../views/maptalks/index2')
  }
]

const router = new VueRouter({
  routes
})

export default router
