import Vue from 'vue'
import Vuex from 'vuex'
import topics from './modules/topics'
import topic from './modules/topic'
import user from './modules/user'

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        sideBarSwitch: false
    },
    mutations: {
        showHideSideBar( state ) {
            state.sideBarSwitch = !state.sideBarSwitch
        }
    },
    modules: {
        topics,
        topic,
        user
    }
})


export default store