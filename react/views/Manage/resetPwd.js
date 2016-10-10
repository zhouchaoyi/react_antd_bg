/**
 * Created by Liya on 2016/6/1.
 */

import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {reset,showResetBox} from '../../actions/manage'

import {Icon, Input, Button, Select, Table,Modal,Form} from 'antd';
const FormItem = Form.Item;
const  confirm=Modal.confirm


function noop() {
    return false;
}

class ResetPwd extends React.Component{


    onShowResetBox(e){
        this.props.showResetBox(true,e)
    }

    handleOk(){

        this.props.showResetBox(false,"")
    }
    handleCancel(){

        this.props.showResetBox(false,"")
    }
    handleBack(){

        this.props.showResetBox(false,"")
    }

    handleResetPwd(e){
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                this.props.reset(this.props.defaultValue.Id,this.props.form.getFieldsValue());
                this.props.showResetBox(false,"")

            }

        });
    }

    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
        if (value) {
            console.log(value)
            validateFields(['rePasswd'], { force: true });
        }
        callback();
    }

    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('Pwd')) {
            this.props.validateStatus.rePwd="error"
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }
        render(){
            const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
            const formItemLayout = {
                labelCol: {span: 6},
                wrapperCol: {span: 14},
            };

            const passwdProps = getFieldProps('Pwd', {
                rules: [
                    { required: true, whitespace: true, message: '请填写密码' },
                    { validator: this.checkPass.bind(this) },
                ],
                onChange: (e) => {
                    const value=e.target.value;
                    if(value.length<1){
                        this.props.validateStatus.pwd="error"
                    }else{
                        this.props.validateStatus.pwd="success"
                        this.props.validateStatus.rePwd="error"
                    }
                }
            });
            const rePasswdProps = getFieldProps('rePasswd', {
                rules: [{
                    required: true,
                    whitespace: true,
                    message: '请再次输入密码',
                }, {
                    validator: this.checkPass2.bind(this),
                }],
                onChange: (e) => {
                    const value=e.target.value;
                    if(value.length<1){
                        this.props.validateStatus.rePwd="error"
                    }else{
                        this.props.validateStatus.rePwd="success"

                    }
                }

            });
            return(
                <div>

                    <Modal title="重置密码" visible={this.props.isShowPwdBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}  footer="">
                        <Form horizontal onSubmit={this.handleResetPwd.bind(this)}>


                            <FormItem
                                {...formItemLayout}
                                label="密码："
                                hasFeedback
                                validateStatus={ this.props.validateStatus.pwd}
                                required
                                help={isFieldValidating('Pwd') ? '校验中...' : (getFieldError('Pwd') || []).join(', ')}
                                >
                                <Input {...passwdProps} type="password" autoComplete="off"
                                                       />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="确认密码："
                                hasFeedback
                                validateStatus={ this.props.validateStatus.rePwd}
                                required
                                help={isFieldValidating('rePasswd') ? '校验中...' : (getFieldError('rePasswd') || []).join(', ')}

                                >
                                <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                                                          onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
                            </FormItem>



                            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                                <Button type="primary" htmlType="submit">提交</Button>
                                <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                            </FormItem>

                        </Form>

                    </Modal>





                </div>
            )
        }

}
function mapStateToProps(state){
    return{
        isShowPwdBox:state.manage.isShowPwdBox,
        defaultValue:state.manage.defaultValue,
        validateStatus:state.manage.validateStatus,

    }
}
function mapDispatchToProps(dispatch){
    return{

        showResetBox:bindActionCreators(showResetBox,dispatch),
        reset:bindActionCreators(reset,dispatch)
    }
}

ResetPwd= Form.create()(ResetPwd)
export default connect(mapStateToProps,mapDispatchToProps)(ResetPwd)
