/**
 * Created by Liya on 2016/5/24.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;
const utils = require('../react/utils');
var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出



exports.activity=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from activity  order by Year desc,Date desc';

    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(c=>{
            tempAccount.push({key:c.Id,Year:c.Year,Date:c.Date,Name:c.Name,Address:c.Address,Content:c.Content});
        })

        res.json(tempAccount)
    });
    connection.end();

}
exports.addActivity=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("添加活动的数据------",para);
    var  sql='insert into activity(Name,Year,Date,Address,Content) values(?,?,?,?,?)';
    connection.query(sql,[para.Name,para.Year,para.Date,para.Address,para.Content],function(err, rows){
        if(err) {
            logger.info("添加活动失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("添加活动成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}
exports.delActivity=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='delete FROM activity where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("活动删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("活动删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}
exports.activityDetail=(req,res)=>{
    const id=req.body.Id;
    logger.info("获取活动的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from activity where Id=\' '+id+'\'';
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取活动内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();
}
exports.editActivity=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("活动修改后的数据------",para);
    const  time=utils.getNowTime();
    var  sql='update  activity set Name=?, Year=? ,Date=?,Address=?,Content=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.Year,para.Date,para.Address,para.Content],function(err, rows){
        if (err){
            logger.info("活动修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("活动修改成功 id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}
