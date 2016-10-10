/**
 * Created by Liya on 2016/5/24.
 */
var mysql      = require('mysql');
var cfg = require('../config')
// 下面使用 cfg.SiteName 配置内容
var connection=cfg.connection;

const utils = require('../react/utils');
var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出

exports.productCate = function (req, res, next) {

    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from category order by id desc';

    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            //  tempAccount.push(  {optionText:x.Name,categoryId:x.CategoryId})
            tempAccount.push(x)
        })
        res.json(tempAccount)
    });
    logger.info("获取产品分类")
    connection.end();
}
exports.addProductCate=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("产品类别------",para);
    var  sql='insert into Category(Name,Pic) values(?,?)';
    connection.query(sql,[para.Name,para.Pic],function(err, rows){
        if(err) {
            logger.info("产品类别添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("产品类别-添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}
exports.deleteProductCate=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM category where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("产品类别删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("产品类别删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}
exports.editProductCate=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("产品类别修改后的数据------",para);
    const  time=utils.getNowTime();
    var  sql='update  category set Name=?, Pic=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.Pic],function(err, rows){
        if (err){
            logger.info("产品类别修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("产品类别修改成功");
        res.json({result:1,id:id})
    });

    connection.end();
}
exports.series=(req,res)=>{

    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT p.* ,c.Name as Cate FROM series as p,category as c where p.CategoryId=c.Id ';
    if ( body.cateId!=undefined && body.cateId.toString().length>0) {
        sql+=' and p.CategoryId=\''+body.cateId+'\''

    }
    sql+=' order by id desc';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(function (c) {
            tempAccount.push({key:c.Id,id:c.Id,Cate:c.Cate,CategoryId:c.CategoryId,Name:c.Name,Pic:c.Pic});
        });
        res.json(tempAccount)
    });
    connection.end();


}
exports.getSeriesById=(req,res)=>{
    const id=req.body.Id;
    logger.info("产品系列的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * FROM series  where  ';
    sql+='Id=\''+id+'\''
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取产品系列内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();
}
exports.seriesDetail=(req,res)=>{
    const id=req.body.Id;
    logger.info("产品系列的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT p.* ,c.Name as Cate FROM series as p,category as c where p.CategoryId=c.Id ';
    sql+=' and  p.Id=\''+id+'\''
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取产品系列内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();

}
exports.editSeries=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("产品系列修改后的数据------",para);
    const  time=utils.getNowTime();
    var  sql='update  series set Name=?, CategoryId=?, Time=?,Pic=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.CategoryId,time,para.Pic],function(err, rows){
        if (err){
            logger.info("产品系列修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("产品系列修改成功");
        res.json({result:1,id:id})
    });

    connection.end();
}
exports.deleteSeries=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM series where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("产品系列删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("产品系列删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}
exports.addSeries=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("产品系列添加的数据------",para);
    const  time=utils.getNowTime();
    var  sql='insert into series(Name,CategoryId,Time,Pic) values(?,?,?,?)';
    connection.query(sql,[para.Name,para.CategoryId,time,para.Pic],function(err, rows){
        if(err) {
            logger.info("产品系列添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("产品系列添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}

exports.getProduct=(req,res)=>{
    const id=req.body.Id;
    logger.info("获取产品的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempData =[];
    var  sql='SELECT p.*,s.Name as SeriesName  FROM product as p,series as s where p.SeriesId=s.Id  ';
    sql+='and p.SeriesId=' +id;
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取产品内容失败;",err)
            return
        }
        rows.forEach(function (c) {
            tempData.push({key:c.Id,SeriesName:c.SeriesName,CategoryId:c.CategoryId,Name:c.Name});
        });
        res.json(tempData)
    });
    connection.end();
}
exports.delProduct=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM product where id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("产品删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("产品删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}

exports.addProduct=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("产品添加的数据------",para);
    var  sql='insert into product(Name,SeriesId,CategoryId) values(?,?,?)';
    connection.query(sql,[para.Name,para.SeriesId,para.CategoryId],function(err, rows){
        if(err) {
            logger.info("产品添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("产品添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}

exports.editProduct=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("产品修改后的数据------",para);
    var  sql='update  product set Name=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name],function(err, rows){
        if (err){
            logger.info("产品修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("产品修改成功");
        res.json({result:1,id:id})
    });

    connection.end();
}

exports.productDetail=(req,res)=>{
    const id=req.body.Id;
    logger.info("产品的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT p.*,s.Name as SeriesName ,c.`Name` as Cate FROM product as p,series as s, category as c where p.SeriesId=s.Id and p.CategoryId=c.Id ';
    sql+=' and  p.Id='+id
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取产品内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();
}