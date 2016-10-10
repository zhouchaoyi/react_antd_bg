/**
 * Created by Liya on 2016/6/7.
 */
var WechatAPI = require('wechat-api');
var log4js = require('log4js');
var logger =  log4js.getLogger('fileLog'); // 此处的日志，会在 console 和文件中都输出
const myConfig=require('../config')
const config=myConfig.weChart



var api = new WechatAPI(config.appid, config.appsecret);

exports.getMenu=(req,res)=>{
   /* api.getMenu(function (err, menu) {

        console.log(menu);
        res.send('所有菜单=><br>'+JSON.stringify(menu))

    });*/

    const menu=[{
        "button":[
            {
                "type":"view",
                "name":"产品相关",
                "key":"V1001_PRODUCT",
                url:'www.baidu.com'
            },
            {
                "name":"信息活动",
                "type":"click",
                "key":"V1002_ACTIVITY",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"近期市场活动",
                        "url":"http://www.soso.com/",
                        "key":"V1002_ACTIVITY_01"
                    },
                    {
                        "type":"view",
                        "name":"往期文章回顾",
                        "key":"V1002_ACTIVITY_02"
                    }]
            },
            {
                "name":"在线服务",
                "type":"click",
                "key":'v100',
                "key":"V1003_SERVICE",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"在线社区",
                        "url":"http://www.soso.com/",
                        "key":"V1003_SERVICE_01"
                    },
                    {
                        "type":"view",
                        "name":"在线商城",
                        "key":"V1003_SERVICE_02",
                    }]
            }
        ]
    }]
    logger.info("获取的微信菜单为：",JSON.stringify(menu ) )
    res.json(menu)
}
exports.createMenu=(req,res)=>{
    const menu=req.body.PostValue;
    /*api.createMenu(menu, function(err,success){
        if(err){
        logger.info("创建菜单失败：",err)
            res.json({result:0})
            return false
        }
        //success 是成功后返回的结果{"errcode":0,"errmsg":"ok"}
        res.json({
            result:1,errcode:success.errcode,errmsg:success.errmsg
        })
    })*/
    logger.info("创建菜单成功",menu)
    res.json({
        result:1
    })

}

exports.getFollowers=(req,res)=>{

    /*api.getFollowers((err,success)=>{
        if(err){
            logger.info("获取粉丝：",err)
            res.json({result:0})
            return false
        }
        //success 是成功后返回的结果{"errcode":0,"errmsg":"ok"}

         api.batchGetUser(success.data.openid,(err,success)=>{
        //获取用户的基本信息
          })


    });*/
    var success={
        "user_info_list": [{
            "subscribe": 1,
            "openid": "otvxTs4dckWG7imySrJd6jSi0CWE",
            "nickname": "iWithery",
            "sex": 1,
            "language": "zh_CN",
            "city": "无锡",
            "province": "江苏",
            "country": "中国",
            "headimgurl": "http://wx.qlogo.cn/mmopen/xbIQx1GRqdvyqkMMhEaGOX802l1CyqMJNgUzKP8MeAeHFicRDSnZH7FY4XB7p8XHXIf6uJA2SCunTPicGKezDC4saKISzRj3nz/0",
            "subscribe_time": 1465288587,
            "unionid": "oR5GjjgEhCMJFyzaVZdrxZ2zRRF4",
            "remark": "",
            "groupid": 0
        }, {
            "subscribe": 0,
            "openid": "otvxTs_JZ6SEiP0imdhpi50fuSZg",
            "unionid": "oR5GjjjrbqBZbrnPwwmSxFukE41U",
            "nickname": "张三",
            "subscribe_time": 1465290534,
        }
        ]
    }

    res.json({result:1,items:success.user_info_list})



}
exports.updateRemark=(req,res)=>{
    const openid=req.body.Openid
    const remark=req.body.Remark
    //api.updateRemark(openid, remark, (err,success)=>{
    //    if(err){
    //        logger.info("修改备注失败")
    //        res.json({result:0})
    //    }
    //});
    logger.info("修改备注成功")
    res.json({result:1})
}
exports.sendText=(req,res)=>{
    const data=req.body
    console.log(data)
}

