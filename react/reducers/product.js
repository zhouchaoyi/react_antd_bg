import React from 'react'


import {
    GET_SERIES_PENDING,
    GET_SERIES_SUCCESS,
    DEL_SERIES_PENDING,
    DEL_SERIES_SUCCESS
} from '../actions/product'

import initialState from '../store/product'

import {getNowTime} from '../utils';

export default function (state = initialState, action = {}) {

    console.log('action type=>' + action.type);


    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'box':
            return Object.assign({}, state, {isShowBox: action.payload})
        case 'eidtBox':
            return Object.assign({}, state, {isShowEditBox: action.payload,getCatePropsValue:action.meta})

        case 'GET_CATEGORY_SUCCESS':
           let cateData=[]
            action.payload.map((x,index)=>{
                cateData.push(Object.assign({key:x.Id},x))
            })
            return Object.assign({}, state, {options: action.payload, loading: 2,cateData:cateData})
        case 'ADD_PRODUCTCATE_SUCCESS':
            const  addCateData=[];
            addCateData.push(   Object.assign({},{key:action.payload.id},action.meta))
            state.cateData.map(x=>{
                addCateData.push(x)
            })

            return Object.assign({}, state, {cateData: addCateData, loading: 2})
        case 'DEL_PRODUCTCATE_SUCCESS':
            const  newCateData=[];
            state.cateData.map(x=>{
                if(x.key!=action.payload.id){
                    newCateData.push(x)
                }
            })
            console.log(newCateData);
            return Object.assign({}, state, {cateData: newCateData, loading: 2})

        case 'EDIT_PRODUCTCATE_SUCCESS':
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

                        editcateData.push(Object.assign(action.meta,{Time:time,key:x.key}) )

                    }else{
                        editcateData.push(x)
                    }
                })
                console.log("-------------reducer:---------")
                console.log(editcateData)
            }
            return Object.assign({}, state, {cateData: editcateData, loading: 2,result:action.payload.result})

        case DEL_SERIES_SUCCESS:
            const  newTableData=[];
            state.tableData.map(x=>{
                if(x.key!=action.payload.id){
                    newTableData.push(x)
                }
            })
            console.log(newTableData);
            return Object.assign({}, state, {tableData: newTableData, loading: 2})


        case 'DETAIL_SERIES_SUCCESS':
            return Object.assign({}, state, {getPropsValue:action.payload[0], loading: 2,result:action.payload.result,
            })
        case 'GET_SERIESNAME_SUCCESS':
            return Object.assign({}, state, {getPropsValue:action.payload[0], loading: 2,result:action.payload.result,
            })



        case 'EDIT_SERIES_SUCCESS':
            const  editTableData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.tableData.map(x=>{
                    editTableData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                const  time=getNowTime();
                state.tableData.map((x,index)=>{
                    if(x.key==action.payload.id){
                        editTableData.push(Object.assign(action.meta,{Time:time,key:x.key}) )

                    }else{
                        editTableData.push(x)
                    }
                })
            }

            return Object.assign({}, state, {tableData: editTableData, loading: 2,result:action.payload.result})



        case "ADD_SERIES_SUCCESS":
            const  addTableData=[];
            const  time=getNowTime();
            addTableData.push(   Object.assign({},{key:action.payload.id,Time:time},action.meta))
            state.tableData.map(x=>{
                addTableData.push(x)
            })

            return Object.assign({}, state, {tableData: addTableData, loading: 2})

        case GET_SERIES_PENDING:
            return Object.assign({}, state, {loading: 1})

        case GET_SERIES_SUCCESS:
            return Object.assign({}, state, {tableData: action.payload, loading: 2})

        case 'GET_PRODUCT_SUCCESS':
            return Object.assign({}, state, {productData: action.payload, loading: 2})

        case 'DEL_PRODUCT_SUCCESS':
            const  newProductData=[];
            state.productData.map(x=>{
                if(x.key!=action.payload.id){
                    newProductData.push(x)
                }
            })
            return Object.assign({}, state, {productData: newProductData, loading: 2})

        case 'ADD_PRODUCT_SUCCESS':
            const  addProductData=[];
            addProductData.push(   Object.assign({},{key:action.payload.id},action.meta))
            state.productData.map(x=>{
                addProductData.push(x)
            })
            return Object.assign({}, state, {productData: addProductData, loading: 2})

        case 'EDIT_PRODUCT_SUCCESS':
            const  editProductData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.tableData.map(x=>{
                    editProductData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                const  time=getNowTime();
                state.productData.map((x,index)=>{
                    if(x.key==action.payload.id){
                        editProductData.push(Object.assign(action.meta,{Time:time,key:x.key}) )

                    }else{
                        editProductData.push(x)
                    }
                })
            }
            return Object.assign({}, state, {productData: editProductData, loading: 2,result:action.payload.result})

        case 'DETAIL_PRODUCT_SUCCESS':
            return Object.assign({}, state, {getPropsValue:action.payload[0], loading: 2,result:action.payload.result,
            })



        default:
            return state;
    }
    function nowDate(){

    }


}