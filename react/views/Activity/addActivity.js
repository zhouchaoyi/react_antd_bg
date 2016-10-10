/**
 * Created by Liya on 2016/5/17.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form,Input,Button } from 'antd'
const FormItem=Form.Item

import {addActivity} from '../../actions/activity'
import Ueditor from '../../utils/ueditor.js'

class AddActivity extends  React.Component{
    constructor(props) {
        super(props)
    }
    back(){
        this.context.router.push('/activity') // 页面跳转
        UE.getEditor("activityContent").destroy();
        this.props.form.resetFields();
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields((errors,value)=>{
            if(!!errors){
                console.log('Errors in form!!!');
                return;
            }else{
                var text = UE.getEditor("activityContent").getContent();
                UE.getEditor("activityContent").destroy();
                this.props.form.getFieldProps("Content",{initialValue:text})
                console.log('收到表单值：', this.props.form.getFieldsValue());
                this.props.addActivity( this.props.form.getFieldsValue());
                this.back()
            }

        })
    }
    handleBack(e){
      this.back()
    }
    render(){
        const {getFieldProps, getFieldError, isFieldValidating} =this.props.form
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const nameProps=getFieldProps("Name",{
            rules: [
                { required: true, min: 1, message: '用户名至少为 1个字符' },
                { validator: this.userExists }
            ],
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.name="error"
                }else{
                    this.props.validateStatus.name="success"
                }
            }
        })
        const yearProps=getFieldProps('Year',{
            rules:[
                {required:true,message:'请填写年份'}
            ],
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.year="error"
                }else{
                    this.props.validateStatus.year="success"
                }
            }
        })
        const dateProps=getFieldProps('Date',{
            rules:[
                {required:true,message:'请输入日期'}
            ],
            onChange:(e)=>{
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.date="error"
                }else{
                    this.props.validateStatus.date="success"
                }
            }
        })
        const addressProps=getFieldProps('Address',{
            rules:[
                {required:true,message:'请输入地址'}
            ],
            onChange:(e)=>{
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.address="error"
                }else{
                    this.props.validateStatus.address="success"
                }
            }
        })
        return(
            <div>
                <h2 style={{marginBottom:'20px'}}>添加活动</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="活动名称："
                        hasFeedback
                        validateStatus={this.props.validateStatus.name}
                        required
                        help={isFieldValidating('Name')?'校验中...':(getFieldError('Name') || []).join(',')}
                        >
                        <Input type="text" {...nameProps} placeholder="请输入名称"  />
                     </FormItem>
                    <FormItem
                        labelCol={{span:6}}
                        wrapperCol={{span:6}}
                        label="年份："
                        hasFeedback
                        validateStatus={this.props.validateStatus.year}
                        required
                        help={isFieldValidating('Year')?'校验中...':(getFieldError('Year') || []).join(',')}
                        >
                        <Input type="text" {...yearProps} placeholder="请输入年份"  />
                    </FormItem>
                    <FormItem
                        labelCol={{span:6}}
                        wrapperCol={{span:6}}
                        label="日期："
                        hasFeedback
                        validateStatus={this.props.validateStatus.date}
                        required
                        help={isFieldValidating('Date')?'校验中...':(getFieldError('Date') || []).join(',')}
                        >
                        <Input type="text" {...dateProps} placeholder="请输入日期"  />
                    </FormItem>
                    <FormItem
                        labelCol={{span:6}}
                        wrapperCol={{span:6}}
                        label="地点："
                        hasFeedback
                        validateStatus={this.props.validateStatus.address}
                        required
                        help={isFieldValidating('Address')?'校验中...':(getFieldError('Address') || []).join(',')}
                        >
                        <Input type="text" {...addressProps} placeholder="请输入地点"  />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容："

                        >
                        <Ueditor  id="activityContent" height="200"  />
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">添加</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state){
        return {
            validateStatus:state.activity.validateStatus
        }
}
function mapDispatchToProps(dispatch){
        return{
            addActivity:bindActionCreators(addActivity,dispatch)
        }
}
AddActivity.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}
AddActivity= Form.create()(AddActivity)
export default connect(mapStateToProps,mapDispatchToProps)(AddActivity)