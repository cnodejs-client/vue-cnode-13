<template>
    <div class="replies-item" > 
        <div class="topic-author-info">
            <div class="author-avatar-loginname">
                <router-link :to=" '/user/' + item.author.loginname ">
                    <img class="author-avatar" :src=" item.author.avatar_url ">
                </router-link>
                <router-link :to=" '/user/' + item.author.loginname ">
                    <span class="author-name">{{ item.author.loginname }}</span>
                </router-link>
            </div>
            <div class="create_at">回复于{{ format( item.create_at ) }}</div>
        </div>
        <div class="replies-main " v-html=" item.content "></div>
        <div class="replies-bar">
            <el-button :class=" [ is_uped ? uped : up ] " size="mini" icon="el-icon-caret-top" @click=" thumb ">
                {{ len }}
            </el-button>
            <el-button size="mini" @click=" showComment " icon="el-icon-message"></el-button>
        </div>
        <transition name="down">  
            <div v-show="commentSwitch" class="replies-comment">
                <textarea v-model="value"></textarea>
                <el-button type="primary" size="mini" @click="reply">评论</el-button>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    
    import { mapState, mapMutations } from 'vuex'
    import util from '../../util'
    import axios from 'axios'
    import api from '../../api'

    export default {
        props: [ 'item', 'topicId' ],
        data() {
            return {
                prev: 0, // 取消点赞对应的数值
                next: 0, // 点赞对应的数值
                init_len: 0, // 初始化点赞的数值
                len: 0, // 交互中改变的点赞数值
                timer: null, //定时器
                is_uped: false, // 判断评论是否点赞
                commentSwitch: false, // 评论中的回复框显示的状态值
                value: '',  
                uped: 'uped', 
                up: 'up' 
            }
        },
        computed: {
            ...mapState('user', [
                'accesstoken',
                'user'
            ]),
            ...mapState('topic', [
                'repliesLength'
            ])
        },
        methods: {
            ...mapMutations('topic', [
                'addReplies'
            ]),
            format( str ) {
                return util.format( str )
            },
            thumb() {
                if( !this.accesstoken ) {
                    this.$message({
                        message: '请先登陆',
                        type: 'warning',
                        showClose: 'true'
                    })
                    return
                } else if ( this.item.author.loginname === this.user.loginname ) {
                    this.$message({
                        type: 'warning',
                        message: '你不能给自己点赞'
                    })
                    return
                }
                this.is_uped = !this.is_uped
                this.len = this.is_uped ? this.next : this.prev
                clearTimeout(this.timer)
                this.timer = setTimeout(this.request_thumb, 500)
            },
            request_thumb() {
                if ( this.len === this.init_len ) return
                axios.post( api + '/api/v1/reply/' + this.item.id + '/ups', {
                    accesstoken: this.accesstoken
                })
                .then( () => {
                    this.init_len = this.len
                } )
                .catch( () => this.$message.error('网络超时') )
            },
            reply() {
                if( this.value.split(' ')[1] === '' ) {
                    this.$message({
                        type: 'warning',
                        message: '内容不能为空'
                    })
                    return
                }
                axios.post( api + '/api/v1/topic/' + this.topicId + '/replies', {
                    accesstoken: this.accesstoken,
                    content: this.value,
                    reply_id: this.item.id
                })
                .then( () => {
                    let str = this.value.split(' ')
                    let username = str[0].split('@')[1]
                    this.addReplies({
                            author:{
                                avatar_url: this.user.avatar_url,
                                loginname: this.user.loginname
                            },
                            content: `<a href="/user/${username}">@${username}</a>&nbsp;${str[1]}`,
                            create_at: new Date(),
                            is_uped: false,
                            ups: []
                    })
                    this.commentSwitch = false
                    this.value = '@' + this.item.author.loginname + ' '
                })
                .catch( () => this.message.error('网络超时') )
            },
            showComment() {
                if( !this.accesstoken ) {
                    this.$message({
                        message: '请先登陆',
                        type: 'warning',
                        showClose: 'true'
                    })
                    return
                } 
                this.commentSwitch = true
            }
        },
        created() {
            this.len = this.item.ups.length
            this.init_len = this.item.ups.length
            this.prev = this.item.is_uped ? this.len - 1 : this.len
            this.next = this.item.is_uped ? this.len : this.len + 1
            this.is_uped = this.item.is_uped
            this.value = '@' + this.item.author.loginname + ' '
        }
    }
</script>

<style type="text/css" scoped lang="less">

    .replies-item {
        padding: 15px 0;
        border-bottom: 1px solid rgba(178,186,194,.15);
    }

    .replies-item:last-child {
        border-bottom: none;
    }

    .replies-item p {
        margin: 10px 0;
    }

    .replies-main {
        margin-left: 45px;
        font-size: 14px;

    }

    .replies-bar {

        display: flex;
        margin: 10px 0 0 45px;

        .uped {
            color: #3a8ee6;
            background-color: #ecf5ff;
            border-color: #ecf5ff;
        }

        .up {
            color: #606266;
            background-color: #fff;
            border: 1px solid #dcdfe6;   
        }

        .el-button:hover {
            color: #409EFF;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
        }
    }

    .ups {
        span {
            font-size: 13px;
        }
    }

    .topic-author-info {
        display: flex;
        justify-content: space-between;
        font-size: 13px;

        .author-name {
            vertical-align: top;
            font-weight: bold;
        }
    }

    .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 5px;
    }

    .replies-comment {
        padding: 20px;
        box-sizing: border-box;
        background-color: #f8f9fa;
        border: 1px solid #f1f1f1;
        border-radius: 4px;
        margin: 10px 0 0 45px;
        
        textarea {
            display: block;
            box-sizing: border-box;
            width: 100%;
            height: 60px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: none;
            outline: none;
            margin-bottom: 10px;
            overflow-x: hidden;
            overflow-y: hidden;
        }

        textarea:hover {
            border-color: #409EFF;
        }
    }

    .down-enter, .down-leave-to {
        opacity: 0;
    }
    
    .down-enter-active, .down-leave-active {
        transition: opacity .5s;
    }



</style>