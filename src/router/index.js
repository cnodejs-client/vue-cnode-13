import VueRouter from 'vue-router'
import Vue from 'vue'

import App from '../App'
// import Topics from '../pages/Topics'
// import User from '../pages/User'
// import Topic from '../pages/Topic'
// import About from '../pages/About'
// import Login from '../pages/Login'
// import Message from '../pages/Message'

import util from '../util'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '/',
                component: () => import('../pages/Topics'),
                name: 'topics'
            },
            {
                path: '/user/:loginname',
                component: () => import('../pages/User'),
                name: 'user',
                props: true
            },
            {
                path: '/topic/:id',
                component: () => import('../pages/Topic'),
                props: true 
            },
            {
                path: '/about',
                component: () => import('../pages/About')
            },
            {
                path: '/login',
                component: () => import('../pages/Login')
            },
            {
                path: '/message',
                component: () => import('../pages/Message')
            }
        ]
    }
]

const mode = process.env.NODE_ENV === 'production' ? 'hash' : 'history'

const router = new VueRouter({
    mode,
    routes
})

router.beforeEach(({ path }, from, next) => {
    let $store = router.app.$options.store
    let accesstoken = util.getLocalStorage('accesstoken')
    let user =  JSON.parse(util.getLocalStorage('user'))
    if ( !accesstoken && path === '/message' ) {
        return next('/login')
    } else {
        $store.commit('user/setAccesstokenAndUser', { accesstoken, user })
    }
    $store.state.sideBarSwitch && $store.commit('showHideSideBar')
    next()
})

export default router