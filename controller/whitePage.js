/**
 * Created by Liya on 2016/5/24.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;
const utils = require('../react/utils');

var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出


exports.whitePage=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from whitePage  order by id desc';

    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(c=>{
            tempAccount.push({key:c.Id,Time:c.Time.Format("yyyy-MM-dd hh:mm:ss"),Name:c.Name,Url:c.Url});
        })

        res.json(tempAccount)
    });
    connection.end();

}

exports.deleteWhitePage=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='delete FROM whitePage where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("白皮书删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("白皮书删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();

}
exports.editWhitePage=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("白皮书修改后的数据------",para);
    const  time=utils.getNowTime();
    var  sql='update  whitePage set Name=?,Url=?, Time=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.Url,time],function(err, rows){
        if (err){
            logger.info("白皮书修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("白皮书修改成功 id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}
exports.addWhitePage=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("添加白皮书数据------",para);
    const  time=utils.getNowTime();
    var  sql='insert into whitePage(Name,Url,Time) values(?,?,?)';
    connection.query(sql,[para.Name,para.Url,time],function(err, rows){
        if(err) {
            logger.info("白皮书添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("白皮书添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}