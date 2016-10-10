/**
 * Created by Liya on 2016/5/16.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'


import OperationBtn from '../views/WhitePage/operationBtn'
const table_columns = [


    {title:'名称',dataIndex:'Name',key:'Name'},
    {title:'发布时间',dataIndex:'Time',key:'Time'},
    {title:'管理',dataIndex:'admin1',key:'operation',

        render(text, record){
            return (
                <OperationBtn whitePageRecord={record}></OperationBtn>
            );
        }}
];
const   _status= {
    cate: "",
    name: "",
    publisher:"",

}
const table_data = [
];
const _fileList=[]







export default {
    msg: 'hello whitePage',
    isShowBox: false,
    showEditBox:false,
    tableColumn: table_columns,
    tableData: table_data,
    validateStatus:_status,
    fileList:_fileList
}