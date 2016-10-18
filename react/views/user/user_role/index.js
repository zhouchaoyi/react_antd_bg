/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Icon, Input, Button, Select, Table,Modal,Form,Checkbox} from 'antd';
const FormItem = Form.Item;

const Option = Select.Option;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

import {getUserType,showBox,addUserType,isExistUserByName} from '../../../actions/user_type'




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

class UserType extends React.Component {

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
                this.props.addUserType(this.props.form.getFieldsValue());
                this.props.showBox(false);
                this.props.getUserType(); //刷新列表
            }

        });

    }
    handleBack(){
        this.props.showBox(false)
    }


    render() {
        const { getFieldDecorator, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        
        return (
            <div>
                <h1>用户类型</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.onShowBox.bind(this)}>
                        <Icon type="plus"/>
                        添加角色
                    </Button>
                    <Button type="ghost" style={{marginLeft:'10px'}} onClick={this.onShowBox.bind(this)}>
                       <Icon type="delete" />
                        批量删除
                    </Button>
                    <Modal title="角色编辑" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}  footer="">
                            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                                <FormItem
                                    {...formItemLayout}
                                    label="角色编号："
                                    hasFeedback
                                    >
                                    {getFieldDecorator('code', {
                                        rules: [
                                            { required: true, min: 1, message: '编号不能为空' }
                                        ]
                                    })(
                                        <Input type="text"/>
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="角色名称："
                                    hasFeedback
                                    >
                                    {getFieldDecorator('name', {
                                        rules: [
                                            { required: true, min: 1, message: '名称不能为空' }
                                        ]
                                    })(
                                        <Input type="text" />
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="备注："
                                >
                                    {getFieldDecorator('remark',{
                                        initialValue: ""
                                    })(
                                        <Input type="text" />
                                    )}
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="状态："
                                >
                                    {getFieldDecorator('status',{
                                        initialValue: false
                                    })(
                                        <Checkbox>启用角色</Checkbox>
                                    )}
                                </FormItem>

                                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                                    <Button type="primary" htmlType="submit">保存</Button>
                                    <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                                </FormItem>

                            </Form>

                    </Modal>

                </div>

                <div style={{marginTop:'10px'}}>
                    <Table size="small" rowKey="typeId" rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData}/>
                </div>
            </div>

        )
    }
    componentWillMount(){
        this.props.getUserType();
    }

    componentWillReceiveProps(nextProps) {
        //console.log("come in componentWillReceiveProps <<<<<<<<<<");
        //this.props.getUserType();
    }
}

UserType.contextTypes = contextTypes;
function mapStateToProps(state) {

    return {
        tableColumn:state.user_type.tableColumn,
        tableData:state.user_type.tableData,
        isShowBox:state.user_type.isShowBox,
        validateStatus:state.user_type.validateStatus,
        isExist:state.user_type.isExist

    }
}
function mapDispatchToProps(dispatch) {
    return {
        getUserType:bindActionCreators(getUserType,dispatch),
        showBox:bindActionCreators(showBox,dispatch),
        addUserType:bindActionCreators(addUserType,dispatch),
        isExistUserByName:bindActionCreators(isExistUserByName,dispatch)
    }
}
UserType= Form.create()(UserType)

export default connect(mapStateToProps,mapDispatchToProps)(UserType)

