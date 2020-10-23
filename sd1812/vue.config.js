module.exports = {
    publicPath: "./",
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        host: "127.0.0.1",
        proxy: {
            "/api": {
                target: "https://m.sd.10086.cn",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": "",
                },
            },
        },
    },
    css: {
        modules: false,
        //这个选项是： 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
        //在开发环境下是false,因为和css热重载不兼容，而在生产环境下是true，因为可读性比较好也便于维护，
        sourceMap: false,
        //向 CSS 相关的 loader 传递选项。
        loaderOptions: {
            // 这里的选项会传递给 css-loader
            css: {},
            postcss: {
                plugins: [
                    //px换算成rem
                    require("./node_modules/postcss-pxtorem")({
                        rootValue: 75, // 换算的基数
                        selectorBlackList: ["van-"], // 忽略转换正则匹配项
                        propList: ["*"],
                        unitPrecision: 4,
                        minPixelValue: 2,
                    }),
                ],
            },
        },
    },
};
