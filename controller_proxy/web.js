var express = require('express')
var mysql      = require('mysql');
var cfg = require('../config')
var connection=cfg.connection;

var app=express();
//var request = require('request');
const utils = require('../react/utils');

var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出

exports.product_cate=(req,res)=>{
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var  sql='SELECT * from category ';

    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempAccount.push(x)
        })

        res.render('product_cate', { layout: 'layout.ejs',title: 'SSD微信公众号-产品信息',result:tempAccount })
    });
    connection.end();
    logger.info("-------------------web product_cate-------------------")
}

exports.product_series=(req,res)=>{

    const  id=req.query.cateId;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    const tempCate =[];
    const tempcount=[];
    var sqlCate='SELECT * from category ';
    connection.query(sqlCate, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempCate.push(x)
        })
    });

    var sqlProductCount='select SeriesId,count(*) as Count from product where CategoryId=\''+id+'\' group by SeriesId'
    connection.query(sqlProductCount,(err, rows)=>{
        if(err) return false
        rows.map(x=>{
            tempcount.push(x)
        })
    })

    var  sql='SELECT * from series  where CategoryId=\' '+id+'\'';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            let count=0;
            tempcount.map(c=>{
                if(x.Id==c.SeriesId){
                    count=c.Count;
                }
            })
            tempAccount.push(Object.assign(x,{Count:count}))
        })
        res.render('product_series', { layout: 'layout.ejs',title: 'SSD微信公众号-产品信息',result:tempAccount,currentCateId:id,cate:tempCate })
    });
    connection.end();

}

exports.product=(req,res)=>{
    const  id=req.query.seriesId;
    const categoryId=req.query.categoryId;

    const para={
        currentCateId:categoryId,
        currentSeriesId:id
    }

    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempSeries=[]
    const tempProduct=[]
    var  sqlSeries='SELECT * from series  where CategoryId=\' '+categoryId+'\'';
    connection.query(sqlSeries, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempSeries.push(x)
        })

    });

    var sqlProduct='select * from product where seriesId=\''+id+'\'';
    connection.query(sqlProduct,(err,rows)=>{
        if(err) return false
        rows.map(x=>{
            tempProduct.push(x)
        })
        res.render('product', { layout: 'layout.ejs',title: 'SSD微信公众号-产品信息',result:tempProduct,para:para,series:tempSeries})
    })


    connection.end();



}

exports.product_detail=(req,res)=>{
    const  id=req.query.id;
    const para={
        currentCateId:"",
        currentSeriesId:""
    }
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var sqlProduct='select * from product where Id=\''+id+'\'';
    connection.query(sqlProduct,(err,rows)=>{
        if(err) return false
        para.currentCateId=rows[0].CategoryId
        para.currentSeriesId=rows[0].SeriesId
        res.render('product_detail', { layout: 'layout.ejs',title: 'SSD微信公众号-产品信息',para:para})
    })

    connection.end()
}

exports.solution=(req,res)=>{

    const tempIndustry=[]
    const tempSolution=[]
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var sqlIndustry='select * from sol_industry ';
    connection.query(sqlIndustry,(err,rows)=>{
        if(err) return false
        rows.map(x=>{
            tempIndustry.push(x)
        })

    })

    var sqlSolution="select * from solution"
    connection.query(sqlSolution,(err,rows)=>{
        if(err) return false
        rows.map(x=>{
            tempSolution.push(x)
        })
        res.render('solution',{title:'test',industryItem:tempIndustry,solutionItem:tempSolution})

    })
    connection.end()


}
exports.solution_detail=(req,res)=>{
    const  id=req.query.id;
    console.log(id)
    connection = mysql.createConnection(connection.config);
    connection.connect();


    var sql="select * from solution where Id=\'"+id+"\'"
    logger.info("获取解决方案的id:",id)
    connection.query(sql,(err,rows)=>{
        if(err) return false
        const time=rows[0].Time
        res.render('solution_detail',{result:rows[0],time:utils.timeStampToDate(time)})

    })
    connection.end()

}

exports.whitePaper=(req,res)=>{
    logger.info("访问白皮书 页面")
    const temp=[]
    connection = mysql.createConnection(connection.config);
    connection.connect();
    var sql='select * from whitePage order by id desc ';
    connection.query(sql,(err,rows)=>{
        logger.info("rows",rows)
        rows.map(x=>{
            temp.push(x)
        })
        res.render("whitePaper",{result:temp})
    })
    connection.end()
}
exports.pageOnline=(req,res)=>{
    res.render("pageOnline",{pdfUrl:"./../public/front/pdfjs/test.pdf"})
}
exports.data_picCate=(req,res)=>{
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var sqlCate='SELECT * from category ';
    connection.query(sqlCate, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempAccount.push(x)
        })

        res.render("data_picCate",{result:tempAccount})
    });
    connection.end()
}
exports.data_poster=(req,res)=>{
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var sql='SELECT * from material_poster ';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempAccount.push(x)
        })

        res.render("data_poster",{result:tempAccount})
    });
    connection.end()
}
exports.data_poster_det=(req,res)=>{
    const  id=req.query.id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var sql='SELECT * from material_poster where Id=\' '+id+'\'';
    connection.query(sql, function(err, rows){
        if (err) return false;


        res.render("data_poster_det",{result:rows[0]})
    });
    connection.end()
}

exports.data_page=(req,res)=>{
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var sql='SELECT * from material_page ';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempAccount.push(x)
        })

        res.render("data_page",{result:tempAccount})
    });
    connection.end()
}
exports.data_page_det=(req,res)=>{
    const  id=req.query.id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempAccount =[];
    var sql='SELECT * from material_page where Id=\' '+id+'\'';
    connection.query(sql, function(err, rows){
        if (err) return false;


        res.render("data_page_det",{result:rows[0]})
    });
    connection.end()
}

exports.pics=(req,res)=>{
    const categoryId=req.query.categoryId;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const tempSeries=[]

    var  sqlSeries='SELECT * from series  where CategoryId=\' '+categoryId+'\'';
    connection.query(sqlSeries, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            tempSeries.push(x)
        })

    });
    const  _picItems=[];
    var  sqlPics='SELECT * from material_pic  where CategoryId=\' '+categoryId+'\'';
    connection.query(sqlPics, function(err, rows){
        if (err) return false;


        tempSeries.forEach((series,index)=>{
            _picItems[index]=Object.assign({seriesName:series.Name,pic:series.Pic})
            rows.map(pic=>{
                if(series.Id==pic.SeriesId){
                    _picItems[index]=Object.assign({seriesName:series.Name,pic:series.Pic},pic)
                }
            })
        })

        res.render("pics",{seriesItems:tempSeries,picItems:_picItems})
    });
    connection.end()
}


exports.activity=(req,res)=>{
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const temp=[]
    var  sql='SELECT * from activity order by Year desc,Date desc';
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            temp.push(x)
        })
        logger.info("查询到的活动",temp)
        res.render("activity",{items:temp})
    });
    connection.end()
}
exports.activity_detail=(req,res)=>{
    const id=req.query.id;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const temp=[]
    var  sql='SELECT * from activity where Id=\''+id+'\'';
    connection.query(sql, function(err, rows){
        if (err) return false;
        logger.info("活动详情查询成功")
        res.render('activity_detail',{result:rows[0]})
    });
    connection.end()
}

exports.faq=(req,res)=>{
    console.log("请求数据",req.query)
    const offset = parseInt(req.query.offset, 10) || 1;
    const num=parseInt(req.query.num, 10) || 10
    var limit = offset + ','+num;
    connection = mysql.createConnection(connection.config);
    connection.connect();
    const temp=[]
    var  sql='SELECT * from material_poster limit '+limit;
    console.log(sql)
    connection.query(sql, function(err, rows){
        if (err) return false;
        rows.map(x=>{
            //console.log(x.Id,x.Name)
        })

        console.log(req.query.offset)
        if(req.query.offset==undefined){
            console.log("执行了")

            res.render("faq",{result:rows})
        }else{
            res.json({result:rows})
        }




    });
    connection.end()

}
