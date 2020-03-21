import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from "../views/Home";
import Tag from "../views/Tag";
import Video from "../views/Video";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden:true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    hidden: true
  },
  {
    path: '/home',
    name: '标签管理',
    component: Home,
    children:[
      {
        path: '/tag',
        name: '标签管理',
        component: Tag
      },
    ]
  },
  {
    path: '/home',
    name: '视频管理',
    component: Home,
    children:[              // 用于在当前页面的子页面展示内容
      {
        path: '/video',
        name: '视频管理',
        component: Video
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
