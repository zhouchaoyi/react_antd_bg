/**
 * Created by Liya on 2016/5/16.
 */

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

import {deleteActivity} from '../../actions/activity'
class OperationBtn extends React.Component{
    handleDelete(e){
        console.log(e)
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deleteActivity(e.key);
            },
            onCancel() {},
        });

    }

    render(){
        return(
            <div>

                <a onClick={this.handleDelete.bind(this,this.props.activityRecord)} >删除{this.props.record}</a>
                <span className="ant-divider"></span>
                <Link to={{pathname:"editActivity/"+this.props.activityRecord.key}}>修改</Link>

            </div>
        )
    }
}

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteActivity:bindActionCreators(deleteActivity,dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OperationBtn)
