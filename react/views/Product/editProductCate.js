import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,message,Modal,Upload} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

import {showEditBox,editProductCate} from '../../actions/product'

class EditProductCateForm extends React.Component {


    handleSubmit(e) {

        e.preventDefault();
        const props=this.props;
        console.log("表单提交的数据：",props.form.getFieldsValue())
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                props.editProductCate(props.defaultValue.Id,props.form.getFieldsValue());
                props.showEditBox(false,"")
                props.form.resetFields();

                //confirm({
                //    title: '您是否确认提交修改',
                //    onOk() {
                //        console.log("表单提交的数据：",props.form.getFieldsValue())
                //        props.editProductCate(props.defaultValue.Id,props.form.getFieldsValue());
                //        props.showEditBox(false,"")
                //        props.form.resetFields();
                //    },
                //    onCancel() {},
                //});

            }

        });


    }

    selected(value,o){
        this.props.defaultValue.CategoryId=o.props['aria-cateId']

    }

     success  () {
        message.success('修改成功');
     };


    handleBack(e){
        e.preventDefault();
        this.props.showEditBox(false,"")
        this.props.form.resetFields();
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
          initialValue: this.props.defaultValue.Name,
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.name="error"
                }else{
                    this.props.validateStatus.name="success"
                }
            }
        });
        const selProps=this.props;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/productUpload',
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: selProps.defaultValue.Pic,
                thumbUrl: selProps.defaultValue.Pic,
            }],

            onChange(info) {

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {

                    selProps.form.getFieldProps("Pic",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                } else if(info.file.status === 'removed'){
                    console.log("删除")
                    selProps.form.getFieldProps("Pic",{initialValue:""})
                }
            },
            listType: 'picture-card',


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
                    label="图片：">
                    <Upload {...uploadProps}>
                        <Icon type="plus" />
                        <div className="ant-upload-text" >上传照片</div>
                    </Upload>
                    <Input {...getFieldProps("Pic",{initialValue:this.props.defaultValue.Pic})}></Input>
                </FormItem>

                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" >修改</Button>
                    <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}


function mapStateToProps(state) {
    return {
        defaultValue: state.product.getCatePropsValue,
        options:state.product.options,
        result:state.product.result,
        validateStatus:state.product.validateStatus,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        showEditBox: bindActionCreators(showEditBox, dispatch),
        editProductCate:bindActionCreators(editProductCate,dispatch)
    }
}
EditProductCateForm.contextTypes={
    router:PropTypes.object.isRequired
}
EditProductCateForm= Form.create()(EditProductCateForm)


export default connect(mapStateToProps,mapDispatchToProps)(EditProductCateForm) ;

