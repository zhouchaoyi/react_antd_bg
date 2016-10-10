import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button,  Icon,Select,Upload,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import {showBox,addProductCate} from '../../actions/product'


class AddProductCateForm extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                this.props.addProductCate(this.props.form.getFieldsValue());
                this.props.form.resetFields();
                this.props.showBox(false)
            }

        });



    }


    handleBack(e){
        e.preventDefault();
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
                { required: true, min: 1, message: '用户名至少为 1个字符' }
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
        const  props=this.props;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/productUpload',
            data:{
                filename:'test'
            },
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {

                if (info.file.status !== 'uploading') {
                    //console.log(info.file.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    props.form.getFieldProps("Pic",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                }
            }
        };


        return (

            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    {...formItemLayout}
                    label="类别名称："
                    hasFeedback
                    validateStatus={ this.props.validateStatus.name}
                    required
                    help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                    >
                    <Input type="text" {...nameProps } placeholder="请输入类别名称"/>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="类别图片：">

                    <Upload {...uploadProps}>
                        <Button type="ghost">
                            <Icon type="upload" /> 点击上传
                        </Button>
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

        options:state.product.options,
        validateStatus:state.product.validateStatus

    }
}
function mapDispatchToProps(dispatch) {
    return {
        showBox: bindActionCreators(showBox, dispatch),
        addProductCate:bindActionCreators(addProductCate,dispatch)

    }
}
AddProductCateForm.contextTypes={
    router:PropTypes.object.isRequired
}


AddProductCateForm= Form.create()(AddProductCateForm)


export default connect(mapStateToProps,mapDispatchToProps)(AddProductCateForm) ;

