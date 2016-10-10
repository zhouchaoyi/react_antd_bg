import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Icon, Input, Button, Select, Table} from 'antd';
const Option = Select.Option;


import {getAllMsg} from '../../actions/msg'

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


//---------------------table---------------------------

// 通过 rowSelection 对象表明需要行选择
const rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    }
};



//---------------------table---------------------------

class Msg extends React.Component {

    constructor(props) {
        super(props)
    }

    handleChange(value) {
        console.log(`selected ${value}`);
    }

    render() {

        return (
            <div>
                <h1>微信消息管理</h1>

                <div style={{marginTop:'10px'}}>
                    <p style={{marginBottom:'5px'}}>全部消息(文字消息保存5天，其它类型消息只保存3天)</p>
                    <Input style={{width:'150px', marginRight:'5px'}} placeholder="请输入关键词搜索"></Input>
                    <Button type="primary" shape="circle" style={{marginRight:'20px'}}>
                        <Icon type="search" />
                    </Button>

                    <Select defaultValue="3" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                        <Option value="lastFive">最近五天</Option>
                        <Option value="today">今天</Option>
                        <Option value="yesterday">昨天</Option>
                        <Option value="beforeYesterday">前天</Option>
                        <Option value="earlier">更早</Option>
                    </Select>
                </div>

                <div style={{marginTop:'10px'}}>
                    <Table rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData}/>
                </div>
            </div>

        )
    }
    componentWillMount(){
        this.props.getAllMsg()
    }
}
function mapStateToProps(state){
    return{
        tableColumn:state.msg.tableColumn,
        tableData:state.msg.tableData
    }
}
function mapDispatchToProps(dispatch){
    return{
        getAllMsg:bindActionCreators(getAllMsg,dispatch)
    }
}

Msg.contextTypes = contextTypes;

export default connect(mapStateToProps,mapDispatchToProps)(Msg)

