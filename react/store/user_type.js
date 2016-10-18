/**
 * Created by Liya on 2016/6/1.
 */
import React, {PropTypes} from 'react'

import OperaBtn from '../views/Manage/operaBtn'

const _tableColumn = [
    {title: '角色名', dataIndex: 'typeName',key:'typeName',render: text => <a href="#">{text}</a>},

    {title: '描述', dataIndex: 'remark',key:'remark'},

    {title: '状态',dataIndex: 'status',key:'status',render: (text,record,index) => {
        //console.log(text);
        //console.log(record);
        //console.log(index);
        if(text=="1") {
            return <span style={{color:"green"}}>启用</span>
        }else if(text=="0") {
            return <span style={{color:"red"}}>禁用</span>
        }
    }},

    // {title: '操作', dataIndex: 'admin',key:'option',
    //     render(text,record){
    //     return(

    //         <OperaBtn record={record}></OperaBtn>

    //     )
    // }}
];


const _tableData = [
    //{key:1,Id:'1',Name:'张三'},
    //{key:2,Id:'2',Name:'李四'},
];
const _validateStatus={
        typeCode:'',
        typeName:''
}
export default{
    tableColumn:_tableColumn,
    tableData:_tableData,
    isShowBox:false,
    isShowEditBox:false,
    isShowPwdBox:false,
    validateStatus:_validateStatus,
    isExist:false,
    defaultValue:[]
}