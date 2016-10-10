/**
 * Created by Liya on 2016/6/3.
 */
import React, {PropTypes} from 'react'

import OperationBtn from '../../react/views/Menu/menuBtn'
const table_columns = [

  {title:'菜单名称',dataIndex:'name',key:'name'},
  {title:'type',dataIndex:'type',key:'type'},
  {title:'url',dataIndex:'url',key:'url'},
  {title:'管理',dataIndex:'admin1',key:'operation',

    render(text, record){
      return (
          <OperationBtn record={record}></OperationBtn>
      );
    }}
];






const _validateStatus={
  name:'',
  url:'',
  type:''
}



export default {

  tableColumn: table_columns,
  tableData: [],
  isShowEditBox:false,
  defaultValue:[],
  validateStatus:_validateStatus
}