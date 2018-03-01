import axios from 'axios'
import api from '../../api'

const state = {
    isLoading: false, // 控制加载动画
    category: '', // 当前tab   
    data: {} // 缓存数据
}

const mutations = {
    // 开始发送请求
    request( state, type ) {
       if ( type === 'getData' ) state.isLoading = true
    },
    // 请求完成 
    receive( state, { topics, tab, page, type } ) {
        if( type === "getData" ) { // 请求数据
            state.isLoading = false
            state.category = tab
            state.data = { ...state.data, [tab]: { data: topics, page: 2 } }
        } else if ( type === "getNextPageData" ) { // 请求下一页数据
            state.data[state.category].data = state.data[state.category].data.concat(topics)
            state.data[state.category].page = ++page
        }
    },  
    // 改变当前tab
    selectCategory( state, category ) {
        state.category = category 
    }
}

const actions = {
    // 请求数据
    getData( { commit, state, rootState }, { tab, page, type } ) {
        commit('request', type)
        axios.get( api + '/api/v1/topics', {
            params: {
                limit: 15, // 每次请求15条数据
                tab, // 请求数据的类型
                page // 页码
            }
        })
        .then( ({ data: { data : topics } }) => commit('receive', { topics, tab, page, type }))
        .catch(err => console.log(err))
    }
}

export default {
    // 命名空间 单词拼写错误
    namespaced: true,
    state,
    mutations,
    actions
}