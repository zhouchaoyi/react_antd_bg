/**
 * Created by Liya on 2016/5/17.
 */
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import {Select,Input,Button,Icon,Table} from 'antd'

import {getPic} from '../../actions/material'
import {getCategory} from '../../actions/product'
//选择操作，全选，反选
var rowSelection={
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    }
}

class Pic extends React.Component{
    handleChange(value){
        this.props.getPic(value)
    }
    render(){
        return(
            <div>
                <h2 style={{marginBottom:'20px'}}>图片管理</h2>
                <div style={{marginTop:'10px'}}>
                 
                     <Link to="/material/addPic" style={{marginLeft:'10px'}}>  <Icon type="plus"/>  添加图片</Link>
                </div>
                <div style={{marginTop:'20px'}}>

                    <Table  rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData} >

                    </Table>
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.props.getPic("")


     
    }
}
function mapStateToProps(state){
    return{
        tableColumn: state.material.tableColumn,
        tableData: state.material.tableData,
        options:state.product.options,

    }
}
function mapDispatchToProps(dispatch){
    return{
        getCategory:bindActionCreators(getCategory,dispatch),
        getPic:bindActionCreators(getPic,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (Pic)
