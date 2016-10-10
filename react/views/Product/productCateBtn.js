/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

import {deleteProductCate,showEditBox} from '../../actions/product'
import EditProductCate from './editProductCate'
class ProductCateBtn extends React.Component{

    handleDelete(e){
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deleteProductCate(e.key);
            },
            onCancel() {},
        });

    }
    handleEditBoxOk(){

        this.props.showEditBox(false,'');
    }
    handleEditBoxCancel() {

        this.props.showEditBox(false,'');
    }

    onShowEditBox(value){
        this.props.showEditBox(true,value)
    }
        render(){
            return(
                <div>
                    <a onClick={this.handleDelete.bind(this,this.props.cateRecord)}>删除</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={this.onShowEditBox.bind(this,this.props.cateRecord)} >修改</a>

                    <Modal title="修改产品类别" visible={this.props.isShowEditBox} onOk={this.handleEditBoxOk.bind(this)}
                           onCancel={this.handleEditBoxCancel.bind(this)}  footer="">
                        <EditProductCate></EditProductCate>

                    </Modal>


                </div>
            )
        }
}

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        isShowEditBox: state.product.isShowEditBox
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteProductCate:bindActionCreators(deleteProductCate,dispatch),
        showEditBox:bindActionCreators(showEditBox,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductCateBtn)
