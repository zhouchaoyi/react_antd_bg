/**
 * Created by Liya on 2016/5/16.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';

import {getAllActivity} from '../../actions/activity'

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

class Activity extends React.Component{

    render() {
        return (
            <div>
                <h2>活动管理</h2>
                <div style={{marginTop:'10px'}}>
                    <Input  style={{width:'150px',marginRight:'5px'}} placeholder="请输入关键词" />
                    <Button type="primary" shape="circle" style={{marginRight:'15px'}}>
                        <Icon type="search" />
                    </Button>


                </div>
                <div style={{marginTop:'10px'}}> <Link to="/addActivity">  <Icon type="plus"/>  添加活动</Link></div>
                <div style={{marginTop:'10px'}}>
                    <Table rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData} >

                    </Table>


                </div>

            </div>
        )
    }
    componentDidMount(){
        this.props.getAllActivity();
        //this.props.getCategory();
    }

}




//-------------------- 数据和操作的绑定 ----------------------------------------------------
// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        tableColumn: state.activity.tableColumn,
        tableData: state.activity.tableData

    }
}
// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        getAllActivity:bindActionCreators(getAllActivity,dispatch)


    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Activity)