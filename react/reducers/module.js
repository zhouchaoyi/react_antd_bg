/**
 * Created by zhouchaoyi on 2016/10/24.
 */
import {FLAG} from '../actions/module'

const _tableData = {
};

const _itemProp = {
    moduleId: "",
    parentId: "-1",
    moduleName: "",
    moduleCode: "",
    isPermOnly: "0",
    userType: "",
    remark: "",
    url: "",
    relationUrl: "",
    bExt: "0",
    status: "1"
}

const initialState = {
    tableData: _tableData,
    checkedKeys: [],
    expandedKeys: ["-1"],
    showInfo: false,
    infoText: "",
    showDetail: "none",
    itemProp: _itemProp,
    itemDetail: {},
    reload: false,
    saving: false,
    userTypeList: []
}

export default function (state = initialState, action = {}) {
    switch (action.type) {

        case FLAG+'_ON_CHECK':
            return Object.assign({},state,{checkedKeys: action.payload})
        
        case FLAG+'_ON_EXPAND':
            return Object.assign({},state,{expandedKeys: action.payload})

        case FLAG+'_ON_SELECT':
            return Object.assign({},state,{showDetail: "",itemDetail: action.payload})

        case FLAG+'_LIST_ITEMS':
            //console.log("LIST_ITEMS<<<<<<<");
            let items = action.payload.data.items;
            return Object.assign({}, state, {
                tableData: action.payload.data,
                reload: false
            })

        case FLAG+'_DEL_ITEM':
            return Object.assign({},state,{reload: true,showDetail: "none"})

        case FLAG+'_ADD_ITEM':
            if(action.payload.status.errorCode=='000001') {
                return Object.assign({},state,{
                    saving: false
                })
            }else {
                return Object.assign({},state,{
                    reload: true, 
                    saving: false,
                    itemProp: _itemProp,
                    showDetail: "none"
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
                    reload: true, 
                    saving: false,
                    itemProp: _itemProp,
                    showDetail: "none"
                });
            }


        case FLAG+'_QUERY_ITEM_BY_ID':
            return Object.assign({}, state, {itemProp: action.payload.data });

        case FLAG+'_RESET':
            return Object.assign({}, state, {itemProp: _itemProp});

        case FLAG+'_IS_SHOW_INFO':
            return Object.assign({}, state, {showInfo: action.payload});

        case FLAG+'_DO_MOVE':
            return Object.assign({},state,{reload: true})
        
        case FLAG+'_ON_CHANGE':
            let itemProp = state.itemProp;
            itemProp.parentId = action.payload;
            //console.log(itemProp);
            return Object.assign({},state,{itemProp: itemProp})
        
        case FLAG+'_GET_USERTYPE':
            //console.log(action.payload.data.items);
            let list = action.payload.data.items;
            let tempList = [];
            for(let i=0;i<list.length;i++) {
                let obj = {};
                obj.label = list[i].typeName;
                obj.value = list[i].typeCode;
                tempList.push(obj);
            }
            return Object.assign({}, state, {userTypeList: tempList });

        case FLAG+'_SHOW_SAVING':
            return Object.assign({},state,{saving: action.payload})

        default:
            return state;
    }


}