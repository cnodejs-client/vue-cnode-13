
export default {

    format( str ) {
        let date = new Date(str);
        let time = new Date().getTime() - date.getTime();
        if (time < 0) {
            return '刚刚';
        } else if (time / 1000 < 60) {
            return '刚刚';
        } else if ((time / 60000) < 60) {
            return parseInt((time / 60000)) + '分钟前';
        } else if ((time / 3600000) < 24) {
            return parseInt(time / 3600000) + '小时前';
        } else if ((time / 86400000) < 31) {
            return parseInt(time / 86400000) + '天前';
        } else if ((time / 2592000000) < 12) {
            return parseInt(time / 2592000000) + '个月前';
        } else {
            return parseInt(time / 31536000000) + '年前';
        }
    },

    getLocalStorage( key ) {
        return localStorage.getItem( key )
    },

    setLocalStorage( key, value ) {
        return localStorage.setItem( key, value )
    },

    removeLocalStorage( key ) {
        return localStorage.removeItem( key )
    }

}