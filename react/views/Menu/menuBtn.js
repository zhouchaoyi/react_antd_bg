/**
 * Created by Liya on 2016/5/11.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Table,Modal,Form,Tooltip,Select} from 'antd';
const confirm = Modal.confirm;
const FormItem= Form.Item;

import {deleteWXMenu,showEditBox,editWXMenu} from '../../actions/weChat_menu'
class MenuBtn extends React.Component{
    handleDelete(e){
        console.log(e)
        const props= this.props;
        confirm({
            title: '您是否确认要删除这条数据',
            onOk() {
                props.deleteWXMenu(e.key);
            },
            onCancel() {},
        });

    }
    onShowEditBox(value){
        console.log("value:",value)
        this.props.showEditBox(true,value)
    }
    handleEditBoxOk(){
        this.props.showEditBox(false,"")
    }
    handleEditBoxCancel(){
        this.props.showEditBox(false,"")
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(!!errors){
                console.log('Errors in form!!!');
                return;
            }else{
                console.log("表单获取的数据为：",this.props.form.getFieldsValue())
                this.props.editWXMenu(this.props.defaultValue.key,this.props.form.getFieldsValue())
                this.props.showEditBox(false,"")
                this.props.form.resetFields()
            }
        })
    }
        render(){
            const record=this.props.record
            const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
            const formItemLayout = {
                labelCol: {span: 6},
                wrapperCol: {span: 14},
            };
            const nameProps = getFieldProps('name', {
                rules: [
                    { required: true, min: 1, message: '字数不超过4个汉字或8个字母' }
                ],
                onChange: (e) => {
                    const value=e.target.value;
                    if(value.length<1 || value.length>5){
                        this.props.validateStatus.name="error"
                    }else{
                        this.props.validateStatus.name="success"
                    }
                },
                initialValue:this.props.defaultValue.name
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
                },
                initialValue:this.props.defaultValue.url
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
                },
                initialValue:this.props.defaultValue.type
            })
            return(
                <div>
                    <Tooltip placement="right" title="操作后请点击发布才可更新服务器">
                        <a onClick={this.handleDelete.bind(this,record)}>删除</a>
                    </Tooltip>

                    <span className="ant-divider"></span>
                    <Tooltip placement="right" title="操作后请点击发布才可更新服务器">
                        <a onClick={this.onShowEditBox.bind(this,record)}>修改</a>
                    </Tooltip>
                    <span className="ant-divider"></span>
                    <Tooltip placement="right" title="操作后请点击发布才可更新服务器">
                        <Link to={{pathname:"/addWXSubMenu/"+record.key}}>添加子菜单</Link>
                    </Tooltip>


                    <Modal title="修改菜单名称" visible={this.props.isShowEditBox} onOk={this.handleEditBoxOk.bind(this)}
                           onCancel={this.handleEditBoxCancel.bind(this)}  footer="">
                        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                            <FormItem
                                {...formItemLayout}
                                label="菜单名称："
                                hasFeedback
                                validateStatus={ this.props.validateStatus.name}
                                required
                                help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                                >
                                <Input type="text" {...nameProps } placeholder="菜单名称"/>
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
                                <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleEditBoxCancel.bind(this)}>返回</Button>
                            </FormItem>

                        </Form>

                    </Modal>

                </div>
            )
        }
}

// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        isShowEditBox:state.weChat_menu.isShowEditBox,
        validateStatus:state.weChat_menu.validateStatus,
        defaultValue:state.weChat_menu.defaultValue

    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteWXMenu:bindActionCreators(deleteWXMenu,dispatch),
        showEditBox:bindActionCreators(showEditBox,dispatch),
        editWXMenu:bindActionCreators(editWXMenu,dispatch)
    }
}
MenuBtn=Form.create()(MenuBtn)
export default connect(mapStateToProps,mapDispatchToProps)(MenuBtn)
