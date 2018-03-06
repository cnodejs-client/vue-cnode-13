<template>
    <div class="about container">
        <ul>
            <li>
                <dl>
                    <dt>源码</dt>
                    <dd><a href="https://github.com/lhmmhs/vue-cnode">https://github.com/lhmmhs/vue-cnode</a></dd>
                </dl>
            </li>
            <li>
                <dl>
                    <dt>感谢</dt>
                    <dd><a href="https://cnodejs.org/">cnode</a>社区提供的api</dd>
                </dl>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        }
    }
</script>

<style type="text/css" scoped lang="less">
    .about {
        margin-top: 70px;

        a {
            color: #41b883;
        }
    }

    @media (max-width: 768px) {
        .about {
            margin-top: 60px;
        }
    }
</style>