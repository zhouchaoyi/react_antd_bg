/**
 * Created by zhouchaoyi on 2016/10/24.
 */
import {FLAG} from '../actions/perm'

const _tableData = {
};

const initialState = {
    tableData: _tableData,
    checkedKeys: [],
    expandedKeys: [],
    showInfo: false,
    infoText: "",
    showDetail: "none",
    itemProp: {}
}

export default function (state = initialState, action = {}) {
    switch (action.type) {

        case FLAG+'_ON_CHECK':
            return Object.assign({},state,{checkedKeys: action.payload})
        
        case FLAG+'_ON_EXPAND':
            return Object.assign({},state,{expandedKeys: action.payload})

        case FLAG+'_ON_SELECT':
            return Object.assign({},state,{showDetail: "",itemProp: action.payload})

        case FLAG+'_LIST_ITEMS':
            //console.log("LIST_ITEMS<<<<<<<");
            let items = action.payload.data.items;
            let checkedKeys = [];
            let expandedKeys = [];
            for(let i=0; i<items.length; i++) {
                if(items[i].hasPerm=='1') {
                    checkedKeys.push(items[i].moduleId+'');
                }
                if(items[i].isParent=='1') {
                    expandedKeys.push(items[i].moduleId+'');
                }
            }
            return Object.assign({}, state, {
                tableData: action.payload.data,
                checkedKeys: checkedKeys,
                expandedKeys: expandedKeys
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
                return Object.assign({},state,{
                    showInfo: true,
                    infoText: "保存成功"
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
            return Object.assign({}, state, {tableData: _tableData,showDetail: "none"});

        case FLAG+'_IS_SHOW_INFO':
            return Object.assign({}, state, {showInfo: action.payload});

        default:
            return state;
    }


}