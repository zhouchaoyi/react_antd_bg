/**
 * Created by Liya on 2016/5/24.
 */
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;
const utils = require('../react/utils');
var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出

exports.getPic=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    const tempCate=[]
    var sqlCate="select * from category"
    connection.query(sqlCate,function(err,rows){
        if (err) return false;
        rows.forEach(function (x) {
            tempCate.push(x)
        })
    })


    var  sql='SELECT p.* ,s.Name as Series FROM material_pic as p,series as s where p.SeriesId=s.Id ';

    sql+=' order by id desc';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(function (c) {
            tempCate.forEach(cate=>{
                if(cate.Id==c.CategoryId){
                    tempAccount.push(Object.assign( {key:c.Id,Cate:cate.Name},c ));
                }
            })

        });
        res.json(tempAccount)
    });



    connection.end();


}
exports.deletePicSerise=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM material_pic where Id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("图片系列删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("图片系列删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}

exports.picDetail=(req,res)=>{
    const id=req.body.Id;
    logger.info("获取图片的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const cateItem=[]
    const  serItem=[]
    var sqlcate="select * from category";
    connection.query(sqlcate,function(err,rows){
        if(err) return
        rows.map(x=>{cateItem.push(x)})
    })
    var sqlser="select * from series";
    connection.query(sqlser,function(err,rows){
        if(err) return
        rows.map(x=>{serItem.push(x)})
    })

    var  sql='SELECT *  FROM material_pic where Id=\''+id+'\'';
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取图片内容失败;",err)
            return
        }
        let SeriesName="",Cate=""
        cateItem.forEach(x=>{if(x.Id==rows[0].CategoryId){Cate=x.Name}})
        serItem.forEach(x=>{if(x.Id==rows[0].SeriesId){SeriesName=x.Name}})

        res.json( Object.assign(rows[0],{Cate:Cate,SeriesName:SeriesName}))
    });
    connection.end();
}
exports.editPic=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("图片修改后的数据------",para);
    var  sql='update  material_pic set Name=?,CategoryId=?,SeriesId=?,Url=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.CategoryId,para.SeriesId,para.Url],function(err, rows){
        if (err){
            logger.info("图片修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("图片修改成功 id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}

exports.addPic=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("图片添加的数据------",para);
    const  time=utils.getNowTime();
    var  sql="insert into material_pic(Name,CategoryId,SeriesId,Url,Time) values(?,?,?,?,?)";
    connection.query(sql,[para.Name,para.CategoryId,para.SeriesId,para.Url,time],function(err, rows){
        if(err) {
            logger.info("图片添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("图片添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}
exports.getPoster=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from material_poster ';

    sql+=' order by id desc';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(function (c) {
            tempAccount.push(Object.assign( {key:c.Id},c ));


        });
        res.json(tempAccount)
    });
    connection.end();
}

exports.deletePoster=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM material_poster where Id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("海报删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("海报删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}
exports.posterDetail=(req,res)=>{
    const id=req.body.Id;
    logger.info("获取海报的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='select * FROM material_poster where Id=\''+id+'\'';
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取海报内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();
}
exports.editPoster=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("海报修改后的数据------",para);
    var  sql='update  material_poster set Name=?,Series=?,Url=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.Series,para.Url],function(err, rows){
        if (err){
            logger.info("海报修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("海报修改成功 id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}
exports.addPoster=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("海报添加的数据------",para);
    var  sql="insert into material_poster(Name,Series,Url) values(?,?,?)";
    connection.query(sql,[para.Name,para.Series,para.Url],function(err, rows){
        if(err) {
            logger.info("海报添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("海报添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}

exports.getPage=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from material_page ';

    sql+=' order by id desc';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.forEach(function (c) {
            tempAccount.push(Object.assign( {key:c.Id},c ));


        });
        res.json(tempAccount)
    });
    connection.end();
}
exports.deletePage=(req,res)=>{
    const body=req.body;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='delete FROM material_page where Id=\''+body.Id+'\'';
    connection.query(sql, function(err, rows){
        if(err) {
            logger.info("单页删除失败:",err);
            res.json({result:0,id:body.Id})
            return;
        }
        logger.info("单页删除成功----id：",body.Id)
        res.json({result:1,id:body.Id})
    });

    connection.end();
}

exports.pageDetail=(req,res)=>{
    const id=req.body.Id;
    logger.info("获取单页的id:",id)
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var  sql='select * FROM material_page where Id=\''+id+'\'';
    connection.query(sql, function(err, rows){
        if (err){
            logger.info("获取单页内容失败;",err)
            return
        }
        res.json(rows)
    });
    connection.end();
}
exports.editPage=(req,res)=>{
    const para=req.body.PostValue;
    const id=req.body.Id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    logger.info("单页修改后的数据------",para);
    var  sql='update  material_page set Name=?,Url=? where Id=\''+id+'\'';
    connection.query(sql,[para.Name,para.Url],function(err, rows){
        if (err){
            logger.info("单页修改失败:",err);
            res.json({result:0,id:id})
            return ;
        }
        logger.info("单页修改成功 id:",id);
        res.json({result:1,id:id})
    });

    connection.end();
}
exports.addPage=(req,res)=>{
    const para=req.body.data;
    connection = mysql.createConnection(connection.config);
    connection.connect();

    logger.info("单页添加的数据------",para);
    var  sql="insert into material_page(Name,Url) values(?,?)";
    connection.query(sql,[para.Name,para.Url],function(err, rows){
        if(err) {
            logger.info("单页添加失败:",err);
            res.json({result:0})

            return;
        }
        logger.info("单页添加成功");
        res.json({result:1,id:rows.insertId})
    });
    connection.end();
}