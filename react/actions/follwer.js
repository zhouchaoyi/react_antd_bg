/**
 * Created by Liya on 2016/6/7.
 */
import api from '../api'

export function getFollowers(){
    return{
        type:'GET_FOLLOWER',
        payload:{
            promise:api.post("/getFollowers")
        }
    }
}
export function showBox(isShow,value){
    return{
        type:'show_box',
        meta:value,
        payload:isShow
    }
}
export function updateRemark(data){
    return{
        type:'UPDATE_REMARK',
        meta:data,
        payload:{
            promise:api.post("/updateRemark",{
                data:{
                    Openid:data.openid,
                    Remark:data.remark
                }
            })
        }
    }
}