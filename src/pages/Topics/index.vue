<template>
    <div class="home container">
        <div class="topics" >
            <div class="tabs" @click="showHideSideBar">
                <ul>
                    <li v-for=" tab in tabs " :key=" tab.tab ">
                        <router-link :to=" { path: '/', query: { tab: tab.tab } } ">{{ tab.title }}</router-link>
                    </li>
                </ul>
            </div>
            <div class="loading" v-if="isLoading" v-loading="true"></div>
            <div class="list" v-else>
                <ul>
                    <li class="item" v-for="item in data[category].data">
                        <router-link :to=" 'topic/' + item.id ">
                            <div class="padding-box">   
                                <div class="item-meta">
                                    <span class="tab">{{ item.top ? '置顶' : tab(item) }}</span>
                                    <span class="loginname">
                                        <router-link :to=" 'user/' + item.author.loginname ">{{ item.author.loginname }}</router-link>
                                    </span>
                                    <span class="last-reply-at">{{ format( item.last_reply_at ) }}</span>
                                </div>
                                <div class="item-title">{{ item.title }}</div>
                                <div class="item-action">
                                    <el-button size="mini" icon="el-icon-message">{{ k( item.reply_count ) }}</el-button>
                                    <el-button size="mini" icon="el-icon-view">{{ k( item.visit_count ) }}</el-button>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
                <LoadMore @loadMore="loadMoreData" />
            </div>
        </div>
    </div>
</template>

<script>
    
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import util from '../../util'
    import LoadMore from '../../components/LoadMore'

    export default {
        data() {
            return {
                tabs: [
                    {
                        title: '精华',
                        tab: 'good'
                    },
                    {
                        title: '分享',
                        tab: 'share'
                    },
                    {
                        title: '询问',
                        tab: 'ask'
                    },
                    {
                        title: '工作',
                        tab: 'job'
                    },
                    {
                        title: '测试',
                        tab: 'dev'
                    }
                ]
            }
        },
        components: {
            LoadMore
        },
        computed: {
            // 映射 state
            ...mapState('topics', [
                'data',
                'isLoading',
                'category'
            ])
        },
        methods: {
            alert() {
                alert('ceshi')
            },
            showHideSideBar() {
                this.$store.state.sideBarSwitch && this.$store.commit('showHideSideBar')
            },
            ...mapMutations('topics', [
                'selectCategory'
            ]),
            ...mapActions('topics', [
                'getData'
            ]),
            // 格式化
            format(str) {
                return util.format(str)
            },
            // 转化tab
            tab( { tab, good } ) {
                let obj = {
                    share: '分享',
                    job: '招聘',
                    dev: '测试',
                    ask: '问答'
                }
                return good ? '精华' : obj[tab]
            },
            k(str) {
                let number = Number(str)
                let nStr = String(number/1000)
                return number > 1000 ? nStr.slice(0, nStr.indexOf('.') + 2 ) + 'K' : number
            },
            loadMoreData() {
                this.getData({
                    tab: this.category,
                    page: this.data[this.category].page,
                    type: 'getNextPageData'
                })
            }

        },
        // 生命周期
        created() {
            // 判断vuex中的数据是否存在
            // console.log(this.$router.history.current.query.tab)
            
            let category = this.$router.history.current.query.tab || 'all'
            this.data[category] === undefined && this.getData( { tab: category, page: 1, type: 'getData' } )
        },
        // 路由导航
        beforeRouteUpdate(to, from, next) {
            // 判断vuex中的数据是否存在
            this.data[to.query.tab] === undefined 
            ? this.getData( { tab: to.query.tab, page: 1, type: 'getData' } ) 
            : this.selectCategory(to.query.tab)
            next() // 坑 不写此方法路由地址不会变化
        }
        
        
    }
</script>

<style scoped lang="less">

    

    ul {
        padding: 0;
        margin: 0
    }

    li {
        list-style: none;
    }

    .list {
        background-color: #fff;

        li:hover {
            background-color: #fafafa;
        }
    }

    .tabs {
        background-color: #fff;

        ul {
            display: flex;
            align-items: center;
            height: 30px;
            padding: 15px 25px;

            li {
                margin: 0 10px;
                
                a:hover {
                    color: #409eff;
                    transition-duration: .1s;
                }


                .router-link-exact-active {
                    color: #409eff;
                }
            }
        }
        

        
    }

    .item {
        border-top: 1px solid rgba(178,186,194,.15); 
    }

    .padding-box { 
        padding: 15px 25px;
        
        .item-meta {
            font-size: 13px;
        }

        .item-title {
            margin: 8px 0 6px 0;
        }

        .item-action {
            font-size: 14px;
        }
    }

    @media (min-width: 768px) {
        .topics {
            width: 700px;
        }

        .home {
            margin-top: 70px;
        }
    }

    @media (max-width: 768px) {
        .home {
            margin-top: 40px;
        }
    }

    .loginname {
        a:hover {
            text-decoration: underline;
        }
    }

</style>