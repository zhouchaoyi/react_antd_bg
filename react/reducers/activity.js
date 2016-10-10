/**
 * Created by Liya on 2016/5/16.
 */
import React from 'react'
import initialState from '../store/activity'



export default function (state = initialState, action = {}) {
    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'box':
            console.log("boxbox");
            return Object.assign({}, state, {isShowBox: action.payload})

        case 'GET_WHITEPAGE_SUCCESS':
            return Object.assign({},state,{tableData:action.payload});

        case 'ADD_ACTIVITY_SUCCESS':
            const  addTableData=[];
            addTableData.push(   Object.assign({},{key:action.payload.id},action.meta))

            state.tableData.map(x=>{
                addTableData.push(x)
            })
            return Object.assign({}, state, {tableData: addTableData, loading: 2,result:action.payload.result})

        case 'DEL_ACTIVITY_SUCCESS':
            const  newTableData=[];
            state.tableData.map(x=>{
                if(x.key!=action.payload.id){
                    newTableData.push(x)
                }
            })
            return Object.assign({}, state, {tableData: newTableData, loading: 2})

        case 'GET_DETAIL_SUCCESS':
            return Object.assign({}, state, {getPropsValue:action.payload[0], loading: 2,result:action.payload.result})

        case 'EDIT_ACTIVITY_SUCCESS':
            const  editTableData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.tableData.map(x=>{
                    editTableData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                state.tableData.map(x=>{
                    if(x.key==action.payload.id){
                        console.log(action.meta);
                        editTableData.push(Object.assign(action.meta,{key:x.key}) )

                    }else{
                        editTableData.push(x)
                    }
                })
            }

            return Object.assign({}, state, {tableData: editTableData, loading: 2,result:action.payload.result})



        default:
            return state;
    }


}