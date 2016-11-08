/**
 * Created by zhouchaoyi on 2016/10/24.
 */
import React from 'react'
import {FLAG} from '../actions/set_user_group'

const _tableData = {
    pageSize: 10,
    currentPage: 1
};

const _itemProp = {
    
}

const initialState = {
    tableData:_tableData,
    reloadGrid: false,
    loading: true,
    searchText: "",
    selectedRowKeys: [],
    tableData2:_tableData,
    reloadGrid2: false,
    loading2: true,
    searchText2: "",
    selectedRowKeys2: []
}

export default function (state = initialState, action = {}) {
    switch (action.type) {

        case FLAG+'_SHOW_SAVING':
            return Object.assign({},state,{saving: action.payload})

        case FLAG+'_LIST_ITEMS':
            return Object.assign({}, state, {
                tableData: action.payload.data,
                reloadGrid: false,
                loading: false
            })

        case FLAG+'_LIST_ITEMS_2':
            return Object.assign({}, state, {
                tableData2: action.payload.data,
                reloadGrid2: false,
                loading2: false
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
            return Object.assign({},state,{reloadGrid: true})

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

        case FLAG+'_SEARCH_CHANGE_2':
            return Object.assign({}, state, {searchText2: action.payload});
        
        case FLAG+'_CHANGE_ROW_KEYS':
            return Object.assign({}, state, {selectedRowKeys: action.payload});
        
        case FLAG+'_CHANGE_ROW_KEYS_2':
            return Object.assign({}, state, {selectedRowKeys2: action.payload});
            

        default:
            return state;
    }


}