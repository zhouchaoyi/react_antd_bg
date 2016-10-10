/**
 * Created by Liya on 2016/6/1.
 */

import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {delUser,showEditBox,isExistUserByName,editUser,showResetBox} from '../../actions/manage'
import ResetPwd from './resetPwd'

import {Icon, Input, Button, Select, Table,Modal,Form} from 'antd';
const FormItem = Form.Item;
const  confirm=Modal.confirm


function noop() {
    return false;
}

class OperaBtn extends React.Component{
    handleDelete(e){
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.delUser(e.Id);
            },
            onCancel() {},
        });

    }
    onShowEditBox(e){
        this.props.showEditBox(true,e)
    }
    onShowResetBox(e){
        this.props.showResetBox(true,e)
    }

    handleOk(){
        this.props.showEditBox(false,"")

    }
    handleCancel(){
        this.props.showEditBox(false,"")

    }
    handleBack(){
        this.props.showEditBox(false,"")

    }
    handleEditSubmit(e){
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{


                this.props.editUser(this.props.defaultValue.Id,this.props.form.getFieldsValue());
                this.props.showEditBox(false,"")

            }

        });
    }

    userExists(rule, value, callback) {

        if (!value) {
            callback();
        } else {
            this.props.isExistUserByName(value)
            setTimeout(() => {

                if (this.props.isExist) {

                    this.props.validateStatus.name="error"
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    this.props.validateStatus.name="success"
                    callback();
                }
            }, 1000);
        }
    }

        render(){
            const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
            const formItemLayout = {
                labelCol: {span: 6},
                wrapperCol: {span: 14},
            };

            const record=this.props.record;
            var adminOrNot=false
            if(record.Name=="admin" && record.Id==1 ){
                adminOrNot=true
            }else{
                adminOrNot=false
            }

            const nameProps = getFieldProps('Name', {
                rules: [
                    { required: true, min: 1, message: '用户名至少为 1个字符' },
                    { validator: this.userExists.bind(this) },
                ],
                initialValue:this.props.defaultValue.Name,
                onChange: (e) => {
                    const value=e.target.value;
                    if(value.length<1){
                        this.props.validateStatus.name="error"
                    }else{
                        this.props.validateStatus.name="success"
                    }
                }
            });

            return(
                <div>

                    {adminOrNot?"": <a onClick={this.handleDelete.bind(this,this.props.record)}>删除</a>}
                    {adminOrNot?"": <span className="ant-divider"></span>}
                    {adminOrNot?"":<a onClick={this.onShowEditBox.bind(this,this.props.record)}>编辑</a>}
                    {adminOrNot?"":<span className="ant-divider"></span>}
                     <a onClick={this.onShowResetBox.bind(this,this.props.record)}>密码重置</a>

                    <Modal title="修改用户名" visible={this.props.isShowEditBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}  footer="">
                        <Form horizontal onSubmit={this.handleEditSubmit.bind(this)}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名："
                                hasFeedback
                                validateStatus={ this.props.validateStatus.name}
                                required
                                help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                                >
                                <Input type="text" {...nameProps } placeholder="请输入用户名"/>
                            </FormItem>


                            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                                <Button type="primary" htmlType="submit">修改</Button>
                                <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                            </FormItem>

                        </Form>

                    </Modal>


                    <Modal title="重置密码" visible={this.props.isShowPwdBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}  footer="">
                        <ResetPwd></ResetPwd>
                    </Modal>





                </div>
            )
        }

}
function mapStateToProps(state){
    return{
        isShowEditBox:state.manage.isShowEditBox,
        isShowPwdBox:state.manage.isShowPwdBox,
        validateStatus:state.manage.validateStatus,
        defaultValue:state.manage.defaultValue,
        isExist:state.manage.isExist
    }
}
function mapDispatchToProps(dispatch){
    return{
        delUser:bindActionCreators(delUser,dispatch),
        showEditBox:bindActionCreators(showEditBox,dispatch),
        showResetBox:bindActionCreators(showResetBox,dispatch),
        isExistUserByName:bindActionCreators(isExistUserByName,dispatch),
        editUser:bindActionCreators(editUser,dispatch)
    }
}

OperaBtn= Form.create()(OperaBtn)
export default connect(mapStateToProps,mapDispatchToProps)(OperaBtn)
