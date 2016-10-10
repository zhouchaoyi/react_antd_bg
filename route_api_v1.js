var express = require('express')
var app = express.Router()

var product = require('./controller/product')
var solution=require('./controller/solution')
var whitePage=require('./controller/whitePage')
var activity=require('./controller/activity')
var material=require('./controller/material')
var admin=require("./controller_proxy/admin")
var manage=require('./controller/manage')
var video=require('./controller/video')

var weChat=require('./controller/weChartApi')
const config=require('./config')



//app.post('/login', admin.login);
app.post('/userMgmt/login', admin.login);
app.put("/loginOut",admin.loginOut)
app.post('/my', admin.my);

app.post('/menu', function (req, res) {

    res.json({
        menus:config.menus
    });
});


var multer  = require('multer')

//获取产品分类

app.post('/productCate',product.productCate)
app.post("/addProductCate",product.addProductCate)
app.post("/deleteProductCate",product.deleteProductCate)
app.post('/editProductCate',product.editProductCate)

//获取产品系列
app.post('/series',product.series)
app.post('/getSeriesById',product.getSeriesById)
app.post('/seriesDetail',product.seriesDetail)
app.post('/editSeries',product.editSeries)
app.post('/deleteSeries',product.deleteSeries)
app.post('/addSeries',product.addSeries)
app.post('/getProduct',product.getProduct)
app.post('/delProduct',product.delProduct)
app.post('/addProduct',product.addProduct)
app.post('/editProduct',product.editProduct)
app.post('/productDetail',product.productDetail)

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/product/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+file.mimetype.replace("image/","."))
    }
})

var uploadProduct = multer({ storage: storage }); // 初始化设置
app.post('/productUpload',uploadProduct.single('xfile'),solution.upload)

//解决方案
var storageSolution = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/solution/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+file.mimetype.replace("image/","."))
    }
})

var uploadSolution = multer({ storage: storageSolution }); // 初始化设置

/*行业分类*/
app.post('/industryCate',solution.industryCate)
app.post('/deleteSolutionCate',solution.deleteSolutionCate)
app.post('/addSolutionCate',solution.addSolutionCate)
app.post('/editSolutionCate',solution.editSolutionCate)
app.post('/solutionUpload',uploadSolution.single('xfile'),solution.upload)

app.post('/solution',solution.solution)
app.post('/deleteSolution',solution.deleteSolution)
app.post('/addSolution',solution.addSolution)
app.post('/editSolution',solution.editSolution)
app.post('/solutionDetail',solution.solutionDetail)//根据id获取解决方案






app.post('/whitePage',whitePage.whitePage)
app.post('/deleteWhitePage',whitePage.deleteWhitePage)
app.post('/editWhitePage',whitePage.editWhitePage)
app.post('/addWhitePage',whitePage.addWhitePage)
var storageWhitePage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/whitePage/')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now()+"-"+file.originalname)
    }
})

var uploadPage = multer({ storage: storageWhitePage }); // 初始化设置
app.post('/whitePageUpload',uploadPage.single('whiteFile'),solution.upload)

//活动管理
app.post('/activity',activity.activity)
app.post('/addActivity',activity.addActivity)
app.post('/delActivity',activity.delActivity)
app.post('/activityDetail',activity.activityDetail)
app.post('/editActivity',activity.editActivity)

//资料-图片

app.post('/getPic',material.getPic)

app.post('/deletePicSerise',material.deletePicSerise)

app.post("/picDetail",material.picDetail)

app.post('/editPic',material.editPic)
app.post('/addPic',material.addPic)

//资料-宣传海报
app.post("/getPoster",material.getPoster)
app.post("/deletePoster",material.deletePoster)
app.post("/posterDetail",material.posterDetail)
app.post("/editPoster",material.editPoster)
app.post('/addPoster',material.addPoster)
//资料-宣传单页
app.post("/getPage",material.getPage)
app.post("/deletePage",material.deletePage)
app.post("/pageDetail",material.pageDetail)
app.post("/editPage",material.editPage)
app.post("/addPage",material.addPage)

var storagePic = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/pic/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+file.mimetype.replace("image/","."))
    }
})

var uploadPic = multer({ storage: storagePic }); // 初始化设置
app.post('/picUpload',uploadPic.single('xfile'),solution.upload)

var storagePoster = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/poster/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+file.mimetype.replace("image/","."))
    }
})

var uploadPic = multer({ storage: storagePoster }); // 初始化设置
app.post('/posterUpload',uploadPic.single('xfile'),solution.upload)

var storagePage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/page/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+file.mimetype.replace("image/","."))
    }
})

var uploadPage = multer({ storage: storagePage }); // 初始化设置
app.post('/pageUpload',uploadPage.single('xfile'),solution.upload)

app.post("/getUser",manage.getUsers)
app.post("/delUser",manage.delUser)
app.post("/addUser",manage.addUser)
app.post("/existUser",manage.existUser)
app.post("/editUser",manage.editUser)


app.get("/getMenu",weChat.getMenu)
app.post("/createMenu",weChat.createMenu)
app.post("/getFollowers",weChat.getFollowers)
app.post("/updateRemark",weChat.updateRemark)
app.post("/sendText",weChat.sendText)

app.get('/getVideo',video.getVideo)
app.post("/addVideo",video.addVideo)
app.post("/delVideo",video.delVideo)
app.post("/editVideo",video.editVideo)



Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}





module.exports = app
