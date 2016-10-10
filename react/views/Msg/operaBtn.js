/**
 * Created by Liya on 2016/6/7.
 */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal,Form} from 'antd';
const FormItem = Form.Item;

import {showBox,sendText} from '../../actions/msg'

class operaBtn extends React.Component{
    delete(){
        console.log("删除")
    }
    onShow(value){
        console.log("value:",value)
        this.props.showBox(true,value)
    }
    handleCancel(){
        this.props.showBox(false,"")
    }
    handleOk(){
        this.props.showBox(false,"")
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.sendText(this.props.form.getFieldsValue())
        this.props.showBox(false,"")
        this.props.form.resetFields()
    }
    render(){
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const  formItemLayout={
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        }
        const record=this.props.msg;
        return (
            <div>
                <a onClick={this.onShow.bind(this,record)}>回复</a>
                <span className="ant-divider"></span>
                <a onClick={this.delete.bind(this,record)}>删除</a>
                <Modal title="回复" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}  footer="">
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem
                            {...formItemLayout}
                            label="备注名："

                            >
                            <Input type="text" {...getFieldProps("openid",{initialValue:this.props.defaultValue.openid}) } placeholder="备注"/>
                            <Input type="textarea"  rows={4} {...getFieldProps("remark")} placeholder="回复文字"/>
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" >回复</Button>
                            <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleCancel.bind(this)}>返回</Button>
                        </FormItem>

                    </Form>
                </Modal>
            </div>
        )
    }

}
function mapStateToProps(state){
    console.log("state.follower.defaultValue",state.follower.isShowBox)
    return{
        isShowBox:state.msg.isShowBox,
        defaultValue:state.msg.defaultValue
    }
}
function mapDispatchToProps(dispatch){
    return{
        sendText:bindActionCreators(sendText,dispatch),
        showBox:bindActionCreators(showBox,dispatch)
    }
}
operaBtn=Form.create()(operaBtn)
export default connect(mapStateToProps,mapDispatchToProps)(operaBtn)


