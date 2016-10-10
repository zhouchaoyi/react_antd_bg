/**
 * Created by Liya on 2016/5/24.
 */
var express = require('express')
var app = express.Router()

var web=require("./controller/web")



app.get('/index', function(req, res) {
    res.render('index', { layout: 'layout.ejs',title: 'The index page! test' })
});




app.get('/web/product_cate',web.product_cate)
app.get('/web/product_series',web.product_series)
app.get('/web/product',web.product);
app.get('/web/product_detail',web.product_detail)

app.get('/web/solution',web.solution)
app.get('/web/solution_detail',web.solution_detail)

app.get('/web/whitePaper',web.whitePaper)
app.get("/web/pageOnline",web.pageOnline)
app.get('/web/support',(req,res)=>{
    res.render("support",{})
})
app.get("/web/video_cate",(req,res)=>{
    res.render("video_cate",{})
})
app.get("/web/video",(req,res)=>{
    res.render("video",{})
})
app.get("/web/data",(req,res)=>{
    res.render("data",{})
})
app.get("/web/data_poster",web.data_poster)
app.get("/web/data_poster_det",web.data_poster_det)
app.get("/web/data_picCate",web.data_picCate)
app.get("/web/pics",web.pics)
app.get("/web/data_page",web.data_page)
app.get("/web/data_page_det",web.data_page_det)
app.get("/web/activity",web.activity)
app.get("/web/activity_detail",web.activity_detail)



app.get("/web/faq",web.faq)

app.get("/web/tco",(req,res)=>{
    res.render("tco/tco",{})
})
app.get("/web/index_enus.xml",(req,res)=>{
    res.render("tco/index_enus",{})
})
app.get("/web/GroupedColumnChart.xml",(req,res)=>{
    res.render("tco/GroupedColumnChart",{})
})
module.exports = app
