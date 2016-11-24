/**
 * Created by zhouchaoyi on 2016/10/24.
 */
import React from 'react'
import {FLAG} from '../actions/control_panel'

const _tableData = {
    pageSize: 30,
    currentPage: 1
};

const _itemProp = {
    itemId: "",
    parentId: "-1",
    itemName: "",
    remark: "",
    status: "1",
    moduleId: "-1"
}

const initialState = {
    tableData:_tableData,
    isShowBox:false,
    reloadGrid: false,
    itemProp: _itemProp,
    loading: true,
    saving: false,
    searchText: "",
    parentClassId: "",
    status: false,
    orderBy: "classId,1",
    gridParentItem: [],
    formParentItem: [],
    isShowModule: "none",
    moduleList: []
}

export default function (state = initialState, action = {}) {
    switch (action.type) {

        case FLAG+'_SHOW_SAVING':
            return Object.assign({},state,{saving: action.payload})
        
        case FLAG+'_SHOW_MODULE':
            let isShowModule = "none";
            if(action.payload) {
                isShowModule = "";
            }
            return Object.assign({},state,{isShowModule: isShowModule})

        case FLAG+'_LIST_ITEMS':
            return Object.assign({}, state, {
                tableData: action.payload.data,
                reloadGrid: false,
                loading: false
            })

        case FLAG+'_LIST_MODULE':
            return Object.assign({}, state, {
                moduleList: action.payload.data.items
            })

        case FLAG+'_DEL_ITEM':
            let num = action.meta.total % action.meta.pageSize;
            if(num==1 && action.meta.currentPage==action.meta.pages) {
                //如果删除的记录是最后一页的唯一1个，跳转到首页
                action.meta.currentPage=1;
                return Object.assign({},state,{reloadGrid: true, tableData: action.meta})
            }else {
                return Object.assign({},state,{reloadGrid: true})
            }

        case FLAG+'_ADD_ITEM':
            if(action.payload.status.errorCode=='000001') {
                return Object.assign({},state,{
                    saving: false
                })
            }else {
                let tableData = state.tableData;
                tableData.currentPage = 1;
                return Object.assign({},state,{
                    reloadGrid: true, 
                    saving: false,
                    tableData: tableData
                })
            }

        case FLAG+'_UPDATE_ITEM':
            //console.log(action);
            if(action.payload.status.errorCode=='000001') {
                return Object.assign({},state,{
                    saving: false
                });
            }else {
                return Object.assign({},state,{
                    reloadGrid: true, 
                    saving: false,
                    itemProp: _itemProp
                });
            }


        case FLAG+'_QUERY_ITEM_BY_ID':
            return Object.assign({}, state, {itemProp: action.payload.data });

        case FLAG+'_RESET':
            return Object.assign({}, state, {itemProp: _itemProp });

        case FLAG+'_SEARCH_CHANGE':
            return Object.assign({}, state, {searchText: action.payload});
        
        case FLAG+'_SHOW_CLOSE':
            return Object.assign({}, state, {status: action.payload,reloadGrid: true});
        
        case FLAG+'_DO_MOVE':
            return Object.assign({},state,{reloadGrid: true})
        
        case FLAG+'_GET_GRID_PARENT_ITEM':
            let flag = false;
            for(let i=0;i<action.payload.data.items.length;i++) {
                let item = action.payload.data.items[i];
                if(item.classId == state.parentClassId) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {  
                return Object.assign({},state,{gridParentItem: action.payload.data.items,parentClassId: "",reloadGrid: true})
            }else {
                return Object.assign({},state,{gridParentItem: action.payload.data.items})
            }

        case FLAG+'_GET_FORM_PARENT_ITEM':
            return Object.assign({},state,{formParentItem: action.payload.data.items})
            
        
        case FLAG+'_PARENT_CLASS_ID_CHANGE':
            let parentClassId = action.payload=="-1"?"":action.payload;
            return Object.assign({},state,{parentClassId: parentClassId,reloadGrid: true})

        default:
            return state;
    }


}