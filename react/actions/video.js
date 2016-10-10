/**
 * Created by Liya on 2016/6/16.
 */

import api from '../api'

export function getVideo(){
    return{
        type:'GET_VIDEO',
        payload:{
            promise:api.get("/getVideo")
        }
    }
}
export function showBox(isShow){
    return{
        type:'show_videoBox',
        payload:isShow
    }

}
export function showEditBox(isShow,data){
    return{
        type:'show_editBox',
        meta:data,
        payload:
            isShow
    }
}
export function addVideo(data){
    return{
        type:'ADD_VIDEO',
        meta:data,
        payload:{
            promise:api.post("/addVideo",{
                data:{data}
            })
        }
    }
}
export function deleteVideo(id){
    return{
        type:'DEL_VIDEO',
        meta:id,
        payload:{
            promise:api.post('/delVideo',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editVideo(id,data){
        return{
            type:'EDIT_VIDEO',
            meta:data,
            payload:{
                promise:api.post('/editVideo',{
                    data:{
                        Id:id,
                        PostValue:data
                    }
                })
            }
        }
}