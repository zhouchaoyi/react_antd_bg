/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export const FLAG = "USER_GROUP_MEMBER";

export function reset(){
    return{
        type: FLAG+'_RESET'
    }
}

export function showSaving(isShow){
    return{
        type: FLAG+'_SHOW_SAVING',
        payload:isShow
    }
}

export function listItems(params,currentPage,pageSize,searchText){
    if(!searchText) {
        searchText = "";
    }
    return{
        type: FLAG+'_LIST_ITEMS',
        payload:{
            promise:api.post('/userMgmt/listUserGroupMember',{
                data: {
                    groupId: params.groupId,
                    currentPage: currentPage,
                    pageSize: pageSize,
                    searchStr: searchText,
                    orderBy: "joinDate,1"
                }
            })
        }
    }
}

export function listItems2(params,currentPage,pageSize,searchText){
    if(!searchText) {
        searchText = "";
    }
    return{
        type: FLAG+'_LIST_ITEMS_2',
        payload:{
            promise:api.post('/userMgmt/listUserForUserGroup',{
                data: {
                    groupId: params.groupId,
                    currentPage: currentPage,
                    pageSize: pageSize,
                    searchStr: searchText,
                    orderBy: "userId,-1"
                }
            })
        }
    }
}

export function queryItemById(id){
    return{
        type: FLAG+'_QUERY_ITEM_BY_ID',
        payload:{
            promise:api.post('/userMgmt/queryUserById',{
                data: {
                    id: id
                }
            })
        }
    }
}
export function delItem(ids,groupId,tableData){
    return{
        type: FLAG+'_DEL_ITEM',
        meta: tableData,
        payload:{
            promise:api.post('/userMgmt/deleteUserGroupMember',{
                data:{
                    ids:ids,
                    groupId: groupId
                }
            })
        }
    }
}
export function addItem(ids,groupId){
    return{
        type: FLAG+'_ADD_ITEM',
        payload:{
            promise:api.post("/userMgmt/addUserGroupMember",{
                data:{
                    ids: ids,
                    groupId: groupId
                }
            })
        }
    }
}
export function updateItem(data){
    return{
        type: FLAG+'_UPDATE_ITEM',
        payload:{
            promise:api.post("/userMgmt/updateUser",{
                data:data
            })
        }
    }
}

export function searchChange2(text){
    return{
        type: FLAG+'_SEARCH_CHANGE_2',
        payload: text
    }
}

export function changeRowKeys(keys){
    return{
        type: FLAG+'_CHANGE_ROW_KEYS',
        payload: keys
    }
}

export function changeRowKeys2(keys){
    return{
        type: FLAG+'_CHANGE_ROW_KEYS_2',
        payload: keys
    }
}