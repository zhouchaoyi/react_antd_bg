/**
 * Created by Liya on 2016/5/16.
 */
import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,Upload,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import {showBox,addWhitePage} from '../../actions/whitePage'

class AddWhitePageForm extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                this.props.addWhitePage(this.props.form.getFieldsValue());
                this.props.form.resetFields();
                this.props.showBox(false)
            }

        });



    }
    handleBack(){
        this.props.showBox(false)
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
        const props=this.props;
        const uploadProps = {
            name: 'whiteFile',
            action: '/api/v1/whitePageUpload',
            data:{
                filename:'test'
            },
            beforeUpload(file) {
                console.log("文件类型：",file.type)
                const isJPG = file.type === 'application/pdf';
                if (!isJPG) {
                    message.error('只能上传 PDF文件哦！');
                }
                return isJPG;
            },
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                console.log(info);
                if (info.file.status === 'done') {
                    props.form.getFieldProps("Url",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                }
            },


        };
        return (

            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    {...formItemLayout}
                    label="产品名称："
                    hasFeedback
                    validateStatus={ this.props.validateStatus.name}
                    required
                    help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                    >
                    <Input type="text" {...nameProps } placeholder="请输入名称"/>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="文件：">
                    <Upload {...uploadProps}>
                        <Button type="ghost">
                            <Icon type="upload" /> 点击上传文件
                        </Button>
                        <p style={{color:'red'}}>只能上传pdf文件</p>
                    </Upload>
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">添加</Button>
                    <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                </FormItem>

            </Form>
        );
    }
}

function mapStateToProps(state) {
    return {

        options:state.whitePage.options,
        validateStatus:state.whitePage.validateStatus

    }
}
function mapDispatchToProps(dispatch) {
    return {
        showBox: bindActionCreators(showBox, dispatch),
        addWhitePage:bindActionCreators(addWhitePage,dispatch),

    }
}

AddWhitePageForm= Form.create()(AddWhitePageForm)


export default connect(mapStateToProps,mapDispatchToProps)(AddWhitePageForm) ;

