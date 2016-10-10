/**
 * Created by Liya on 2016/5/17.
 */
import React from 'react'
import initialState from '../store/material'

import {getNowTime} from '../utils'

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'box':
            console.log("boxbox");
            return Object.assign({}, state, {isShowBox: action.payload})

        case 'GET_PIC_SUCCESS':
            return Object.assign({}, state, {tableData: action.payload, loading: 2})

        case 'DEL_PICSERISE_SUCCESS':
            const  newTableData=[];
            state.tableData.map(x=>{
                if(x.key!=action.payload.id){
                    newTableData.push(x)
                }
            })
            console.log(newTableData);
            return Object.assign({}, state, {tableData: newTableData, loading: 2})

        case 'DETAIL_PIC_SUCCESS':
            let _fileList=[];

            if(action.payload.Url){
              let picList= JSON.parse(action.payload.Url)
                picList.map((x,index)=>{
                    console.log(x)
                    _fileList.push({
                            uid:x.uid,
                            name:x.picName,
                            status: 'done',
                            url: x.picPath,
                            thumbUrl:x.picPath
                    })
                })
            }else{
                _fileList=null;
            }

            return Object.assign({}, state, {getPropsValue: action.payload, loading: 2,
                fileList:_fileList})

        case 'EDIT_PIC_SUCCESS':
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

        case 'ADD_PIC_SUCCESS':
            const  addTableData=[];
            addTableData.push(   Object.assign({},{key:action.payload.id},action.meta))
            state.tableData.map(x=>{
                addTableData.push(x)
            })
            return Object.assign({}, state, {tableData: addTableData, loading: 2,result:action.payload.result})

        case 'GET_POSTER_SUCCESS':
            return Object.assign({}, state, {posterData: action.payload, loading: 2})

        case 'DEL_POSTER_SUCCESS':
            const  newposterData=[];
            if(action.payload.result==0){
                console.log("删除失败")
                state.posterData.map(x=>{
                    newposterData.push(x)
                })
            }else if(action.payload.result==1){
                state.posterData.map(x=>{
                    if(x.key!=action.payload.id){
                        newposterData.push(x)
                    }
                })
            }

            console.log(newposterData);
            return Object.assign({}, state, {posterData: newposterData, loading: 2})

        case 'DETAIL_POSTER_SUCCESS':
            let _posterPic=[];

            if(action.payload[0].Url){
                let picList= JSON.parse(action.payload[0].Url)
                picList.map((x,index)=>{
                    _posterPic.push({
                        uid:x.uid,
                        name:x.picName,
                        status: 'done',
                        url: x.picPath,
                        thumbUrl:x.picPath
                    })
                })
            }else{
                _posterPic=null;
            }

            return Object.assign({}, state, {getPropsValue: action.payload[0], loading: 2,
                fileList:_posterPic})


        case 'EDIT_POSTER_SUCCESS':
            const  editPosterData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.posterData.map(x=>{
                    editPosterData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                const  time=getNowTime();
                state.posterData.map(x=>{
                    if(x.key==action.payload.id){
                        console.log(action.meta);
                        editPosterData.push(Object.assign(action.meta,{time:time,key:x.key}) )

                    }else{
                        editPosterData.push(x)
                    }
                })
            }
            return Object.assign({}, state, {posterData: editPosterData, loading: 2,result:action.payload.result})

        case 'ADD_POSTER_SUCCESS':
            const  addPosterData=[];
            if(action.payload.result==0){
                console.log("添加失败")
            }else  if(action.payload.result==1){
                addPosterData.push(   Object.assign({},{key:action.payload.id},action.meta))
                state.tableData.map(x=>{
                    addPosterData.push(x)
                })
            }

            return Object.assign({}, state, {posterData: addPosterData, loading: 2,result:action.payload.result})

        case 'GET_PAGE_SUCCESS':
            return Object.assign({}, state, {pageData: action.payload, loading: 2})

        case 'DEL_PAGE_SUCCESS':
            const  newpageData=[];
            if(action.payload.result==0){
                console.log("删除失败")
                state.pageData.map(x=>{
                    newpageData.push(x)
                })
            }else if(action.payload.result==1){
                state.pageData.map(x=>{
                    if(x.key!=action.payload.id){
                        newpageData.push(x)
                    }
                })
            }
            return Object.assign({}, state, {pageData: newpageData, loading: 2})

        case 'DETAIL_PAGE_SUCCESS':
            let _pagePic=[];

            if(action.payload[0].Url){
                let picList= JSON.parse(action.payload[0].Url)
                picList.map((x,index)=>{
                    _pagePic.push({
                        uid:x.uid,
                        name:x.picName,
                        status: 'done',
                        url: x.picPath,
                        thumbUrl:x.picPath
                    })
                })
            }else{
                _pagePic=null;
            }

            return Object.assign({}, state, {getPropsValue: action.payload[0], loading: 2,
                fileList:_pagePic})

        case 'EDIT_PAGE_SUCCESS':
            const  editPageData=[];
            if(action.payload.result==0){
                console.log("修改失败");
                state.pageData.map(x=>{
                    editPageData.push(x)
                })
            }else if(action.payload.result==1){
                console.log("成功")
                const  time=getNowTime();
                state.pageData.map(x=>{
                    if(x.key==action.payload.id){
                        console.log(action.meta);
                        editPageData.push(Object.assign(action.meta,{time:time,key:x.key}) )

                    }else{
                        editPageData.push(x)
                    }
                })
            }
            return Object.assign({}, state, {pageData: editPageData, loading: 2,result:action.payload.result})

        case 'ADD_PAGE_SUCCESS':
            const  addPageData=[];
            if(action.payload.result==0){
                console.log("添加失败")
            }else  if(action.payload.result==1){
                addPageData.push(   Object.assign({},{key:action.payload.id},action.meta))
                state.pageData.map(x=>{
                    addPageData.push(x)
                })
            }
            return Object.assign({}, state, {pageData: addPageData, loading: 2,result:action.payload.result})

        default:
            return state;
    }


}