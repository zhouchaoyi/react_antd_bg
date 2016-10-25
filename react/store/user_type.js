/**
 * Created by zhouchaoyi on 2016/10/19.
 */
import React, {PropTypes} from 'react'

const _tableData = {
    pageSize: 10
};

const _userTypeProp = {
    typeId: "",
    typeCode: "",
    typeName: "",
    remark: "",
    status: "0"
}

export default{
    tableData:_tableData,
    isShowBox:false,
    reloadGrid: false,
    userTypeProp: _userTypeProp,
    loading: true,
    saving: false
}