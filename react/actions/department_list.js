/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export const FLAG = "DEPARTMENT";

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
            promise:api.post('/userMgmt/listDepartment',{
                data: {
                    userType: "admin",
                    currentPage: currentPage,
                    pageSize: pageSize,
                    searchStr: searchText,
                    orderBy: "classId,1"
                }
            })
        }
    }
}
export function queryItemById(id){
    return{
        type: FLAG+'_QUERY_ITEM_BY_ID',
        payload:{
            promise:api.post('/userMgmt/queryDepartmentById',{
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
            promise:api.post('/userMgmt/deleteDepartment',{
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
            promise:api.post("/userMgmt/addDepartment",{
                data:data
            })
        }
    }
}
export function updateItem(data){
    return{
        type: FLAG+'_UPDATE_ITEM',
        payload:{
            promise:api.post("/userMgmt/updateDepartment",{
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

export function doMove(param){
    return{
        type: FLAG+'_DO_MOVE',
        payload:{
            promise:api.post("/userMgmt/doMoveDepartment",{
                data:param
            })
        }
    }
}

export function getParentDept(param){
    return{
        type: FLAG+'_GET_PARENT_DEPT',
        payload:{
            promise:api.post("/userMgmt/listDepartment",{
                data:param
            })
        }
    }
}