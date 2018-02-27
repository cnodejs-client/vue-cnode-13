import axios from 'axios'
import api from '../../api'

const state = {
    data: {},
    isLoading: false,
    replies: []
}

const mutations = {
    request( state ) {
        state.isLoading = true
    },
    receive( state, topic ) {
        state.isLoading = false
        state.data = topic
        state.replies = topic.replies
        console.log(state)
    },
    addReplies( state, repliesItem ) {
        state.replies = state.replies.concat(repliesItem)
    }
}

const actions = {
    getData( { commit, state, rootState }, id ) {
        commit('request')
        axios.get( api + '/api/v1/topic/' + id)
        .then( ({ data: { data : topic } }) => commit('receive', topic) )
        .catch()
    },
    getDataByAccesstoken( { commit, state, rootState }, { id, accesstoken, cb } ) {
        commit('request')
        axios.get( api + '/api/v1/topic/' + id, {
            params: {
                accesstoken 
            }
        })
        .then( ({ data: { data : topic } }) => {
            cb(topic.is_collect)
            commit('receive', topic)
        } )
        .catch()
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

