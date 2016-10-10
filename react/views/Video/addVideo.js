/**
 * Created by Liya on 2016/6/16.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Select,Upload,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import {showBox,addVideo} from '../../actions/video'
class AddVideoForm extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        const formValue= this.props.form.getFieldsValue()
        Object.assign(formValue,{Url:"http://"+formValue.Url})
        console.log('收到表单值：', formValue);

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                this.props.addVideo(formValue);
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
        const urlProps=getFieldProps('Url',{
            rules:[
                {required:true,min:1,message:'请正确输入url'},
            ],
            onChange:(e)=>{
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.url="error"
                }else{
                    this.props.validateStatus.url="success"
                }
            }
        })
        const cateProps=getFieldProps('Cate',{
            rules:[
                {required:true,min:1,message:'请选择分类'}
            ],
            onChange:(e)=>{

                if(!e){
                    this.props.validateStatus.cate="error"
                }else{
                    this.props.validateStatus.cate="success"
                }
            }
        })
        return (

            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    {...formItemLayout}
                    label="视频名称："
                    hasFeedback
                    validateStatus={ this.props.validateStatus.name}
                    required
                    help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                    >
                    <Input type="text" {...nameProps } placeholder="请输入名称"/>
                </FormItem>
                <FormItem
                    id="select"
                    label="行业："
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    hasFeedback
                    validateStatus={ this.props.validateStatus.cate}
                    required
                    help={isFieldValidating('cate') ? '校验中...' : (getFieldError('cate') || []).join(', ')}
                    >
                    <Select placeholder="请选择行业" size="large"  {...cateProps}   style={{ width: 120 }}
                            >
                        <Option  value="媒体">媒体</Option>
                        <Option  value="技术">技术</Option>
                        <Option  value="产品">产品</Option>
                        <Option  value="课程">课程</Option>
                        <Option  value="市场">市场</Option>

                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="视频url："
                    hasFeedback
                    validateStatus={ this.props.validateStatus.url}
                    required
                    help={isFieldValidating('Url') ? '校验中...' : (getFieldError('Url') || []).join(', ')}
                    >
                    <Input type="text" {...urlProps } addonBefore="http://" placeholder="请输入url"/>
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

        options:state.video.options,
        validateStatus:state.video.validateStatus

    }
}
function mapDispatchToProps(dispatch) {
    return {
        showBox: bindActionCreators(showBox, dispatch),
        addVideo:bindActionCreators(addVideo,dispatch),

    }
}

AddVideoForm= Form.create()(AddVideoForm)


export default connect(mapStateToProps,mapDispatchToProps)(AddVideoForm) ;