/**
 * Created by Liya on 2016/6/1.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;

var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出

import {Encrypt} from '../react/utils/index'
const  salt="abcdefghijklmnopqrstuvwxyz"
exports.getUsers=(req,res)=>{
    connection=mysql.createConnection(connection.config)
    connection.connect()
    const temp=[]
    var sql="select * from users"
    connection.query(sql,(err,rows)=>{
        if (err) return false;
        rows.forEach(function (x) {
            temp.push(Object.assign({key:x.Id},x) )
        })

        res.json(temp)
    })
    connection.end()
}
exports.delUser=(req,res)=>{
    const id=req.body.Id
    logger.info("需要删除的用户的id为：",id)
    connection=mysql.createConnection(connection.config)
    connection.connect()
    const temp=[]
    var sql="delete from users where Id="+id
    connection.query(sql,(err,rows)=>{
        if (err){
            res.json({result:0,id:id})
            return false;
        }
      
        res.json({result:1,id:id})
    })
    connection.end()
}
exports.addUser=(req,res)=>{
    const para=req.body.PostValue
    logger.info("接收到的数据为：",para)
    connection=mysql.createConnection(connection.config)
    connection.connect()
    const temp=[]
    var sql="insert into users(Name,Pwd) values(?,?)"
    connection.query(sql,[para.Name,Encrypt(para.Pwd,salt)],(err,rows)=>{
        if (err){
            logger.info("用户添加失败：",err)
            res.json({result:0,})
            return false;
        }
        logger.info("用户添加成功：",rows.insertId)
        res.json({result:1,id:rows.insertId})
    })
    connection.end()
}

exports.existUser=(req,res)=>{
    const name=req.body.Name
    logger.info("需要查询的匹配的用户名为：",name)
    connection=mysql.createConnection(connection.config)
    connection.connect()
    const temp=[]
    var sql="select count(*) as sum from users where Name= \'"+name+"\'"
    connection.query(sql,(err,rows)=>{
        if (err){
            logger.info("查询失败：",err)
            res.json({result:0,})
            return false;
        }
        logger.info("查询成功：存在用户：",rows[0].sum)
        res.json({result:1,count:rows[0].sum})
    })
    connection.end()
}
exports.editUser=(req,res)=>{
    const id=req.body.Id
    const  para=req.body.PostValue
    logger.info("需要修改的用户id为：",id,"------修改值为：",para)
    connection=mysql.createConnection(connection.config)
    connection.connect()
    let tempPara=""
    var sql="update users set "
    if(para.Pwd){
        sql+='Pwd=?'
        tempPara=Encrypt(para.Pwd,salt)
    }else if(para.Name){
        sql+=" Name=?"
        tempPara=para.Name
    }
    sql+=" where Id=\'"+id+"\'"
    connection.query(sql,[tempPara],(err,rows)=>{
        if (err){
            logger.info("修改用户失败：",err)
            res.json({result:0,id:id})
            return false;
        }
        logger.info("修改用户成功")
        res.json({result:1,id:id})
    })
    connection.end()
}