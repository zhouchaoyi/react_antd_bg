/**
 * Created by Liya on 2016/5/11.
 */
import React, {PropTypes}from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

import {deleteSeries} from '../../actions/product'
class OperationBtn extends React.Component{

    handleDelete(e){
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deleteSeries(e.key);
            },
            onCancel() {},
        });

    }
        render(){
            const record=this.props.record
            console.log(record)
            return(
                <div>
                    <Link to={{pathname:"products/"+record.CategoryId+'/'+record.key}}>产品管理</Link>
                    <span className="ant-divider"></span>
                    <a onClick={this.handleDelete.bind(this,record)}>删除</a>
                    <span className="ant-divider"></span>
                    <Link to={{pathname:"editSeries/"+record.key}}>修改</Link>
                </div>
            )
        }
}

// 将 state 映射到页面中(放到props)


function mapDispatchToProps(dispatch) {
    return {
        deleteSeries:bindActionCreators(deleteSeries,dispatch),

    }
}
OperationBtn.contextTypes={
    router:PropTypes.object.isRequired
}
export default connect(null,mapDispatchToProps)(OperationBtn)
