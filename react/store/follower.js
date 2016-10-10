/**
 * Created by Liya on 2016/6/7.
 */

import React, {PropTypes} from 'react'
import OperaBtn from '../views/Follower/operaBtn'

const table_columns = [
    {title: '头像', dataIndex: 'headimgurl',render(text,record){
        return( <div><img src={record.headimgurl} width="60px" /></div>)
    }},
    {title: '用户', dataIndex: 'nickname'},
    {title: '地区', dataIndex: 'address',render(text,record){
        return(<div>{record.province+record.city}</div>)
    }},
    {title: '备注', dataIndex: 'remark'},
    {title: '关注时间', dataIndex: 'subscribe_time'},
    {title: '管理', dataIndex: 'admin',render(text,record){
        return(
            <OperaBtn follwer={record}></OperaBtn>
        )
    }}
];



export default {

    tableColumn: table_columns,
    tableData: [],
    isShowBox:false,
    defaultValue:[]




}