/**
 * Created by Liya on 2016/6/1.
 */
import React from 'react'
import initialState from '../store/manage'



export default function (state = initialState, action = {}) {
    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'user_show':
            return Object.assign({},state,{isShowBox: action.payload})

        case 'editUser_show':
            return Object.assign({},state,{isShowEditBox: action.payload,defaultValue:action.meta})
        case 'resetUser_show':
            return Object.assign({},state,{isShowPwdBox: action.payload,defaultValue:action.meta})

        case 'GET_USERS_SUCCESS':
            return Object.assign({}, state, {tableData: action.payload })

        case 'DEL_USER_SUCCESS':
            const newTableData=[];
            if(action.payload.result==0){
                state.tableData.map(x=>{
                    newTableData.push(x)
                })
                console.log("删除失败")
            }else if(action.payload.result==1){
                console.log("删除成功")
                state.tableData.map((x,index)=>{
                    if(x.Id!=action.payload.id){
                        newTableData.push(x)
                    }
                })

            }
            return Object.assign({},state,{tableData:newTableData})
        case 'EDIT_USER_SUCCESS':
            const newEditData=[]
            if(action.payload.result==0){
                state.tableData.map(x=>{
                    newEditData.push(x)
                })
            }else if(action.payload.result==1) {
                state.tableData.map(x=>{
                    if(x.Id==action.payload.id){
                        newEditData.push(Object.assign({key:action.payload.id,Id:action.payload.id},action.meta))
                    }else{
                        newEditData.push(x)
                    }

                })
            }

            return Object.assign({},state,{tableData:newEditData})

        case 'RESETPWD_SUCCESS':
            return Object.assign({},state)


        case 'ADD_USER_SUCCESS':
            const newData=[]
            if(action.payload.result==0){
                state.tableData.map(x=>{
                    newData.push(x)
                })
            }else if(action.payload.result==1){
                newData.push(Object.assign({key:action.payload.id,Id:action.payload.id},action.meta))
                state.tableData.map(x=>{
                    newData.push(x)
                })
            }
            return Object.assign({},state,{tableData:newData})


        case"EXIST_USER_SUCCESS":
            var existUser=action.payload.count==0?false:true
            return Object.assign({},state,{isExist:existUser})

        default:
            return state;
    }


}