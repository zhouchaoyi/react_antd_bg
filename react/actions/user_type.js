/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export function showBox(isShow){
    return{
        type:'SHOW_BOX',
        payload:isShow
    }
}

export function showSaving(isShow){
    return{
        type:'SHOW_SAVING',
        payload:isShow
    }
}

export function getUserType(currentPage,pageSize){
    return{
        type:'GET_USER_TYPE',
        payload:{
            promise:api.post('/userMgmt/listUserType',{
                data: {
                    currentPage: currentPage,
                    pageSize: pageSize
                }
            })
        }
    }
}
export function queryUserTypeById(typeId){
    return{
        type:'QUERY_USERTYPE_BY_ID',
        payload:{
            promise:api.post('/userMgmt/queryUserTypeById',{
                data: {
                    typeId: typeId
                }
            })
        }
    }
}
export function delUserType(ids,tableData){
    return{
        type:'DEL_USER_TYPE',
        meta: tableData,
        payload:{
            promise:api.post('/userMgmt/deleteUserType',{
                data:{
                    ids:ids
                }
            })
        }
    }
}
export function addUserType(data){
    return{
        type:'ADD_USER_TYPE',
        meta:data,
        payload:{
            promise:api.post("/userMgmt/addUserType",{
                data:data
            })
        }
    }
}
export function updateUserType(data){
    return{
        type:'EDIT_USER_TYPE',
        payload:{
            promise:api.post("/userMgmt/updateUserType",{
                data:data
            })
        }
    }
}