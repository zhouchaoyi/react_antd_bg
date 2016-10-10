var http = require('http');
var cfg = require('../config');

module.exports = function(req,res) {
    //console.log(req);
    req.body=JSON.stringify(req.body);
    var sreq = http.request({
        host: cfg.proxy.host, // 目标主机
        port: cfg.proxy.port,
        path: cfg.proxy.basePath+req.url+'.do', // 目标路径
        method: req.method // 请求方式
        ,headers: {
            'Accept': 'application/json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8'
        }
    }, function(sres){
        sres.pipe(res);
        // sres.on('data', function(chunk){
        //     console.log('data'+chunk);
        // });
        // sres.on('end', function(){
        //     console.log('done');
        // });
    });
    sreq.end(req.body);
};