/**
 * Created by zhouchaoyi on 2016/10/24.
 */
import React from 'react'
import {FLAG} from '../actions/admin_list'

const _tableData = {
    pageSize: 10
};

const _itemProp = {
    userId: "",
    loginName: "",
    loginPassword: "",
    userName: "",
    idCardType: "0",
    idCard: "",
    sex: "0",
    publicAccount: "0",
    status: "0"
}

const initialState = {
    tableData:_tableData,
    isShowBox:false,
    reloadGrid: false,
    itemProp: _itemProp,
    loading: true,
    saving: false
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
            return Object.assign({},state,{
                reloadGrid: true, 
                saving: false
            })

        case FLAG+'_UPDATE_ITEM':
            return Object.assign({},state,{
                reloadGrid: true, 
                saving: false,
                itemProp: _itemProp
            })


        case FLAG+'_QUERY_ITEM_BY_ID':
            return Object.assign({}, state, {itemProp: action.payload.data });

        case FLAG+'_RESET':
            return Object.assign({}, state, {itemProp: _itemProp });

        default:
            return state;
    }


}