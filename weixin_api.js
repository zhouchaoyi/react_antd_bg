/**
 * Created by Liya on 2016/5/27.
 */
const express = require('express');
const app = express();
const wechat = require('wechat');
const myConfig=require('./config')
var log4js = require('log4js');

//const config2= {
//    token: 'syytest',
//        appid: 'wx87c1f2fde915c974',
//        encodingAESKey: 'VDWilpbk9zJCt5FctfDwuPzACqhDKPNJU3VtTff7NXd'
//}





var logger =  log4js.getLogger('fileLog');
//console.log("123456<<<<<<<<<");
app.get("/wxtest2",function(req,res){
    logger.info('访问成功');
    res.send("222222222222222222")
})

app.use(express.query());
app.use('/wechat', wechat(myConfig.weChart, function (req, res, next) {

    logger.info('weChat Authentication  successful');

    console.log( 'get /wechat');

    // 微信输入信息都在req.weixin上
    var msg = req.weixin;
    if( msg.Content ==='test'){
        res.reply('test');
    }

    else {
        res.reply('!!!!欢迎测试 Wuxi Mobility.\n您的UserId='+ msg.FromUserName +'\n您发送的内容是='+msg.Content);
    }

}));


module.exports = app