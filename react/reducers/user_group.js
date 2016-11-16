/**
 * Created by zhouchaoyi on 2016/10/24.
 */
import {FLAG} from '../actions/user_group'

const _tableData = {
    pageSize: 10,
    currentPage: 1
};

const _itemProp = {
    groupId: "",
    groupName: "",
    groupKey: "",
    departmentId: "-1",
    remark: "",
    status: "1"
}

const initialState = {
    tableData:_tableData,
    isShowBox:false,
    reloadGrid: false,
    itemProp: _itemProp,
    loading: true,
    saving: false,
    searchText: "",
    dept: []
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
        case FLAG+'_GET_DEPT':
            return Object.assign({},state,{dept: action.payload.data.items})

        default:
            return state;
    }


}