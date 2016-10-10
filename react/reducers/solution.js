import React from 'react'

import {
    GET_SOLUTION_PENDING,
    GET_SOLUTION_SUCCESS,
    DETAIL_SOLUTION_SUCCESS
} from '../actions/solution'

import initialState from '../store/solution'

import {getNowTime} from '../utils';

export default function (state = initialState, action = {}) {

    console.log('action type=>' + action.type);

    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'box':
            return Object.assign({}, state, {isShowBox: action.payload})

        case 'eidtBox':
            console.log("???????,",action.meta)
            return Object.assign({}, state, {isShowSEditBox: action.payload,getCatePropsValue:action.meta})

        case 'SOLUTIOB_CATE_SUCCESS':
            let cateData=[]
            action.payload.map((x,index)=>{
                cateData.push(Object.assign({key:x.Id},x))
            })
            return Object.assign({}, state, {options: action.payload, cateData:cateData})
        case 'DEL_SOLUTIONCATE_SUCCESS':
            const  newCateData=[];
            state.cateData.map(x=>{
                if(x.key!=action.payload.id){
                    newCateData.push(x)
                }
            })
            return Object.assign({}, state, {cateData: newCateData, loading: 2})

        case 'ADD_SOLUTIONCATE_SUCCESS':
            const  addCateData=[];
            addCateData.push(   Object.assign({},{key:action.payload.id},action.meta))
            state.cateData.map(x=>{
                addCateData.push(x)
            })
            return Object.assign({}, state, {cateData: addCateData, loading: 2,result:action.payload.result})


        case 'EDIT_SOLUTIONCATE_SUCCESS':
            const  editcateData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.cateData.map(x=>{
                    editcateData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                const  time=getNowTime();
                state.cateData.map((x,index)=>{
                    if(x.key==action.payload.id){

                        editcateData.push(Object.assign(action.meta,{Time:time,key:index}) )

                    }else{
                        editcateData.push(x)
                    }
                })
            }
            return Object.assign({}, state, {cateData: editcateData, loading: 2,result:action.payload.result})


        case 'DEL_SOLUTION_SUCCESS':

            const  newTableData=[];
            state.tableData.map(x=>{
                if(x.key!=action.payload.id){
                    newTableData.push(x)
                }
            })

            return Object.assign({}, state, {tableData: newTableData, loading: 2})
        case GET_SOLUTION_PENDING:
            return Object.assign({}, state, { loading: 1})

        case GET_SOLUTION_SUCCESS:
            return Object.assign({}, state, {tableData: action.payload, loading: 2})

        case "ADD_SOLUTION_SUCCESS":
            const  addTableData=[];
            if(action.payload.result==1){
                addTableData.push(   Object.assign({},{key:action.payload.id},action.meta))
                console.log("数据库插入成功")
            }
            else{
                console.log("数据插入失败")
            }


            state.tableData.map(x=>{
                addTableData.push(x)
            })
            return Object.assign({}, state, {tableData: addTableData, loading: 2,result:action.payload.result})

        case "EDIT_SOLUTION_SUCCESS":
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
                        console.log(action.meta);
                        editTableData.push(Object.assign(action.meta,{time:time,key:x.key}) )

                    }else{
                        editTableData.push(x)
                    }
                })
            }

            return Object.assign({}, state, {tableData: editTableData, loading: 2,result:action.payload.result})

        case DETAIL_SOLUTION_SUCCESS:
            let _fileList=[];
            console.log("action.payload[0]",action.payload[0])
            if(action.payload[0].Url){
                    const x=action.payload[0];
                    _fileList.push({
                        uid:x.Id,
                        name:x.Url.replace("uploads\\solution\\",""),
                        status: 'done',
                        url: "\\"+x.Url,
                        thumbUrl:"\\"+x.Url
                    })

            }else{
                _fileList=null;
            }
            return Object.assign({}, state, {getPropsValue:action.payload[0], loading: 2,result:action.payload.result,
                fileList:_fileList,

            })


        default:
            return state;
    }

}