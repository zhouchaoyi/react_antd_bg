/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';
const confirm = Modal.confirm;

import {deleteVideo,showEditBox} from '../../actions/video'
import EditVideo from './editVideo'
class OperationBtn extends React.Component{
    handleDelete(e){
        console.log(e)
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deleteVideo(e.key);
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
        const record=this.props.videoRecord
        console.log("record:",record)
        return(
            <div>

                <a  onClick={this.handleDelete.bind(this,record)}>删除{this.props.record}</a>
                <span className="ant-divider"></span>
                <a href="#" onClick={this.onShowEditBox.bind(this,record)} >修改</a>
                <Modal title="修改视频" visible={this.props.isShowEditBox} onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}  footer="">
                       <EditVideo></EditVideo>

                </Modal>
            </div>
        )
    }
}

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        isShowEditBox:state.video.isShowEditBox
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteVideo:bindActionCreators(deleteVideo,dispatch),
        showEditBox:bindActionCreators(showEditBox,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OperationBtn)
