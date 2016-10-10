var mysql      = require('mysql');
module.exports = {
    SiteName : '这是node网站系统',
    connection : mysql.createConnection({
        host     : 'localhost',
        database : 'intelssd',
        user     : 'root',
        password : 'root'
    }),
    //connection : mysql.createConnection({
    //    host     : 'intelwechat.chinacloudapp.cn',
    //    database : 'intelssd',
    //    user     : 'intel',
    //    password : '123456Aa'
    //}),
    weChart: {
        token: 'syytest',
        appid: 'wx87c1f2fde915c974',
        encodingAESKey: 'VDWilpbk9zJCt5FctfDwuPzACqhDKPNJU3VtTff7NXd'
    },
    productApi:{
        url:'http://odata.intel.com/API/v1_0/Products/',
        entityName:{
            SeriesSet:"SeriesSet",
            SSDs:"SSDs"
        },
        api_key:'4454435037D04F86A64B3EEEF2006EC9'
    },

    proxy:{
        host: "localhost",
        port: '8080',
        basePath: "/bgSys"
    },

    menus: [
        //{
        //    key: 1,
        //    name: '微信平台',
        //    icon: 'user',
        //    child: [
        //        {
        //            name: '文章推送',
        //            link: '/article',
        //            key: 101
        //        },
        //        {
        //            name: '微信消息',
        //            link: '/msg',
        //            key: 102
        //        },
        //        //{
        //        //    name: '自动回复',
        //        //    link:'/reply',
        //        //    key: 103
        //        //},
        //        {
        //            name: '微信粉丝',
        //            link:'/follower',
        //            key: 104
        //        },
        //        {
        //            name: '微信菜单',
        //            link:'/menu',
        //            key: 105
        //        }
        //    ]
        //},
        {
            key: 2,
            name: '内容管理',
            icon: 'laptop',
            child: [
                {
                    name: '产品管理',
                    link:'/product',
                    key: 201
                },
                {
                    name: '资料管理',
                    link:'/material/poster',
                    key: 202
                },
                {
                    name: '案例管理',
                    link:'/solution',
                    key: 203
                },
                {
                    name: '白皮书管理',
                    link:'/whitePage',
                    key: 204
                },
                {
                    name: '活动管理',
                    link:'/activity',
                    key: 205
                },
                {
                    name: '视频管理',
                    link:'/video',
                    key: 206
                },
                {
                    name: '在线支持',
                    link:'/support',
                    key: 207
                }
            ]
        },
        {
            key: 3,
            name: '后台配置',
            icon: 'notification',
            child: [
                {
                    name: '后台用户',
                    link:'/manage',
                    key: 301
                },
                //{
                //    name: '后台角色',
                //    key: 302
                //},
                //{
                //    name: '系统配置',
                //    key: 303
                //},
                //{
                //    name:'图表',
                //    link:'/chart',
                //    key:304
                //},
                //{
                //    name:'React演示',
                //    link:'/movie',
                //    key:305
                //}
            ]
        }
    ]




}
