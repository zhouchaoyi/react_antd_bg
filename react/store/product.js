import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import OperationBtn from '../views/Product/operationBtn'
import ProductCateBtn from '../views/Product/productCateBtn'
import ProductBtn from '../views/Product/productBtn'
const table_columns = [

    {title:'类别',dataIndex:'Cate',key:'Cate'},
    {title:'系列',dataIndex:'Name',key:'Name'},
    {title:'系列图片',dataIndex:'Pic',key:'Pic',render(text, record){
        return( <div><img src={"\\"+record.Pic} width="120px" /></div>)
    }},
    {title:'管理',dataIndex:'admin1',key:'operation',

        render(text, record){
        return (
            <OperationBtn record={record}></OperationBtn>
        );
    }}
];

const table_data = [
];
const _category=[


]

const   _status= {
    cate: "",
    name: "",
    publisher:"",
    seriesName:'',


}


//类别管理
const _cateColumn=[
    {title:'类别名称',dataIndex:'Name',key:'Name'},
    {title:'图片',dataIndex:'Pic',key:'Pic',render(text, record){
        return( <div><img src={"../"+record.Pic} width="120px" /></div>)
    }},
    {title:'管理',dataIndex:'admin1',key:'operation',

        render(text, record){
            return (
                <ProductCateBtn cateRecord={record}></ProductCateBtn>

            );
        }}
]
const _defaultValue=[

]
const  _cateData=[

]
const _productColumn=[
    {title:'产品名称',dataIndex:'Name',key:'Name'},
    {title:'系列名称',dataIndex:'SeriesName',key:'Pic'},
    {title:'管理',dataIndex:'admin1',key:'operation',

        render(text, record){
            return (
                <ProductBtn productRecord={record}></ProductBtn>

            );
        }}
]
const _productData=[

]
export default {
    msg: 'hello product',
    isShowBox: false,
    tableColumn: table_columns,
    tableData: table_data,//系列
    cateColumn:_cateColumn,
    cateData:_cateData,//类别
    productColumn:_productColumn,
    productData:_productData,//产品
    loading: 0,
    result:0,
    options:_category,
    validateStatus:_status,
    getPropsValue:_defaultValue,
}