/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export const FLAG = "USER_GROUP";

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

export function listItems(currentPage,pageSize,searchText){
    // console.log("currentPage="+currentPage);
    // console.log("pageSize="+pageSize);
    // console.log("searchText="+searchText);
    if(!searchText) {
        searchText = "";
    }
    return{
        type: FLAG+'_LIST_ITEMS',
        payload:{
            promise:api.post('/userMgmt/listUserGroup',{
                data: {
                    currentPage: currentPage,
                    pageSize: pageSize,
                    searchStr: searchText,
                    orderBy: "createdDate,1"
                }
            })
        }
    }
}
export function queryItemById(id){
    return{
        type: FLAG+'_QUERY_ITEM_BY_ID',
        payload:{
            promise:api.post('/userMgmt/queryUserGroupById',{
                data: {
                    id: id
                }
            })
        }
    }
}
export function delItem(ids,tableData){
    return{
        type: FLAG+'_DEL_ITEM',
        meta: tableData,
        payload:{
            promise:api.post('/userMgmt/deleteUserGroup',{
                data:{
                    ids:ids
                }
            })
        }
    }
}
export function addItem(data){
    return{
        type: FLAG+'_ADD_ITEM',
        payload:{
            promise:api.post("/userMgmt/addUserGroup",{
                data:data
            })
        }
    }
}
export function updateItem(data){
    return{
        type: FLAG+'_UPDATE_ITEM',
        payload:{
            promise:api.post("/userMgmt/updateUserGroup",{
                data:data
            })
        }
    }
}

export function searchChange(text){
    return{
        type: FLAG+'_SEARCH_CHANGE',
        payload: text
    }
}

export function getDept(param){
    return{
        type: FLAG+'_GET_DEPT',
        payload:{
            promise:api.post("/userMgmt/listDepartment",{
                data:param
            })
        }
    }
}