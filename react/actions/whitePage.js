/**
 * Created by Liya on 2016/5/16.
 */
import api from '../api'


export function getWhitePage() {

    return {
        type: 'GET_WHITEPAGE',
        payload: {
            promise: api.post('/whitePage',{

            })
        }
    }

}
export function deleteWhitePage(id){
    return{
        type:'DEL_WHITEPAGE',
        payload:{
            promise:api.post('/deleteWhitePage',{
                data:{
                    Id:id
                }
            })
        }
    }
}
export function showEditBox(isShow,otherInfo){

    return{
        type:'eidtWhitePageBox',
        meta: otherInfo,
        payload:isShow
    }
}
export function showBox(isShow){
    return{
        type:'whitePageBox',
        payload:isShow
    }
}
export function editWhitePage(id,data){
    return{
        type:'EDIT_WHITEPAGE',
        meta:data,
        payload:{
            promise:api.post('/editWhitePage',{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}
export function addWhitePage(data){
    return{
        type:'ADD_WHITEPAGE',
        meta:data,
        payload:{
            promise:api.post('/addWhitePage',{
                data:{data}
            })
        }
    }

}
