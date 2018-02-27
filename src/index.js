import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import {    
    Button,
    Icon,   
    Loading,
    Tabs,
    TabPane,
    Input,
    // Dialog,
    Message
} from 'element-ui'
import './static/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css';

Vue.use(Button)
Vue.use(Icon)
Vue.use(Loading)
Vue.use(Input)
// Vue.use(Dialog)
// Vue.use(TabPane)
// Vue.use(Tabs)

Vue.prototype.$message = Message

/*
    render函数什么时候使用？
*/
new Vue({
    el: "#root",
    router,
    store
    // render: h => h(App) 坑
})

