/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

import {deleteWhitePage,showEditBox} from '../../actions/whitePage'
import EditWhitePage from './editWhitePage'
class OperationBtn extends React.Component{
    handleDelete(e){
        console.log(e)
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deleteWhitePage(e.key);
            },
            onCancel() {},
        });

    }
    onShowEditBox(value){
        this.props.showEditBox(true,value)
    }
    handleOk(){
        this.props.showEditBox(false,'');
    }
    handleCancel(){
        this.props.showEditBox(false,'');
    }
    render(){
        return(
            <div>

                <a  onClick={this.handleDelete.bind(this,this.props.whitePageRecord)}>删除{this.props.record}</a>
                <span className="ant-divider"></span>
                <a href="#" onClick={this.onShowEditBox.bind(this,this.props.whitePageRecord)} >修改</a>
                <Modal title="修改白皮书" visible={this.props.isShowEditBox} onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}  footer="">
                    <EditWhitePage></EditWhitePage>

                </Modal>
            </div>
        )
    }
}

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        isShowEditBox:state.whitePage.isShowEditBox
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteWhitePage:bindActionCreators(deleteWhitePage,dispatch),
        showEditBox:bindActionCreators(showEditBox,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OperationBtn)
