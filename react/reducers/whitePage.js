/**
 * Created by Liya on 2016/5/16.
 */
import React from 'react'
import initialState from '../store/whitePage'
import {getNowTime} from '../utils';
export default function (state = initialState, action = {}) {

    console.log('action type=>' + action.type);


    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'whitePageBox':
            return Object.assign({}, state, {isShowBox: action.payload})
        case 'eidtWhitePageBox':
            let _fileList=[];

            if(action.meta.Url){
                    _fileList.push({
                        uid:-action.meta.key,
                        name:action.meta.Url.replace("uploads\\whitePage\\",""),
                        status: 'done',
                        url:action.meta.Url,
                        thumbUrl:action.meta.Url
                    })

            }else{
                _fileList=null;
            }

            return Object.assign({}, state, {isShowEditBox: action.payload,getPropsValue:action.meta,fileList:_fileList})
        case 'GET_WHITEPAGE_SUCCESS':
            return Object.assign({}, state, {tableData: action.payload})

        case'DEL_WHITEPAGE_SUCCESS':
            const  newTableData=[];
            state.tableData.map(x=>{
                if(x.key!=action.payload.id){
                    newTableData.push(x)
                }
            })

            return Object.assign({}, state, {tableData: newTableData, loading: 2})

        case 'EDIT_WHITEPAGE_SUCCESS':
            const  editTableData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.tableData.map(x=>{
                    editTableData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                const  time=getNowTime();
                state.tableData.map(x=>{
                    if(x.key==action.payload.id){

                        editTableData.push(Object.assign(action.meta,{Time:time}) )

                    }else{
                        editTableData.push(x)
                    }
                })
            }

            return Object.assign({}, state, {tableData: editTableData, loading: 2,result:action.payload.result})

            case 'ADD_WHITEPAGE_SUCCESS':
                const  addTableData=[];
                const  time=getNowTime();
                addTableData.push(   Object.assign({},{key:action.payload.id,Time:time},action.meta))
                state.tableData.map(x=>{
                    addTableData.push(x)
                })
                return Object.assign({}, state, {tableData: addTableData, loading: 2,result:action.payload.result})

        default:
            return state;
    }
    function nowDate(){

    }


}