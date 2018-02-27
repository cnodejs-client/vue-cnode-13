<template>
    <div class="topic container" @click="showHideSideBar">
        <div class="loading" v-if="isLoading" v-loading="true"></div>
        <div class="content" v-else>
            <div class="topic-header">
                <h1>{{ data.title }}</h1>
                <div class="topic-author-info">
                    <div class="author-avatar-loginname">
                        <router-link :to=" '/user/' + data.author.loginname ">
                            <img class="author-avatar" :src=" data.author.avatar_url ">
                        </router-link>
                        <router-link :to=" '/user/' + data.author.loginname ">
                            <span class="author-name">{{ data.author.loginname }}</span>
                        </router-link>
                    </div>  
                    <div class="create_at">
                        <span class="collect-warpper" v-if="accesstoken" @click="collect">
                            <i class="fa fa-heart fa-lg" :class="[ is_collect ? active : active_o ]"></i>
                        </span> 
                        发表于{{ format( data.create_at ) }}
                    </div>
                </div>
            </div>
            <div class="topic-content " v-html=" data.content "></div>
            <div class="comment">
                <div class="comment-title">评论</div>
                <div class="comment-warpper">
                    <div class="comment-box">
                        <div class='user-photo'></div>
                        <textarea v-model="value" placeholder="说说你的看法"></textarea>
                    </div>
                    <div class="comment-action">
                        <el-button type="primary" size="mini" @click="reply">评论</el-button>
                    </div>
                </div>
            </div>
            <div class="replies" v-if="replies.length">
                <RepliesItem v-for=" item in replies " :key="item.id" :item="item" :topicId="id" />
            </div>
        </div>
    </div>
</template>
    
<script>
    
    import { mapState, mapMutations, mapActions } from 'vuex'
    import util from '../../util'
    import axios from 'axios'
    import RepliesItem from '../../components/RepliesItem'
    import api from '../../api'

    export default {
        props: ['id'],
        components: {
            RepliesItem
        },
        data() {
            return {
                value: '',
                init_collect: false, // 改变后的状态与初始值对比,没有改变不进行请求
                is_collect: false, // 交互中改变收藏按钮状态的开关
                active: 'fa-heart heart',
                active_o: 'fa-heart-o heart-o',
                timer: null // 定时器
            }
        },
        computed: {
            ...mapState('topic', [
                'isLoading',
                'data',
                'replies'
            ]),
            ...mapState('user', [
                'accesstoken'
            ])
        },
        methods: {
            ...mapActions('topic', [
                'getData',
                'getDataByAccesstoken'
            ]),
            ...mapMutations('topic', [
                'addReplies'
            ]),
            showHideSideBar() {
                this.$store.state.sideBarSwitch && this.$store.commit( 'showHideSideBar' )
            },
            format( str ) {
                return util.format( str )
            },
            collect() {
                this.is_collect = !this.is_collect // 改变状态
                clearTimeout(this.timer)
                this.timer = setTimeout(this.topic_collect, 500)
            },
            topic_collect() {
                if ( this.is_collect === this.init_collect ) return // 状态与初始值相同不用发送请求 

                let url = this.init_collect ? 'de_collect' : 'collect'
                axios.post( api + '/api/v1/topic_collect/' + url, {
                    accesstoken: this.accesstoken,
                    topic_id: this.id
                })
                .then( () => {
                    this.init_collect = this.is_collect
                    console.log('收藏成功')
                } ) // 请求完成替换初始值
                .catch( () => this.$message.error('请求超时')  )
            },
            reply() {
                if( !this.accesstoken ) {
                    this.$message({
                        type: 'warning',
                        message: '你还未登陆！'
                    })
                    return false
                }

                if( this.value === '' ) {
                    this.$message({
                        type: 'warning',
                        message: '内容不能为空'
                    })
                    return false
                }

                axios.post( api + '/api/v1/topic/' + this.id + '/replies', {
                    accesstoken: this.accesstoken,
                    content: this.value
                })
                .then( () => {
                    this.addReplies({
                        author:{
                            avatar_url: this.data.author.avatar_url,
                            loginname: this.data.author.loginname
                        },
                        content: this.value,
                        create_at: new Date(),
                        is_uped: false,
                        ups: []
                    })
                    this.value = ''
                } )
                .catch( () => this.$message.error('提交失败') )

            }
        },
        created() {
            this.accesstoken
            ? this.getDataByAccesstoken({ 
                id: this.id, 
                accesstoken: this.accesstoken, 
                cb: is_collect => {
                    this.is_collect = is_collect
                    this.init_collect = is_collect
                } 
            })
            : this.getData( this.id )
        }


    }
</script>

<style scoped lang="less">
    
    h1 {
        margin: 0 0 10px 0;
        border-bottom: 1px solid rgba(178,186,194,.15);
        padding: 0 0 10px 0;
    }


    .topic{
        margin-top: 70px;

        code {
            background-color: #f7f7f7;
            border: 1px solid rgba(178,186,194,.15);
            padding: 2px;
            color: #333;
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

    .content {
        background-color: #fff;
    }

    .comment {
    }

    .comment-title {
        margin: 15px 0;
        text-align: center;
        color: #909090;
    }

    .comment-warpper {
        box-sizing: border-box;
        background-color: #f8f9fa;
        border: 1px solid #f1f1f1;
        border-radius: 4px;
        padding: 20px;
        margin: 0 auto 20px;
    }

    .comment-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .user-photo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #eee;

        }

        textarea {
            height: 60px;   
            width: 500px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: none;
            outline: none;
            box-sizing: border-box;
            padding: 10px;
            overflow-x: hidden;
        }

        textarea:hover {
            border-color: #409EFF;
        }

    }
    
    .comment-action {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    .collect-warpper {

        cursor: pointer;

        .heart {
            cursor: pointer;
            color: #409EFF;
        }

        .heart-o {
            color: #409EFF;
        }

    }

    @media (min-width: 768px) {
        .content {
            box-sizing: border-box;
            padding: 24px 25px;
            width: 700px;
        }

        .topic {
            margin-bottom: 30px;
        }

        .comment-warpper {
            width: 600px;
        }

        .replies {
            width: 600px;
            margin: 0 auto;
        }
    }

    
    @media (max-width: 768px) { 
        .content {
            padding: 24px 15px;
        }
        .topic {
            margin-top: 40px;
        }

        .user-photo {
            display: none;
        }
        
        .comment-box {

            textarea {
                width: 100%;
            }

        }

        
    }

</style>