/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export function showBox(isShow){
    return{
        type:'user_show',
        payload:isShow
    }
}

export function getUserType(){
    return{
        type:'GET_USER_TYPE',
        payload:{
            promise:api.post('/userMgmt/listUserType',{
                data: {
                    currentPage: 1,
                    pageSize: 10
                }
            })
        }
    }
}
export function delUser(id){
    return{
        type:'DEL_USER',
        payload:{
            promise:api.post('/delUser',{
                data:{
                    Id:id
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
export function isExistUserByName(name){
    return{
        type:'EXIST_USER',
        payload:{
            promise:api.post("/existUser",{
                data:{
                    Name:name
                }
            })
        }
    }
}
export function showEditBox(isShow,postValue){
    return{
        type:'editUser_show',
        meta:postValue,
        payload:isShow
    }
}
export function showResetBox(isShow,postValue){
    return{
        type:'resetUser_show',
        meta:postValue,
        payload:isShow
    }
}
export function editUser(id,data){
    return{
        type:'EDIT_USER',
        meta:data,
        payload:{
            promise:api.post("/editUser",{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}
export function reset(id,data){
    return{
        type:'RESETPWD',
        meta:data,
        payload:{
            promise:api.post("/editUser",{
                data:{
                    Id:id,
                    PostValue:data
                }
            })
        }
    }
}