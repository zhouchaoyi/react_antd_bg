import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import {showBox} from '../../actions/movie'

class AddUserForm extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.showBox(false)
    }


    render() {
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    {...formItemLayout}
                    label="用户名：">
                    <p className="ant-form-text" id="userName" name="userName">大眼萌 minion</p>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码：">
                    <Input type="password" {...getFieldProps('pass')} placeholder="请输入密码"/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="您的性别：">
                    <RadioGroup {...getFieldProps('gender', {initialValue: 'female'})}>
                        <Radio value="male">男的</Radio>
                        <Radio value="female">女的</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注："
                    help="随便写点什么">
                    <Input type="textarea" placeholder="随便写" {...getFieldProps('remark')} />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span>卖身华府 <Tooltip title="我为秋香"><Icon type="question-circle-o" /></Tooltip> ：</span>}>
                    <label>
                        <Checkbox {...getFieldProps('agreement')} />同意
                    </label>
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">确定</Button>
                </FormItem>

            </Form>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        showBox: bindActionCreators(showBox, dispatch)
    }
}

AddUserForm= Form.create()(AddUserForm)


export default connect(null,mapDispatchToProps)(AddUserForm) ;

