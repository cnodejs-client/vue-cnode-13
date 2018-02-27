import VueRouter from 'vue-router'
import Vue from 'vue'

import App from '../App'
import Topics from '../pages/Topics'
import User from '../pages/User'
import Topic from '../pages/Topic'
import About from '../pages/About'
import Login from '../pages/Login'
import Message from '../pages/Message'
import Header from '../components/Header'

import util from '../util'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '/',
                component: Topics,
                name: 'topics'
            },
            {
                path: '/user/:loginname',
                component: User,
                name: 'user',
                props: true
            },
            {
                path: '/topic/:id',
                component: Topic,
                props: true 
            },
            {
                path: '/about',
                component: About
            },
            {
                path: '/login',
                component: Login
            },
            {
                path: '/message',
                component: Message
            }
        ]
    }
]



const router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
    let accesstoken = util.getLocalStorage( 'accesstoken' )
    if ( accesstoken ) {
        router.app.$options.store.commit('user/setAccesstokenAndUser', { accesstoken, user: JSON.parse(util.getLocalStorage('user')) })
    } 
    // if ( util.getLocalSorage )
    // 进入新路由 判断侧边栏是否显示,显示隐藏反之显示
    router.app.$options.store.state.sideBarSwitch && router.app.$options.store.commit('showHideSideBar')
    next()
})

router.afterEach((to, from) => {
})

export default router