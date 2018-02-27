<template>
    <div class="load-more" ref="loadmore" v-loading="true"></div>
</template>
<script type="text/javascript">
    export default {
        mounted() {
            let timer
            let warpper = this.$refs.loadmore
            const callback = () => {
                const top = warpper.getBoundingClientRect().top
                const screenHeight = window.screen.height
                if(top && top < screenHeight) {
                    // 加载更多数据
                    this.$emit('loadMore')
                }
            }

            window.addEventListener('scroll', () => {
                if(timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(callback, 50);
            })
        }
    }
</script>
<style type="text/css">
    .load-more {
        margin-top: 40px;
    }
</style>