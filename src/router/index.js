import Vue from 'vue'
import VueRouter from 'vue-router'
import AircraftList from '../views/aircraft/AircraftList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/aircraft'
  },
  {
    path: '/aircraft',
    name: 'AircraftList',
    component: AircraftList
  },
  {
    path: '/aircraft/stats',
    name: 'AircraftStats',
    component: () => import('../views/aircraft/AircraftStats.vue')
  },
  {
    path: '/task/:aircraftId',
    name: 'TaskAssignment',
    component: () => import('../views/aircraft/TaskAssignment.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router 