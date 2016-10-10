/**
 * Created by Liya on 2016/6/1.
 */
import React, {PropTypes} from 'react'

import OperaBtn from '../views/Manage/operaBtn'

const _tableColumn = [
    {title: 'ID', dataIndex: 'Id',key:'Id'},

    {title: '用户名', dataIndex: 'Name',key:'Name'},

    {title: '管理', dataIndex: 'admin',key:'option',
        render(text,record){
        return(

            <OperaBtn record={record}></OperaBtn>

        )
    }}
];


const _tableData = [
    //{key:1,Id:'1',Name:'张三'},
    //{key:2,Id:'2',Name:'李四'},
];
const _validateStatus={
        name:'',
        pwd:'',
        rePwd:''
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