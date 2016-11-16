/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export const FLAG = "MODULE";

export function reset(){
    return{
        type: FLAG+'_RESET'
    }
}

export function onCheck(checkedKeys){
    return{
        type: FLAG+'_ON_CHECK',
        payload: checkedKeys
    }
}

export function onExpand(expandedKeys){
    return{
        type: FLAG+'_ON_EXPAND',
        payload: expandedKeys
    }
}

export function onSelect(item){
    return{
        type: FLAG+'_ON_SELECT',
        payload: item
    }
}

export function listItems(param){
    return{
        type: FLAG+'_LIST_ITEMS',
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
            promise:api.post('/permMgmt/queryModuleById',{
                data: {
                    id: id
                }
            })
        }
    }
}
export function delItem(param){
    return{
        type: FLAG+'_DEL_ITEM',
        payload:{
            promise:api.post('/permMgmt/deleteModule',{
                data: param
            })
        }
    }
}
export function addItem(data){
    return{
        type: FLAG+'_ADD_ITEM',
        payload:{
            promise:api.post("/permMgmt/addModule",{
                data:data
            })
        }
    }
}
export function updateItem(data){
    return{
        type: FLAG+'_UPDATE_ITEM',
        payload:{
            promise:api.post("/permMgmt/updateModule",{
                data:data
            })
        }
    }
}

export function isShowInfo(val){
    return{
        type: FLAG+'_IS_SHOW_INFO',
        payload: val
    }
}

export function doMove(param){
    return{
        type: FLAG+'_DO_MOVE',
        payload:{
            promise:api.post("/permMgmt/moveModule",{
                data:param
            })
        }
    }
}

export function showSaving(isShow){
    return{
        type: FLAG+'_SHOW_SAVING',
        payload:isShow
    }
}

export function onChange(value){
    return{
        type: FLAG+'_ON_CHANGE',
        payload:value
    }
}

export function getUserType(param){
    return{
        type: FLAG+'_GET_USERTYPE',
        payload:{
            promise:api.post("/userMgmt/listUserType",{
                data:param
            })
        }
    }
}