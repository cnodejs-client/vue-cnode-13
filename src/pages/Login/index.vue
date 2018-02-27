<template>
    <div class="container login">
        <div class="login-box" @click="showHideSideBar">
            <h2>登陆</h2>
            <el-input
                placeholder="accesstoken"
                v-model="value"
                clearable>
            </el-input>
            <el-button type="primary" @click="login">登陆</el-button>
        </div>
    </div>
</template>

<script>
    
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import util from '../../util'

    export default {
        data() {
            return {
                value: 'f326b5c5-bb25-43e8-b46a-b8af5c47e4ab'
            }
        },
        computed: {
            // 映射 state
            ...mapState('user', [
                'user'
            ])
        },
        methods: {
            showHideSideBar() {
                this.$store.state.sideBarOnOff && this.$store.commit('showHideSideBar')
            },
            ...mapActions('user', [
                'getAccessToken'
            ]),
            login() {
                if( this.value === '' ) {
                    this.$message({
                        message: '请输入accesstoken', 
                        type: 'warning' 
                    })
                } else {
                    this.getAccessToken({ 
                        accesstoken: this.value, 
                        success: loginname => {
                            util.setLocalStorage( 'user', JSON.stringify({ 
                                avatar_url: this.user.avatar_url,
                                id: this.user.id,
                                loginname: this.user.loginname
                            }))
                            util.setLocalStorage( 'accesstoken', this.value )
                            this.$router.push( { name: 'user', params: { loginname } } )
                        },
                        fail: () => this.$message.error('错误的accesstoken') 
                    })
                }
            }
        },
        
        
    }
</script>

<style scoped lang="less">

    h2 {
        font-weight: 500;
    }

    .login {
        margin-top: 70px;
    }

    .login-box {
        box-sizing: border-box;

        .el-input {
            margin-bottom: 10px;
        }

        button {
            width: 100%;
        }
    }

    @media (min-width: 768px) {
        .login-box {
            width: 40%;
            margin: 0 auto;
        }
    }

    @media (max-width: 768px) {
        .login-box {
            padding: 15px;
        }
    }

</style>