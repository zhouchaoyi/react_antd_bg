import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button,  Icon,Select,Upload,message,notification} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import {showBox,addSolutionCate} from '../../actions/solution'


class AddSolutionCateForm extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                this.props.addSolutionCate(this.props.form.getFieldsValue());
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
                <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">添加</Button>
                    <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                </FormItem>

            </Form>
        );
    }
    componentWillReceiveProps(nextProps) {
        const result=nextProps.result
        const loading=nextProps.loading
        console.log(loading)
       /* if(result==1 && loading==2){
            notification.success({
                message: 'Success',
                description: "添加成功"
            });

            this.props.form.resetFields();
            this.props.showBox(false)
        }
        if(result==0 && loading==2){
            notification.error({
                message: 'Fail',
                description: "添加成功"
            });
        }*/

    }


}

function mapStateToProps(state) {
    return {
        validateStatus:state.solution.validateStatus,
        result:state.solution.result,
        loading:state.solution.loading
    }
}
function mapDispatchToProps(dispatch) {
    return {
        showBox: bindActionCreators(showBox, dispatch),
        addSolutionCate:bindActionCreators(addSolutionCate,dispatch)

    }
}
AddSolutionCateForm.contextTypes={
    router:PropTypes.object.isRequired
}
AddSolutionCateForm= Form.create()(AddSolutionCateForm)
export default connect(mapStateToProps,mapDispatchToProps)(AddSolutionCateForm) ;

