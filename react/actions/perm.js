/**
 * Created by zhouchaoyi on 2016/10/13.
 */
import api from '../api'

export const FLAG = "PERM";

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
            promise:api.post('/permMgmt/listModuleForPerm',{
                data: param
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
export function delItem(ids,tableData){
    return{
        type: FLAG+'_DEL_ITEM',
        meta: tableData,
        payload:{
            promise:api.post('/userMgmt/deleteUser',{
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
            promise:api.post("/permMgmt/addPerm",{
                data:data
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

export function isShowInfo(val){
    return{
        type: FLAG+'_IS_SHOW_INFO',
        payload: val
    }
}