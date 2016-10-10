/**
 * Created by Liya on 2016/5/17.
 */
import React, {PropTypes} from 'react'

import PicBtn from '../views/Material/picBtn'
import PosterBtn from '../views/Material/posterBtn'
import PageBtn from '../views/Material/pageBtn'
const table_columns = [

    {title:'类别',dataIndex:'Cate',key:'Cate'},
    {title:'系列',dataIndex:'Series',key:'Series'},
    {title:'名称',dataIndex:'Name',key:'Name'},
    {title:'操作',dataIndex:'admin',key:'option',

        render(text, record){

            return (
                <PicBtn picRecord={record}></PicBtn>
            );
        }}
];
const _posterColumns= [
    {title:'类别',dataIndex:'Series',key:'Series'},
    {title:'名称',dataIndex:'Name',key:'Name'},
    {title:'操作',dataIndex:'admin',key:'option',

        render(text, record){

            return (
                <PosterBtn posterRecord={record}></PosterBtn>
            );
        }}
];

const table_data = [

];
const _pageColumn=[

    {title:'名称',dataIndex:'Name',key:'Name'},
    {title:'操作',dataIndex:'admin',key:'option',

        render(text, record){

            return (
                <PageBtn pageRecord={record}></PageBtn>
            );
        }}
]

const  _defaultValue=[]
const   _status= {
    cate: "",
    name: "",
    posterName:'',
    posterSeries:'',
    pageName:''

}
const _fileList=[]

export default {
    msg: 'hello material',
    isShowBox: false,
    tableColumn: table_columns,
    tableData: table_data,
    getPropsValue:_defaultValue,
    validateStatus:_status,
    fileList:_fileList,
    posterColumns:_posterColumns,//海报
    posterData:[],
    pageColumn:_pageColumn,
    pageData:[]



}