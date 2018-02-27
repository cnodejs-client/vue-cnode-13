<template>
    <div class="H">     
        <div class="header" @click.self="show">
            <span class="sidebar-btn" @click="showHideSideBar"></span>
            <ul class="nav">
                <li><router-link to="/">首页</router-link></li>
                <li v-if="!accesstoken"><router-link to="/login">登陆</router-link></li>
                <li v-else class="avatar"><router-link to="/message"><img :src=" user.avatar_url "></router-link></li>
                <li><router-link to="/about">关于</router-link></li>
            </ul>
        </div>
        <transition name="sidebar">
            <div v-show="sideBarSwitch" class="sidebar">
                <ul>

                    <li><router-link to="/">首页</router-link></li>
                    <li v-if="!accesstoken"><router-link to="/login">登陆</router-link></li>
                    <li v-else class="avatar">
                        <router-link to="/message">
                            <img :src=" user.avatar_url ">
                        </router-link>
                    </li>
                    <li><router-link to="/about">关于</router-link></li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>

    import { mapState, mapMutations } from 'vuex'

    export default {
        data() {
            return {
            }
        },
        methods: {
            ...mapMutations([
                'showHideSideBar',
                'showLogin'
            ]),
            show() {
                this.sideBarSwitch && this.showHideSideBar()
            },
            dialog() {
                this.showLogin()
            }
        },
        computed: {
            ...mapState([
                'sideBarSwitch',
                'loginSwitch'
            ]),
            ...mapState('user', [
                'user',
                'accesstoken'
            ])
        }
    }
    
</script>

<style scoped lang="less">
    body,ul,ol,li,div{ margin: 0; padding: 0; }

    li{
        list-style: none;
    }

    .sidebar-enter, .sidebar-leave-to {
        transform: translateX(-100%); 
    }

    .sidebar-leave-active, .sidebar-enter-active {
        transition: transform .5s; 
    }

    .sidebar{
        width: 200px;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #f9f9f9;
        z-index: 10;
        
        li {
            height: 40px;
            line-height: 40px;
            text-align: center;
        }
    }

    .header {
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        padding: 10px;
        position: fixed;
        top: 0;
        box-shadow: 0 0 1px rgba(0,0,0,0.25);
        z-index: 2;
        background-color: #fff;
    }

    .sidebar-btn {
        display: inline-block;
        height: 24px;
        width: 24px;
        background: url(../../static/images/menu.png) center center no-repeat;
        background-size: 24px;
        cursor: pointer;
    }

    .nav {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        right: 100px;
        top: 10px;
        height: 30px;

        li {
            margin: 0 10px;
        }
    }

    @media (min-width: 768px) {
        .sidebar-btn {
            display: none;
        }


    }

    @media (max-width: 768px) {
        .nav {
            display: none;
        }
        .tabs {
            display: none;
        }
        .header {
            height: 40px;
        }
        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;

            a {
                height: 30px;
                width: 30px;

            }
        }
    }

    .login {
        cursor: pointer;
    }
    
    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .avatar {
        height: 30px;
    }

    
</style>