/**
 * Created by Liya on 2016/5/16.
 */
import React ,{PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {editWhitePage,showEditBox} from '../../actions/whitePage'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,message,Modal,Upload} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

class EditWhitePage extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        const props=this.props;

        this.props.form.validateFields((errors, values) => {
            console.log("接受到的数据为：",props.form.getFieldsValue())

            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                props.editWhitePage(props.defaultValue.key,props.form.getFieldsValue());
                props.showEditBox(false,"")
                props.form.resetFields();
                /*confirm({
                    title: '您是否确认提交修改',
                    onOk() {
                       // console.log("receive:",props.form.getFieldsValue())
                        //props.editWhitePage(props.defaultValue.key,props.form.getFieldsValue());
                        //props.showEditBox(false,"")
                        //props.form.resetFields();
                    },
                    onCancel() {},
                });*/

            }

        });

    }
    handleBack(){
        this.props.showEditBox(false,"")
    }
    render(){
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const  formItemLayout={
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        }
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
        const  selProps=this.props;
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
                    selProps.form.getFieldProps("Url",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                }else if(info.file.status=="removed"){
                    selProps.form.getFieldProps("Url",{initialValue:""})

                }
            },
            listType: 'text',


        };
        return(
            <div>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="方案名称："
                        hasFeedback
                        validateStatus={this.props.validateStatus.name}
                        required
                        help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                        >
                        <Input type="hidden" {...getFieldProps('key', { initialValue: this.props.defaultValue.key })}></Input>
                        <Input type="text" {...nameProps } placeholder="请输入名称"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="文件：">

                        <Upload {...uploadProps} className="upload-list-inline" fileList={this.props.fileList}>
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传文件
                            </Button>
                            <p style={{color:'red'}}>只能上传pdf文件</p>
                        </Upload>
                        <Input type="hidden" {...getFieldProps("Url",{initialValue:this.props.defaultValue.Url})}></Input>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" >修改</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>
                 </Form>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        defaultValue: state.whitePage.getPropsValue,
        options:state.whitePage.options,
        result:state.whitePage.result,
        validateStatus:state.whitePage.validateStatus,
        fileList:state.whitePage.fileList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        editWhitePage:bindActionCreators(editWhitePage,dispatch),
        showEditBox: bindActionCreators(showEditBox, dispatch),
    }
}

EditWhitePage= Form.create()(EditWhitePage)
export default connect(mapStateToProps,mapDispatchToProps)(EditWhitePage);