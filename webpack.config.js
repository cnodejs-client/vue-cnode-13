const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html文件                   
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 抽离css文件
const OpenBrowserPlugin = require('open-browser-webpack-plugin'); // 浏览器打开插件

let plugins = [];
let path = __dirname + '/dist'; // 输出文件的路径
let publicPath = '/'; // 服务器资源指定路径

plugins.push(new ExtractTextPlugin('css/[name].[contenthash:8].css')); // 指定抽离的css文件名

let htmlPlugin = {
    template: './index.html', // 本地模板文件的位置
    favicon: './src/static/images/cnode_icon.png'
}

// 生产环境
if(process.env.NODE_DEV === 'production') {
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }))
    path = __dirname + '/vue-cnode/dist/'
    publicPath = '/vue-cnode/dist/'
    htmlPlugin = Object.assign({}, htmlPlugin, {filename: '../index.html'})
    plugins.push(new webpack.optimize.UglifyJsPlugin({ // 压缩文件
        compress: {
            warnings: false // 删除警告
        }
    }));
} else {
    plugins.push(new OpenBrowserPlugin({
        url: 'http://localhost:8080'
    }))
}

plugins.push(new HtmlWebpackPlugin( htmlPlugin ))
plugins.push(new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}))


module.exports = {
    entry: {
        app: './src/index.js', // 入口文件
        vendor: [ 'vue', 'vue-router', 'vuex', 'axios', 'vue-template-compiler' ]
    },  
    output: {
        path,
        publicPath,
        filename: '[name].[chunkhash:8].js'
    },  
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /^node_modules$/,
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader'],
                            fallback: 'vue-style-loader'
                        }),
                        less: ExtractTextPlugin.extract({
                            use: ['css-loader', 'less-loader'],
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /^node_modules$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|svg|ttf|eot|png)($|\?)/i,
                exclude: /^node_modules$/,
                use: ['file-loader']
            }
        ]
    },
    plugins,
    resolve: {
        extensions: ['.js', '.vue'], //后缀名自动补全
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
}