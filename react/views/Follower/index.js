import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Icon, Input, Button, Select, Table} from 'antd';
const Option = Select.Option;

import {getFollowers} from '../../actions/follwer'

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

class Follower extends React.Component {

    constructor(props) {
        super(props)
    }

    handleChange(value) {
        console.log(`selected ${value}`);
    }

    render() {

        return (
            <div>
                <h1>微信粉丝管理</h1>
                <div style={{marginTop:'10px'}}>

                    <Input style={{width:'150px', marginRight:'5px'}} placeholder="请输入关键词搜索"></Input>
                    <Button type="primary" shape="circle" style={{marginRight:'20px'}}>
                        <Icon type="search" />
                    </Button>

                    <Select defaultValue="cat" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                        <Option value="cat">分类过滤</Option>
                        <Option value="area">地区</Option>
                        <Option value="all">所有</Option>
                    </Select>
                </div>

                <div style={{marginTop:'10px'}}>
                    <Table rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData}/>
                </div>
            </div>

        )
    }
    componentWillMount(){
        this.props.getFollowers();
    }
}

Follower.contextTypes = contextTypes;
function mapStateToProps(state){

    return{
        tableColumn:state.follower.tableColumn,
        tableData:state.follower.tableData

    }
}
function mapDispatchToProps(dispatch){
    return{
        getFollowers:bindActionCreators(getFollowers,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Follower)

