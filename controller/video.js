/**
 * Created by Liya on 2016/6/16.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;
const utils = require('../react/utils');

var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出

exports.getVideo=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from video  order by id desc';

    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(c=>{
            tempAccount.push(Object.assign({key:c.Id},c));
        })

        res.json(tempAccount)
    });
    connection.end();
}
exports.addVideo=(req,res)=>{
        const para=req.body.data;
        connection = mysql.createConnection(connection.config);
        connection.connect();

        logger.info("添加视频数据------",para);

        var  sql='insert into video(Name,Url,Cate) values(?,?,?)';
        connection.query(sql,[para.Name,para.Url,para.Cate],function(err, rows){
            if(err) {
                logger.info("视频添加失败:",err);
                res.json({result:0})

                return;
            }
            logger.info("视频添加成功");
            res.json({result:1,id:rows.insertId})
        });
        connection.end();

}
exports.delVideo=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='delete FROM video where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("视频删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("视频删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}
exports.editVideo=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("视频修改后的数据------",para);
    var  sql='update  video set Name=?,Url=?, Cate=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.Url,para.Cate],function(err, rows){
        if (err){
            logger.info("视频修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("视频修改成功 id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}