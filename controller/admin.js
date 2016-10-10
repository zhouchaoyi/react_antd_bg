/**
 * Created by Liya on 2016/5/31.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;

var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出
import {Encrypt} from '../react/utils/index'
const  salt="abcdefghijklmnopqrstuvwxyz"
exports.login=function (req, res) {

    const credentials = req.body;
    if(req.cookies.uid){
        console.log("再次登陆",req.cookies)
        res.json({'user': credentials.user, 'role': 'ADMIN', 'uid': 1});
    }else{
        console.log("未登录")

        connection=mysql.createConnection(connection.config)
        connection.connect()
        const temp=[]
        var sql="select *  from users where Name=\'"+credentials.user +"\'"
        connection.query(sql,(err,rows)=>{
            if (err){
                logger.info("查找用户失败：",err)
                res.status('500').send({'message': '系统错误联系管理员'});
                return false;
            }

            logger.info("验证吻合用户："+rows.length)
            if(rows.length>0){
                rows.forEach(x=>{
                    if(Encrypt(credentials.password,salt)==x.Pwd){
                        /*salt加密*/
                        var en_uid=Encrypt(x.Id,"salt")
                        res.cookie('uid', x.Id, {maxAge: 60*60 * 1000});//设置过期时间为60分钟
                        res.json({'user': credentials.user, 'role': 'ADMIN', 'uid': x.Id});
                    }else{
                        res.status('500').send({'message': 'Invalid user/password'});
                    }
                })


            }else{
                res.status('500').send({'message': 'Invalid user/password'});
            }
        })
        connection.end()




    }



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