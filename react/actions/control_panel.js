/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export const FLAG = "CONTROL_PANEL";

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

export function showModule(status){
    return{
        type: FLAG+'_SHOW_MODULE',
        payload:status
    }
}

export function listItems(param){
    return{
        type: FLAG+'_LIST_ITEMS',
        payload:{
            promise:api.post('/permMgmt/listControlPanel',{
                data: param
            })
        }
    }
}

export function listModule(param){
    return{
        type: FLAG+'_LIST_MODULE',
        payload:{
            promise:api.post('/permMgmt/listModule',{
                data: param
            })
        }
    }
}

export function queryItemById(id){
    return{
        type: FLAG+'_QUERY_ITEM_BY_ID',
        payload:{
            promise:api.post('/permMgmt/queryControlPanelById',{
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
            promise:api.post('/permMgmt/deleteControlPanel',{
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
            promise:api.post("/permMgmt/addControlPanel",{
                data:data
            })
        }
    }
}
export function updateItem(data){
    return{
        type: FLAG+'_UPDATE_ITEM',
        payload:{
            promise:api.post("/permMgmt/updateControlPanel",{
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
            promise:api.post("/permMgmt/moveControlPanel",{
                data:param
            })
        }
    }
}

export function getGridParentItem(param){
    return{
        type: FLAG+'_GET_GRID_PARENT_ITEM',
        payload:{
            promise:api.post("/permMgmt/listControlPanel",{
                data:param
            })
        }
    }
}

export function getFormParentItem(param){
    return{
        type: FLAG+'_GET_FORM_PARENT_ITEM',
        payload:{
            promise:api.post("/permMgmt/listControlPanel",{
                data:param
            })
        }
    }
}

export function showClose(status){
    return{
        type: FLAG+'_SHOW_CLOSE',
        payload: status
    }
}

export function parentClassIdChange(value){
    return{
        type: FLAG+'_PARENT_CLASS_ID_CHANGE',
        payload: value
    }
}

export function getParentDept(value){
    return{
        type: FLAG+'_PARENT_CLASS_ID_CHANGE_ASDS',
        payload: value
    }
}