import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import {    
    Button,
    Icon,
    Loading,
    Input,
    Message
} from 'element-ui'
import './static/reset.css'

const isProduction = process.env.NODE_ENV !== 'production'

Vue.config.devtools = isProduction
Vue.config.productionTip = isProduction

Vue.use(Button)
Vue.use(Icon)
Vue.use(Loading)
Vue.use(Input)

Vue.prototype.$message = Message

new Vue({
    el: "#root",
    router,
    store
})

