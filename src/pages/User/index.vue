<template>
    <div class="container warpper">
        <div class="user">
            <div v-if="loading" v-loading="true" class="loading"></div>
            <div v-else>
                <div class="user-info">
                    <div class="user-avatar"><img :src=" avatar_url "></div>
                    <div class="user-name">{{ loginname }}</div>
                </div>
                <div class="list">
                    <div class="replies" v-if=" replies.length ">
                        <div class="replies-title">参与的话题</div>
                        <div class="item" v-for=" item in replies " :key=" item.id ">
                            <router-link :to=" '/topic/' + item.id ">
                                <div class="meta">
                                    <router-link class="name" :to=" '/user/' + item.author.loginname ">
                                        {{ item.author.loginname }}
                                    </router-link>
                                    <span class="last-reply">{{ format( item.last_reply_at ) }}</span>
                                </div>
                                <div class="title">{{ item.title }}</div>
                            </router-link>
                        </div>
                    </div>
                    <div class="topics" v-if=" topics.length ">
                        <div class="topics-title">创建的话题</div>
                        <div class="item" v-for=" item in topics " :key=" item.id ">
                            <router-link :to=" '/topic/' + item.id ">
                                <div class="meta">
                                    <router-link class="name" :to=" '/user/' + item.author.loginname ">
                                        {{ item.author.loginname }}
                                    </router-link>
                                    <span class="last-reply">{{ format( item.last_reply_at ) }}</span>
                                </div>
                                <div class="title">{{ item.title }}</div>
                            </router-link>
                        </div>
                    </div>
                    <div class="collect" v-if=" collect.length ">
                        <div class="collect-title">收藏的话题</div>
                        <div class="item" v-for=" item in collect " :key=" item.id ">
                            <router-link :to=" '/topic/' + item.id ">
                                <div class="meta">
                                    <router-link class="name" :to=" '/user/' + item.author.loginname ">
                                        {{ item.author.loginname }}
                                    </router-link>
                                    <span class="last-reply">{{ format( item.last_reply_at ) }}</span>
                                </div>
                                <div class="title">{{ item.title }}</div>
                                <div class="item-action">
                                    <el-button size="mini" icon="el-icon-message">{{ k( item.reply_count ) }}</el-button>
                                    <el-button size="mini" icon="el-icon-view">{{ k( item.visit_count ) }}</el-button>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapState, mapMutations, mapActions } from 'vuex'
    import axios from 'axios'
    import api from '../../api'
    import util from '../../util'


    export default {
        props: [ 'loginname' ],
        data() {
            return {
                loading: false,
                avatar_url: '', // 头像地址
                replies: [], // 参与的话题
                topics: [], // 创建的话题
                collect: [] // 收藏的话题
            }
        },
        computed: {
            ...mapState('user', [
                'accesstoken',
                'user'
            ])
        },
        methods: {
            format ( str ) {
                return util.format( str )
            },
            getUser( loginname ) {
                this.loading = true
                // axios.get('/api/v1/user/' + loginname)
                // .then( ({ data : { data: { avatar_url, recent_replies, recent_topics } } }) => {
                //     this.loading = false
                //     this.avatar_url = avatar_url
                //     this.replies = recent_replies
                //     this.topics = recent_topics
                // } )
                // .catch( err => console.log(err) )
                // axios.get('/api/v1/topic_collect/' + loginname)
                // .then( data => console.log(data) )


                axios.all([axios.get( api + '/api/v1/user/' + loginname), axios.get( api + '/api/v1/topic_collect/' + loginname)])
                .then( ( [ { data : { data: { avatar_url, recent_replies, recent_topics } } }, { data: { data: collect } } ] ) => {
                    this.loading = false
                    this.avatar_url = avatar_url
                    this.replies = recent_replies
                    this.topics = recent_topics
                    this.collect = collect
                } )
                .catch( () => this.$message.error('请求超时'))
            },
            k(str) {
                let number = Number(str)
                let nStr = String(number/1000)
                return number > 1000 ? nStr.slice(0, nStr.indexOf('.') + 2 ) + 'K' : number
            }
        },
        created() {
            this.getUser( this.loginname )
        },
        beforeRouteUpdate ( to, from, next) {
            this.getUser( to.params.loginname )
            next() // 不写此方法不会路由地址不会变化
        }
        
    }
</script>

<style scoped lang="less">
    
    .user-info {
        display: flex;
        background-color: #fff;
        box-sizing: border-box;
        padding: 25px;
    }


    .user-avatar {
        height: 90px;
        width: 90px;
    }

    .github {
        height: 16px;
        width: 16px;

        img {
            height: 16px;
            width: 16px;
        }
    }

    img {
        height: 90px;
        width: 90px;
        border-radius: 50%;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
    }

    .user-name {
        font-size: 24px;
    }

    .list {

        .item:hover {
            background-color: #fafafa;
        }
    }

    .item {
        padding: 15px 25px;
        border-top: 1px solid rgba(178, 186, 194, 0.15);
        background-color: #fff;
        cursor: pointer;

        .meta {
            font-size: 13px;

            a:hover {
                text-decoration: underline;
            }
        }

        .title {
            margin-top: 8px;
        }
    }
    
    .replies, .topics, .collect {
        margin-top: 20px;
    }

    .topics-title, .replies-title, .collect-title {
        font-size: 14px;
        padding: 15px 25px;
        background-color: #fff;
        font-weight: bold;
    }

    .collect {

        .title {
            margin: 8px 0 6px 0;
        }
    }

    @media (min-width: 768px) {
        .warpper {
            margin-top: 70px;
        }

        .user {
            width: 700px;
        }

        .user-avatar {
            margin-right: 20px; 
        }

        .list {
            margin: 20px 0 20px 0;
        }
        
        
    }

    @media (max-width: 768px) {
        .warpper {
            margin-top: 40px;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

    }
</style>