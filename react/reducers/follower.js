/**
 * Created by Liya on 2016/6/7.
 */
import React from 'react'
import initialState from '../store/follower'
import {timeStampToDate} from '../utils/index'



export default function (state = initialState, action = {}) {
    switch (action.type) {
        case 'normal':
            return Object.assign({}, state, {msg: action.payload + ' --from reducer'})
        case 'show_box':
            console.log("boxbox");
            return Object.assign({}, state, {isShowBox: action.payload,defaultValue:action.meta })

        case 'GET_FOLLOWER_SUCCESS':
            const newTable=[];
            action.payload.items.forEach((x,index)=>{

                let subscribe_time=null
                if(x.subscribe_time){
                    const   d=new   Date(x.subscribe_time* 1000);
                     subscribe_time=timeStampToDate(d)
                }
                newTable.push(Object.assign(x,{key:index,subscribe_time:subscribe_time}))
            })
            return Object.assign({},state,{tableData:newTable})

        case 'UPDATE_REMARK_SUCCESS':
            const newTableData=[];
            if(action.payload.result==0){
                state.tableData.map(x=>{
                    newTableData.push(x)
                })
                console.log("修改失败")
            }else if(action.payload.result==1){
                console.log("修改备注成功",action.meta)
                state.tableData.map((x,index)=>{
                    if(x.openid==action.meta.openid){
                        newTableData.push(Object.assign(x,{remark:action.meta.remark}))
                    }else{
                        newTableData.push(x)
                    }
                })

            }
            return Object.assign({},state,{tableData:newTableData})



        default:
            return state;
    }


}