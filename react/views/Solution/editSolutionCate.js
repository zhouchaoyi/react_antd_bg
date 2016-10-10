import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,message,Modal,Upload} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

import {showEditBox,editSolutionCate} from '../../actions/solution'

class EditSolutionCateForm extends React.Component {


    handleSubmit(e) {

        e.preventDefault();
        const props=this.props;
        console.log("表单提交的数据：",props.form.getFieldsValue())
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                confirm({
                    title: '您是否确认提交修改',
                    onOk() {
                        props.editSolutionCate(props.defaultValue.Id,props.form.getFieldsValue());
                        props.showEditBox(false,"")
                        props.form.resetFields();
                    },
                    onCancel() {},
                });

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

        return (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                <FormItem
                    {...formItemLayout}
                    label="行业名称2："
                    hasFeedback
                    validateStatus={ this.props.validateStatus.name}
                    required
                    help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                    >
                
                    <Input type="text" {...nameProps } placeholder="请输入名称22"/>
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
        defaultValue: state.solution.getCatePropsValue,
        result:state.solution.result,
        validateStatus:state.solution.validateStatus,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        showEditBox: bindActionCreators(showEditBox, dispatch),
        editSolutionCate:bindActionCreators(editSolutionCate,dispatch)
    }
}
EditSolutionCateForm.contextTypes={
    router:PropTypes.object.isRequired
}
EditSolutionCateForm= Form.create()(EditSolutionCateForm)


export default connect(mapStateToProps,mapDispatchToProps)(EditSolutionCateForm) ;

