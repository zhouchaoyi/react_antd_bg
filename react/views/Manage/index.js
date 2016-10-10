/**
 * Created by Liya on 2016/6/1.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Icon, Input, Button, Select, Table,Modal,Form} from 'antd';
const FormItem = Form.Item;

const Option = Select.Option;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

import {getUsers,showBox,addUser,isExistUserByName} from '../../actions/manage'




//---------------------table---------------------------

// 通过 rowSelection 对象表明需要行选择
const rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    }
};

function noop() {
    return false;
}


//---------------------table---------------------------

class Manage extends React.Component {

    constructor(props) {
        super(props)
    }

    onShowBox(e) {
      this.props.showBox(true)
    }
    handleCancel(){
        this.props.showBox(false)
    }
    handleOk(){
        this.props.showBox(false)
    }
    handleSubmit(e){
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{


                this.props.addUser(this.props.form.getFieldsValue());
                this.props.showBox(false)

            }

        });
    }
    handleBack(){
        this.props.showBox(false)
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


    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const nameProps = getFieldProps('Name', {
            rules: [
                { required: true, min: 1, message: '用户名至少为 1个字符' },
                { validator: this.userExists.bind(this) },
            ],
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.name="error"
                }else{
                    this.props.validateStatus.name="success"
                }
            }
        });
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
        return (
            <div>
                <h1>后台用户管理</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.onShowBox.bind(this)}>
                        <Icon type="plus"/>
                        添加用户
                    </Button>
                    <Modal title="添加用户" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}  footer="">
                            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
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


                                <FormItem
                                    {...formItemLayout}
                                    label="密码："
                                    hasFeedback
                                    validateStatus={ this.props.validateStatus.pwd}
                                    required
                                    help={isFieldValidating('Pwd') ? '校验中...' : (getFieldError('Pwd') || []).join(', ')}
                                    >
                                    <Input {...passwdProps} type="password" autoComplete="off"
                                                            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} />
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
                                    <Button type="primary" htmlType="submit">添加</Button>
                                    <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                                </FormItem>

                            </Form>

                    </Modal>

                </div>

                <div style={{marginTop:'10px'}}>
                    <Table rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData}/>
                </div>
            </div>

        )
    }
    componentWillMount(){
        this.props.getUsers();
    }
}

Manage.contextTypes = contextTypes;
function mapStateToProps(state) {

    return {
        tableColumn:state.manage.tableColumn,
        tableData:state.manage.tableData,
        isShowBox:state.manage.isShowBox,
        validateStatus:state.manage.validateStatus,
        isExist:state.manage.isExist

    }
}
function mapDispatchToProps(dispatch) {
    return {
        getUsers:bindActionCreators(getUsers,dispatch),
        showBox:bindActionCreators(showBox,dispatch),
        addUser:bindActionCreators(addUser,dispatch),
        isExistUserByName:bindActionCreators(isExistUserByName,dispatch)
    }
}
Manage= Form.create()(Manage)

export default connect(mapStateToProps,mapDispatchToProps)(Manage)

