/**
 * Created by Liya on 2016/6/7.
 */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {showBox,updateRemark} from '../../actions/follwer'
import {Icon, Input, Button, Select, Table,Spin,Modal,Form} from 'antd';
const FormItem = Form.Item;

class operaBtn extends React.Component{

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
        this.props.updateRemark(this.props.form.getFieldsValue())
        this.props.showBox(false,"")
        this.props.form.resetFields()
    }
    render(){
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const  formItemLayout={
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        }
        const record=this.props.follwer;
        return (
            <div>
                <a onClick={this.onShow.bind(this,record)}>编辑备注</a>

                <Modal title="编辑备注" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}  footer="">
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem
                            {...formItemLayout}
                            label="备注名："

                            >
                            <Input type="hidden" {...getFieldProps("openid",{initialValue:this.props.defaultValue.openid}) } placeholder="备注"/>
                            <Input type="text" {...getFieldProps("remark",{initialValue:this.props.defaultValue.remark}) } placeholder="备注"/>
                        </FormItem>

                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" >修改</Button>
                            <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleCancel.bind(this)}>返回</Button>
                        </FormItem>

                    </Form>
                </Modal>
            </div>
        )
    }

}
function mapStateToProps(state){
    console.log("state.follower.defaultValue",state.follower.defaultValue)
    return{
        isShowBox:state.follower.isShowBox,
        defaultValue:state.follower.defaultValue
    }
}
function mapDispatchToProps(dispatch){
    return{
        updateRemark:bindActionCreators(updateRemark,dispatch),
        showBox:bindActionCreators(showBox,dispatch)
    }
}
operaBtn=Form.create()(operaBtn)
export default connect(mapStateToProps,mapDispatchToProps)(operaBtn)


