/**
 * Created by Liya on 2016/6/8.
 */
import React, {PropTypes} from 'react'
import OperaBtn from '../views/Msg/operaBtn'


const _tableColumn = [
    {title: 'ID', dataIndex: 'id'},
    {title: '状态', dataIndex: 'status'},
    {title: '发送人', dataIndex: 'sender'},
    {title: '消息内容', dataIndex: 'msg'},
    {title: '发送时间', dataIndex: 'created'},
    {title: '管理', dataIndex: 'admin',render(text,record){
        return (
            <OperaBtn msg={record}></OperaBtn>
        )
    }}
];


const _tableData = [
    {key: 10, status: 'new',sender:'aaa',msg:'你好能提供什么?',created:'2015-8-19'},
    {key: 9, status: 'new',sender:'aaa',msg:'你好能提供什么?',created:'2015-8-19'},
  
];

export default {
    tableColumn:_tableColumn,
    tableData:_tableData,
    isShowBox:false,
    defaultValue:[]

}