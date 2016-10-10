/**
 * Created by Liya on 2016/6/8.
 */

import api from '../api'

export function getAllMsg(){
    console.log("action=>获取全部消息")
        return{
            type:'GET_MSG',
            payload:{
              //  promise:api.post('/getAllMsg')
            }
        }
}
export function showBox(isShow,openid){
    return{
        type:'show_msgBox',
        payload:isShow,
        meta:openid
    }
}
export function sendText(data){
    console.log(data)
    return{
        type:'SEND_TEXT',
        meta:data,
        payload:{
            promise:api.post("/sendText",{
                data:data
            })
        }
    }
}