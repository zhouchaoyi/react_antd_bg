/**
 * Created by Liya on 2016/5/16.
 */



import React, {PropTypes} from 'react'
import OperationBtn from '../views/Activity/operationBtn'
const table_columns = [

  
    {title:'名称',dataIndex:'Name',key:'Name'},
    {title:'地点',dataIndex:'Address',key:'Address'},
    {title:'活动年份',dataIndex:'Year',key:'Year'},
    {title:'活动日期',dataIndex:'Date',key:'Date'},
    {title:'管理',dataIndex:'admin',key:'option',

        render(text, record){

            return (
                <OperationBtn activityRecord={record}></OperationBtn>
            );
        }}
];


const table_data = [

];


const _defaultValue=[

]
const   _status= {

    name: "",
    year:'',
    date:'',
    address:''


}
export default {
    msg: 'hello activity',
    isShowBox: false,
    tableColumn: table_columns,
    tableData: table_data,
    getPropsValue:_defaultValue,
    validateStatus:_status,



}