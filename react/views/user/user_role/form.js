/**
 * Created by zhouchaoyi on 2016/10/18.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Checkbox,Modal,Spin} from 'antd';
import {addUserType,showBox,updateUserType,showSaving} from '../../../actions/user_type'

const FormItem = Form.Item;

class UserTypeForm extends React.Component {

    // componentWillMount(){
    //     console.log("componentWillMount=<<<<<<<<")
    // }

    // componentWillReceiveProps(nextProps) {
    //     console.log("componentWillReceiveProps=<<<<<<<<")
    // }
    
    // componentWillUpdate(nextProps, nextState) {
    //     console.log("componentWillUpdate<<<<<<<<<");
    // }

    handleSubmit(e){
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                let data = this.props.form.getFieldsValue();
                this.props.showSaving(true);
                if(this.props.userTypeProp.typeId && this.props.userTypeProp.typeId!="") {
                    data.id = this.props.userTypeProp.typeId;
                    this.props.updateUserType(data);
                }else {
                    this.props.addUserType(data);
                }
                setTimeout(()=>this.props.form.resetFields(),1000);
            }
        });
    }

    handleBack(){
        this.props.form.resetFields();
        this.props.showBox(false);
    }

    handleCancel(){
        this.props.form.resetFields();
        this.props.showBox(false);
    }
    handleOk(){
        this.props.form.resetFields();
        this.props.showBox(false);
    }

    render() {
        const { getFieldDecorator, getFieldError, isFieldValidating,setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
        <Modal title="角色编辑" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}  footer="">
            <Spin spinning={this.props.saving} tip="保存中...">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="角色编号："
                        hasFeedback
                        >
                        {getFieldDecorator('code', {
                            initialValue: this.props.userTypeProp.typeCode,
                            rules: [
                                { required: true, min: 1, message: '编号不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="角色名称："
                        hasFeedback
                        >
                        {getFieldDecorator('name', {
                            initialValue: this.props.userTypeProp.typeName,
                            rules: [
                                { required: true, min: 1, message: '名称不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="备注："
                    >
                        {getFieldDecorator('remark',{
                            initialValue: this.props.userTypeProp.remark
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="状态："
                    >
                        {getFieldDecorator('status',{
                            valuePropName: 'checked',
                            initialValue: this.props.userTypeProp.status=="1"?true:false
                        })(
                            <Checkbox >
                                启用角色
                            </Checkbox>
                        )}
                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>关闭</Button>
                    </FormItem>

                </Form>
            </Spin>
        </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isShowBox:state.user_type.isShowBox,
        userTypeProp: state.user_type.userTypeProp,
        saving: state.user_type.saving
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addUserType:bindActionCreators(addUserType,dispatch),
        showBox:bindActionCreators(showBox,dispatch),
        updateUserType:bindActionCreators(updateUserType,dispatch),
        showSaving:bindActionCreators(showSaving,dispatch)
    }
}

UserTypeForm= Form.create()(UserTypeForm)


export default connect(mapStateToProps,mapDispatchToProps)(UserTypeForm) ;