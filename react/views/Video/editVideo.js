/**
 * Created by Liya on 2016/5/16.
 */
import React ,{PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'



import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,message,Modal,Upload} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

import {editVideo,showEditBox} from '../../actions/video'
class EditVideo extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        const props=this.props;

        this.props.form.validateFields((errors, values) => {
            console.log("接受到的数据为：",props.form.getFieldsValue())

            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                props.editVideo(props.defaultValue.key,props.form.getFieldsValue());
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
        let url=this.props.defaultValue.Url
        if(typeof (url)!==typeof (undefined)){
                url=url.replace("http://","")
        }
        const urlProps=getFieldProps('Url',{
            initialValue: url,
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
            initialValue: this.props.defaultValue.Cate,
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
        defaultValue: state.video.getPropsValue,
        validateStatus:state.video.validateStatus,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        editVideo:bindActionCreators(editVideo,dispatch),
        showEditBox: bindActionCreators(showEditBox, dispatch),
    }
}

EditVideo= Form.create()(EditVideo)
export default connect(mapStateToProps,mapDispatchToProps)(EditVideo);