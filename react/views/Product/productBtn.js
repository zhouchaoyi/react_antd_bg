/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

import {deleteProduct} from '../../actions/product'
class ProductBtn extends React.Component{

    handleDelete(e){
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
               props.deleteProduct(e.key);
            },
            onCancel() {},
        });

    }

        render(){
            const record=this.props.productRecord
            return(
                <div>
                    <a onClick={this.handleDelete.bind(this,record)}>删除</a>
                    <span className="ant-divider"></span>
                    <Link to={{pathname:"/editProduct/"+record.CategoryId+"/"+record.key}}>修改</Link>
                </div>
            )
        }

}

// 将 state 映射到页面中(放到props)


function mapDispatchToProps(dispatch) {
    return {
        deleteProduct:bindActionCreators(deleteProduct,dispatch),

    }
}

export default connect(null,mapDispatchToProps)(ProductBtn)
