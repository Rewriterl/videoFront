let proxyObj = {};
proxyObj['/'] = {
    ws: false,       // websocket
    target: 'http://127.0.0.1:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''     // 表示不修改拦截地址
    }
};
module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}
// 生产环境下前后端分离会出现跨域问题（伪），所以在前端通过请求转发处理跨域