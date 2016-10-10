/**
 * Created by Liya on 2016/6/16.
 */
import React from 'react'
import OperationBtn from '../views/Video/operationBtn'

const _tableColumn=[
    {title:'视频名称',dataIndex:'Name',key:'Name'},
    {title:'视频分类',dataIndex:'Cate',key:'Cate'},
    {title:'Url',dataIndex:'Url',key:'Url',render(text,record){
            return("http://"+record.Url)
    }},
    {title:'操作',dataIndex:'operation',render(text,record){
        return(<OperationBtn videoRecord={record}></OperationBtn>)
    }}
]
const _tableData=[

]
const _validateStatus= {
    name: '',
    url:'',
    cate:''
}

export default {
    tableColumn:_tableColumn,
    tableData:_tableData,
    isShowBox:false,
    isShowEditBox:false,
    validateStatus:_validateStatus,
}