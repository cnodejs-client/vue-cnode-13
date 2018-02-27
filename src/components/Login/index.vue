<template>
    <div class="container">
        <el-dialog
        title="登陆"
        :visible.sync="loginSwitch"
        :before-close="showLogin">
            <el-input
            placeholder="accessToken"
            v-model="value"
            clearable>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="login">登 陆</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import util from '../../util'
    import LoadMore from '../../components/LoadMore'

    export default {
        data() {
            return {
                value: 'f326b5c5-bb25-43e8-b46a-b8af5c47e4ab'
            }
        },
        computed: {
            // 映射 state
            ...mapState([
                'loginSwitch'
            ])
        },
        methods: {
            showHideSideBar() {
                this.$store.state.sideBarSwitch && this.$store.commit('showHideSideBar')
            },
            ...mapMutations([
                'showLogin'
            ]),
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
                        success: () => console.log('success'),
                        fail: () => this.$message.error('错误的accesstoken') 
                    })
                }
                
            }

        },
        
        
    }
</script>

<style scoped lang="less">
    @media (min-width: 768px) {
        .container .el-dialog {
            width: 30%;
        }
    }

    @media (max-width: 768px) {
        .container .el-dialog {
            width: 90%;
        }
    }
</style>