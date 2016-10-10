/**
 * Created by Liya on 2016/6/3.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Table,Modal,Form,Tooltip,Select } from 'antd';
const confirm = Modal.confirm;
const FormItem= Form.Item;
import {addSubMenu} from '../../actions/weChat_menu'

class AddWXSubMenu extends React.Component{
    back(){
        const url="/menu"
        this.context.router.push(url) // 页面跳转
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields((errors,value)=>{
            if(!!errors){
                console.log('Errors in form!!!');
                return;
            }else{
                console.log('收到表单值：', this.props.form.getFieldsValue());
                const parId=this.props.params.key
                this.props.addSubMenu(parId,this.props.form.getFieldsValue())
                this.back();
                this.props.form.resetFields()
            }
        })
    }
    handleBack(value){

    }

    render(){
        const {getFieldProps, getFieldError, isFieldValidating}=this.props.form
        const formItemLayout={
            labelCol:{span:5},
            wrapperCol:{span:15}
        }
        const nameProps = getFieldProps('name', {
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
        const urlProps=getFieldProps('url',{
            rules: [
                { required: true, min: 1, message: '必填' }
            ],
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.url="error"
                }else{
                    this.props.validateStatus.url="success"
                }
            }
        })
        const typeProps=getFieldProps("type",{
            rules: [
                { required: true, message: '请选择菜单类型' },
            ],
            initialValue:'选择菜单类型',
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.type="error"
                }else{
                    this.props.validateStatus.type="success"
                }
            }
        })
        return(
            <div>
                <h1 style={{marginBottom:'10px'}}>添加微信二级菜单</h1>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="二级菜单名称："
                        hasFeedback
                        validateStatus={this.props.validateStatus.name}
                        required
                        help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                        >
                        <Input type="text" {...nameProps} placeholder="二级菜单名称"  />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="菜单类型："
                        hasFeedback
                        validateStatus={this.props.validateStatus.type}
                        required
                        help={isFieldValidating('type') ? '校验中...' : (getFieldError('type') || []).join(', ')}
                        >
                        <Select defaultValue="选择菜单类型" {...typeProps} style={{ width: 120 }} >
                            <Option value="view">跳转URL</Option>
                            <Option value="click">点击推事件</Option>

                        </Select>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="url："
                        hasFeedback
                        validateStatus={this.props.validateStatus.url}
                        required
                        help={isFieldValidating('url') ? '校验中...' : (getFieldError('url') || []).join(', ')}
                        >
                        <Input type="text" {...urlProps} placeholder="跳转的url"  />
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
    return{
        validateStatus:state.weChat_menu.validateStatus
    }
}
function mapDispatchToProps(dispatch){
    return{
        addSubMenu:bindActionCreators(addSubMenu,dispatch)
    }
}
AddWXSubMenu.contextTypes={
    router:PropTypes.object.isRequired
}
AddWXSubMenu=Form.create()(AddWXSubMenu)
export default connect(mapStateToProps,mapDispatchToProps)(AddWXSubMenu)