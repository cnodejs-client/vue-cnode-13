<template>
    <div class="container warpper">
        <div class="list">
            <div v-if="loading" v-loading="true" class="loading"></div>
            <div v-else>
                <div class="title" v-if=" message.has_read_messages.length ">已读消息</div>
                <ul>
                    <li v-for=" item in message.has_read_messages " :key=" item.id ">
                        <div class="li-box">
                            <router-link :to=' "/user/" + item.author.loginname '>
                                <div class="avatar"><img :src=" item.author.avatar_url "></div>
                            </router-link> 
                            <div class="con">
                                <router-link :to=' "/user/" + item.author.loginname '>
                                    <div class="name">{{ item.author.loginname }}</div>
                                </router-link>
                                <div class="msg-content" v-html=" item.reply.content "></div>
                                <div class="creat-at">回复于{{ format ( item.create_at ) }}</div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="title" v-if="message.hasnot_read_messages.length">未读消息</div>
                <ul>
                    <li v-for=" item in message.hasnot_read_messages " :key=" item.id ">
                        <div class="li-box">
                            <div class="avatar"><img :src=" item.author.avatar_url "></div>
                            <div class="con">
                                <div class="name">{{ item.author.loginname }}</div>
                                <div class="msg-content" v-html=" item.reply.content "></div>
                                <div class="creat-at">回复于{{ format ( item.create_at ) }}</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapState, mapMutations, mapActions } from 'vuex'
    import util from '../../util'

    export default {
        data() {
            return {
                activeName: 'first'
            }
        },
        computed: {
            ...mapState('user', [
                'user',
                'message',
                'accesstoken',
                'loading'
            ])
        },
        methods: {
            ...mapActions('user', [
                'getMessage'
            ]),
            format( str ) {
                return util.format( str )
            }
        },
        created() {
            this.getMessage( this.accesstoken )
        }
    }
</script>

<style scoped lang="less">

    ul {
        margin: 0;
        padding: 0;
    }

    li {
        
        list-style: none;
        
        background-color: #fff;
    }

    .li-box {
        border-top: 1px solid  rgba(178,186,194,.15);
        padding: 15px 0;
        display: flex;
        margin: 0 15px;
    }

    .title {
        padding: 10px 25px;
        font-weight: bold;
        background-color: #fff;
    }

    .title:nth-of-type(2) {
        margin-top: 20px;
    }

    .avatar {
        width: 48px;
        height: 48px;
        margin-right: 15px;
        
        img {
            width: 48px;
            height: 48px;
            border-radius: 3px;
        }

    }

    .creat-at {
        font-size: 12px;
        margin-top: 15px;
        color: #b4b6b8;
    }

    .name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #007fff;
    }

    @media (min-width: 768px) {
        .warpper {
            margin-top: 70px;
            margin-bottom: 20px;
        }

        .list {
            width: 700px;
            padding: 0 25px;
            margin-top: 20px;
        }
    }

    @media (max-width: 768px) {
        .warpper {
            margin-top: 40px;
        }

    }
</style>