/**
 * Created by Liya on 2016/5/16.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';


import {getWhitePage,showBox} from '../../actions/whitePage'

import AddWhitePageForm from './addWhitePage'

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


class WhitePage extends React.Component{
    handleChange(e){

    }
    onShowBox(){
    this.props.showBox(true)
    }
    handleOk(){
        this.props.showBox(false)
    }
    handleCancel(){
        this.props.showBox(false)
    }
    render() {
        return (
            <div>
                <h2>白皮书</h2>
                <div style={{marginTop:'10px'}}>
                    <Button type="primary" onClick={this.onShowBox.bind(this)}>
                        <Icon type="plus"/>
                        添加白皮书
                    </Button>
                    <Input  style={{width:'150px',marginRight:'5px',marginLeft:'15px'}} placeholder="请输入关键词" />
                    <Button type="primary" shape="circle" style={{marginRight:'15px'}}>
                        <Icon type="search" />
                    </Button>

                </div>
                <div style={{marginTop:'10px'}}>



                    <Modal title="添加白皮书" visible={this.props.isShowBox} onOk={this.handleOk.bind(this) }
                           onCancel={this.handleCancel.bind(this)} footer="">
                        <AddWhitePageForm></AddWhitePageForm>

                    </Modal>


                    <Table  rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData} >

                    </Table>


                </div>

            </div>
        )
    }
    componentDidMount(){
        this.props.getWhitePage();
    }
}




//-------------------- 数据和操作的绑定 ----------------------------------------------------
// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        tableColumn: state.whitePage.tableColumn,
        tableData: state.whitePage.tableData,
        isShowBox: state.whitePage.isShowBox,

    }
}
// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {

        getWhitePage: bindActionCreators(getWhitePage, dispatch),
        showBox:bindActionCreators(showBox,dispatch),

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(WhitePage)