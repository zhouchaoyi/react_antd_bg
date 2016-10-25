/**
 * Created by zhouchaoyi on 2016/10/18.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Checkbox,Modal,Spin,Select,Radio} from 'antd';
import {addItem,queryItemById,updateItem,showSaving,reset} from '../../../actions/admin_list'
import {getQueryString} from '../../../utils'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class AdminForm extends React.Component {

    componentWillMount(){
        //console.log("componentWillMount=<<<<<<<<")
        let id = getQueryString("id");
        if(id && id.length>0) {
            this.props.queryItemById(id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            this.context.router.replace('/template/user/admin_list');
        }
    }
    
    handleSubmit(e){
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                let data = this.props.form.getFieldsValue();
                //console.log(data);
                this.props.showSaving(true);
                if(this.props.itemProp.userId && this.props.itemProp.userId!="") {
                    data.id = this.props.itemProp.userId;
                    data.userType = "admin";
                    this.props.updateItem(data);
                }else {
                    data.userType = "admin";
                    this.props.addItem(data);
                }
            }
        });
    }

    handleBack(e){
        this.props.reset();
        this.context.router.replace('/template/user/admin_list');
    }

    render() {
        const { getFieldDecorator, getFieldError, isFieldValidating,setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 10},
        };
        return (
            <Spin spinning={this.props.saving} tip="保存中...">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="登录名："
                        >
                        {getFieldDecorator('loginName', {
                            initialValue: this.props.itemProp.loginName,
                            rules: [
                                { required: true, min: 1, message: '登录名不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="密码："
                        >
                        {getFieldDecorator('loginPassword', {
                            initialValue: this.props.itemProp.loginPassword,
                            rules: [
                                { required: true, min: 1, message: '密码不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="用户名："
                    >
                        {getFieldDecorator('userName',{
                            initialValue: this.props.itemProp.userName,
                            rules: [
                                { required: true, min: 1, message: '用户名不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="证件名称："
                    >
                        {getFieldDecorator('idCardType',{
                            initialValue: this.props.itemProp.idCardType+""
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value="0">身份证</Option>
                                <Option value="1">军官证</Option>
                                <Option value="2">港澳台居民证</Option>
                                <Option value="3">护照</Option>
                                <Option value="4">其他</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="证件号码："
                    >
                        {getFieldDecorator('idCard',{
                            initialValue: this.props.itemProp.idCard
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="性别："
                    >
                        {getFieldDecorator('sex',{
                            initialValue: this.props.itemProp.sex+""
                        })(
                            <RadioGroup>
                                <Radio key="0" value="0">男</Radio>
                                <Radio key="1" value="1">女</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="公共账号："
                    >
                        {getFieldDecorator('publicAccount',{
                            valuePropName: 'checked',
                            initialValue: this.props.itemProp.publicAccount=="1"?true:false
                        })(
                            <Checkbox >
                                设为系统公共账户，允许重复登录
                            </Checkbox>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="状态："
                    >
                        {getFieldDecorator('status',{
                            valuePropName: 'checked',
                            initialValue: this.props.itemProp.status=="1"?true:false
                        })(
                            <Checkbox >
                                账户可用
                            </Checkbox>
                        )}
                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{marginLeft:"40px"}}  onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>

                </Form>
            </Spin>
        )
    }
}

AdminForm.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        isShowBox:state.admin_list.isShowBox,
        itemProp: state.admin_list.itemProp,
        saving: state.admin_list.saving,
        reloadGrid: state.admin_list.reloadGrid
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addItem:bindActionCreators(addItem,dispatch),
        queryItemById:bindActionCreators(queryItemById,dispatch),
        updateItem:bindActionCreators(updateItem,dispatch),
        showSaving:bindActionCreators(showSaving,dispatch),
        reset:bindActionCreators(reset,dispatch)
    }
}

AdminForm= Form.create()(AdminForm);


export default connect(mapStateToProps,mapDispatchToProps)(AdminForm);