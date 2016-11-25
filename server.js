
require('babel-register')
const webpack = require('webpack');

const express = require('express');
const fs = require("fs");
const path = require('path');
var ueditor = require("ueditor");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const config = require('./webpack.config');
const myConfig=require('./config')
const httpProxy=require('./controller_proxy/proxy');

const isProduction = process.env.NODE_ENV === 'production';
const isDeveloping = !isProduction;

const app = express();


var log4js = require('./logHelper');
app.use(log4js.forUse());

exports.logger=function(name){
    var logger = log4js.getLogger(name);
    //console.log("dddddddddddd")
    logger.setLevel('INFO');
    return logger;
}


// Webpack developer
if (isDeveloping) {
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}

//  RESTful API
const publicPath = path.resolve(__dirname);
app.use(bodyParser.json({type: 'application/json'}))
app.use(cookieParser());
app.use(express.static(publicPath));


app.use("/ueditor/ueditor", ueditor(path.join(__dirname, ''), function(req, res, next) {

    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
        var imgname = req.ueditor.filename;
        var img_url = '/public/uploads/ueditor/';

        //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.ue_up(img_url);
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/public/uploads/ueditor/';
        // 客户端会列出 dir_url 目录下的所有图片
        res.ue_list(dir_url);
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');

    }
}));


//const port = isProduction ? (process.env.PORT || 80) : 3000;
const port = isProduction ? (process.env.PORT || 3000) : 3000;


app.set('view engine', 'ejs');

//app.use('/api/v1', apiRouter)
app.use('/api/v1', httpProxy)
//app.use('/', webRouter)

// this is necessary to handle URL correctly since client uses Browser History
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '', 'index.html'))
})


app.listen(port, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Server running on port ' + port);
});
