import axios from 'axios'
import api from '../../api'
    
const state = {
    accesstoken: '',
    error: '',
    loading: false,
    user: {},
    message: {}
}

const mutations = {
    request( state ) {
        state.loading = true
    },
    receive( state, { accesstoken, data, success } ) {
        state.accesstoken = accesstoken
        state.user = data
        success( data.loginname )
    },
    error( state, fail ) {
        fail()
    },
    getMessageSuccess( state, { has_read_messages, hasnot_read_messages } ) {
        state.loading = false
        state.message = { 
            ...state.message, 
            has_read_messages: has_read_messages, 
            hasnot_read_messages: hasnot_read_messages 
        }
        console.log(has_read_messages)
    },
    setAccesstokenAndUser( state, { accesstoken, user } ) {
        state.accesstoken = accesstoken,
        state.user = user
    }
}

const actions = {
    getAccessToken( { commit, state, rootState }, { accesstoken, success, fail } ) {
        axios.post( api + '/api/v1/accesstoken', {
            accesstoken
        })
        .then( ( { data } ) => commit( 'receive', { accesstoken, data, success } ) )
        .catch( () => commit( 'error', fail ) )
    },
    getMessage( { commit, state, rootState }, accesstoken ) {
        commit('request')
        axios.get( api + '/api/v1/messages', {
            params: {
                accesstoken
            }
        })
        .then( ( { data : { data: { has_read_messages, hasnot_read_messages } } } ) => {
            commit('getMessageSuccess', { has_read_messages, hasnot_read_messages } )
        } )
        .catch( err => console.log(err) )
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}