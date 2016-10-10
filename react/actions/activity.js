/**
 * Created by Liya on 2016/5/16.
 */






import api from '../api'
export function getAllActivity() {

    return {
        type: 'GET_WHITEPAGE',
        payload: {
            promise: api.post('/activity',{

            })
        }
    }

}
export function addActivity(data){
    return{
        type:'ADD_ACTIVITY',
        meta:data,
        payload:{
            promise:api.post('/addActivity',{
                data:{data}
            })
        }
    }
}
export function deleteActivity(id){
    return{
        type:'DEL_ACTIVITY',
        payload:{
            promise:api.post('/delActivity',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function getActivityDetail(id){

    return{
        type:'GET_DETAIL',
        payload:{
            promise:api.post('/activityDetail',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function editActivity(id,data){
        return{
            type:'EDIT_ACTIVITY',
            meta:data,
            payload:{
                promise:api.post('/editActivity',{
                    data:{
                        Id:id,
                        PostValue:data
                    }
                })
            }
        }
}