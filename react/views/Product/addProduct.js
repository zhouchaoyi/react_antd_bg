/**
 * Created by Liya on 2016/5/25.
 */

import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import {addProduct,getSeriesNameById} from '../../actions/product'
import Ueditor from '../../utils/ueditor.js'

class AddProduct extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                var text = UE.getEditor("productContent").getContent();
                this.props.form.getFieldProps("Content",{initialValue:text})

                this.props.addProduct(this.props.form.getFieldsValue());
                this.props.form.resetFields();
                this.back();

            }

        });
    }
    back(){
        UE.getEditor("productContent").destroy();
        const url="/products/"+this.props.params.categoryId+'/'+this.props.params.seriesId
        this.context.router.push(url) // 页面跳转
    }
    handleBack(e){
        e.preventDefault();
        this.back()
    }
    selected(value,o){
        this.props.form.getFieldProps("CategoryId",{initialValue:o.props['aria-cateId']})


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
            <div>
                <h2 style={{marginBottom:'10px'}}>添加产品</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem

                        label="系列名称："
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        required
                        >
                        <Input type="text"  disabled {...getFieldProps('SeriesName',{initialValue:this.props.defaultValue.Name})}></Input>
                        <Input type="hidden"  disabled {...getFieldProps('SeriesId',{initialValue:this.props.defaultValue.Id})}></Input>
                        <Input type="hidden"  disabled {...getFieldProps('CategoryId',{initialValue:this.props.defaultValue.CategoryId})}></Input>

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="名称："
                        hasFeedback
                        validateStatus={ this.props.validateStatus.name}
                        required
                        help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                        >
                        <Input type="text" {...nameProps } placeholder="请输入名称"/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="内容："

                        >
                        <Ueditor  id="productContent" height="200"   />

                    </FormItem>



                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">添加</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>

                </Form>
            </div>
        );
    }
    componentDidMount(){
        //根据seresId获取类别名称
        this.props.getSeriesNameById(this.props.params.seriesId)
    }
}

function mapStateToProps(state) {
    return {
        defaultValue:state.product.getPropsValue,
        validateStatus:state.product.validateStatus

    }
}
function mapDispatchToProps(dispatch) {
    return {
        getSeriesNameById:bindActionCreators(getSeriesNameById,dispatch),
        addProduct:bindActionCreators(addProduct,dispatch),

    }
}
AddProduct.contextTypes={
    router:PropTypes.object.isRequired
}
AddProduct= Form.create()(AddProduct)


export default connect(mapStateToProps,mapDispatchToProps)(AddProduct) ;


