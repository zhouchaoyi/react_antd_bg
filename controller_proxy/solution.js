/**
 * Created by Liya on 2016/5/24.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;

const utils = require('../react/utils');
var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出



exports.industryCate=(req,res)=>{
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from sol_industry order by id desc';

    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempAccount.push( x)
        })

        res.json(tempAccount)
    });
    connection.end();
}
exports.deleteSolutionCate=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='delete FROM sol_industry where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("行业分类删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("行业分类删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });
    connection.end();
}
exports.addSolutionCate=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("行业类别------",para);
    const  time=utils.getNowTime();
    var  sql='insert into sol_industry(Name) values(?)';
    connection.query(sql,[para.Name],function(err, rows){
        if(err) {
            logger.info("行业添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("行业添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}
exports.deleteSolutionCate=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM sol_industry where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("行业删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("行业删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}
exports.editSolutionCate=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("行业修改后的数据------",para);
    var  sql='update  sol_industry set Name=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name],function(err, rows){
        if (err){
            logger.info("行业修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("行业修改成功");
        res.json({result:1,id:id})
    });

    connection.end();
}



exports.solution=(req,res)=>{

    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT s.* ,i.Name as Industry FROM solution as s,sol_industry as i where s.IndustryId=i.Id ';

    if (  body.cateId!=undefined && body.cateId.toString().length>0) {
        sql+=' and s.IndustryId=\''+body.cateId+'\''
    }

    sql+=' order by id desc';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(c=>{
            tempAccount.push({key:c.Id,Industry:c.Industry,IndustryId:c.IndustryId,Name:c.Name,Publisher:c.Publisher,Time:c.Time.Format("yyyy-MM-dd hh:mm:ss")});
        })


        res.json(tempAccount)
    });
    connection.end();

}
exports.deleteSolution=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='delete FROM solution where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("方案删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("方案删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });
    connection.end();
}
exports.addSolution=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("产品解决方案的数据------",para);
    const  time=utils.getNowTime();
    var  sql='insert into solution(Name,IndustryId,Publisher,Time,Intro,Text,Url) values(?,?,?,?,?,?,?)';
    connection.query(sql,[para.Name,para.IndustryId,para.Publisher,time,para.Intro,para.Text,para.Url],function(err, rows){
        if(err) {
            logger.info("解决方案失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("解决方案添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}
exports.editSolution=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("解决方案修改后的数据------",para);
    const  time=utils.getNowTime();
    var  sql='update  solution set Name=?, IndustryId=?, Publisher=?,Intro=?,Text=?, Time=?,Url=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.IndustryId,para.Publisher,para.Intro,para.Text,time,para.Url],function(err, rows){
        if (err){
            logger.info("解决方案修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("解决方案修改成功id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}

exports.solutionDetail=(req,res)=>{

    const id=req.body.Id;
    logger.info("获取解决方案的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT s.* ,i.Name as Industry FROM solution as s,sol_industry as i where s.IndustryId=i.Id ';
    sql+=' and s.Id=\''+id+'\''
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取解决方案内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();


}
exports.upload=function(req,res){
    var timestamp = Date.parse(new Date());
    var random=Math.random()+1
    res.json({
        uid: -timestamp+"/"+random.toFixed(3),      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: req.file.originalname ,  // 文件名
        path:req.file.path,
        status: 'done',  // 状态有：uploading done error removed
        response: '{"status": "success"}',  // 服务端响应内容
    });

}