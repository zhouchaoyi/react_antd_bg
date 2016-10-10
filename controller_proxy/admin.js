/**
 * Created by Liya on 2016/5/31.
 */
var mysql      = require('mysql');
var cfg = require('../config');
var http = require('http');
var connection=cfg.connection;
var httpProxy=require('./proxy');

var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出
import {Encrypt} from '../react/utils/index'
const  salt="abcdefghijklmnopqrstuvwxyz"
exports.login=function (req, res) {
    //console.log(httpProxy);
    httpProxy(req, res);

    // console.log(req.body);
    // req.body=JSON.stringify(req.body);
    // console.log(req.body);
    // var sreq = http.request({
    //     host: 'localhost', // 目标主机
    //     port: '8080',
    //     path: '/bgSys/userMgmt/login.do', // 目标路径
    //     method: req.method, // 请求方式
    // }, function(sres){
    //     sres.pipe(res);
    //     sres.on('end', function(){
    //         console.log('done');
    //     });
    // });
    
    // req.pipe(sreq);
    
}

exports.loginOut=function (req, res) {
        res.clearCookie('uid');
        res.json({});
}
exports.my=function (req, res) {
    let uid=req.body.uid
    connection=mysql.createConnection(connection.config)
    connection.connect()
    const temp=[]
    var sql="select *  from users where Id=\'"+uid +"\'"
    connection.query(sql,(err,rows)=>{
        if (err){
            logger.info("查找用户失败：",err)
            res.status('500').send({'message': '系统错误联系管理员'});
            return false;
        }
            rows.forEach(x=>{
                logger.info("查找用户信息为：",x)
                res.json({'user': x.Name, 'role': 'ADMIN', 'uid': x.Id});
            })

    })
    connection.end()


}