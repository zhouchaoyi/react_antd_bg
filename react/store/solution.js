/**
 * Created by Liya on 2016/5/10.
 */

import React, {PropTypes} from 'react'
import OperationBtn from '../views/Solution/operationBtn'
import SolutionCateBtn from '../views/Solution/solutionCateBtn'
const table_columns = [

    {title:'行业',dataIndex:'Industry',key:'Industry'},
    {title:'名称',dataIndex:'Name',key:'Name'},
    {title:'发布者',dataIndex:'Publisher',key:'Publisher'},
    {title:'发布时间',dataIndex:'Time',key:'Time'},
    {title:'管理',dataIndex:'admin',key:'option',

        render(text, record){

            return (
                <OperationBtn solutionRecord={record}></OperationBtn>
            );
        }}
];


const table_data = [

];

const _option=[
]
const _defaultValue=[

]
const   _status= {
    industry: "",
    name: "",
    model:"",

    }



const fileList=[]
//类别管理
const _cateColumn=[
    {title:'类别名称',dataIndex:'Name',key:'Name'},
    {title:'管理',dataIndex:'admin1',key:'operation',

        render(text, record){
            return (
                <SolutionCateBtn solutionCate={record}></SolutionCateBtn>
            );
        }}
]

const  _cateData=[

]

export default {
    msg: 'hello solution',
    isShowBox: false,
    isShowSEditBox:false,
    tableColumn: table_columns,
    tableData: table_data,
    cateColumn:_cateColumn,
    cateData:_cateData,
    options:_option,
    getPropsValue:_defaultValue,
    validateStatus:_status,
    fileList:fileList,
    result:0,
    loading:1
}