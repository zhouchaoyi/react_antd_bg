import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,message,Modal} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

import {editProduct,getProductDetail} from '../../actions/product'
import Ueditor from '../../utils/ueditor.js'
class EditProduct extends React.Component {


    back(){
        UE.getEditor("productEdContent").destroy();
        var url="/products/"+this.props.defaultValue.CategoryId+"/"+this.props.defaultValue.SeriesId
        this.context.router.push(url) // 页面跳转
    }

    handleSubmit(e) {

        e.preventDefault();
        const _this=this;
        const  context=this.context

        this.props.form.validateFields((errors, values) => {
            console.log("表单提交的数据为：",_this.props.form.getFieldsValue())
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                var text = UE.getEditor("productEdContent").getContent();
                _this.props.form.getFieldProps("Content",{initialValue:text})
                _this.props.editProduct(_this.props.defaultValue.Id,_this.props.form.getFieldsValue());
                _this.back();
                _this.props.form.resetFields();
                /*confirm({
                    title: '您是否确认提交修改',
                    onOk() {
                        var text = UE.getEditor("productContent").getContent();
                        _this.props.form.getFieldProps("Content",{initialValue:text})
                        _this.props.editProduct(_this.props.defaultValue.Id,_this.props.form.getFieldsValue());
                        _this.back();
                        _this.props.form.resetFields();

                    },
                    onCancel() {},
                });*/

            }

        });


    }


    handleBack(e){
        e.preventDefault();
        this.back()

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

        const  cateIdProps=getFieldProps('Cate',{
            rules: [
                { required: true, message: '请选择分类' },
            ],
            initialValue: this.props.defaultValue.Cate,
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.cate="error"
                }else{
                    this.props.validateStatus.cate="success"
                }
            }
        })
        const seriesIdProps=getFieldProps('SeriesName',{
            rules: [
                { required: true, message: '请选择分类' },
            ],
            initialValue: this.props.defaultValue.SeriesName,
            onChange: (e) => {
                if(!e){
                    this.props.validateStatus.seriesName="error"
                }else{
                    this.props.validateStatus.seriesName="success"
                }
            }
        })

        return (
            <div>
                <h2>产品修改</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem label="类别："  labelCol={{ span: 6 }}  wrapperCol={{ span: 14 }}>
                        <Input type="text" disabled {...getFieldProps('Cate',{initialValue:this.props.defaultValue.Cate})}></Input>
                    </FormItem>

                    <FormItem  label="系列："  labelCol={{ span: 6 }}  wrapperCol={{ span: 14 }}>
                        <Input type="text" disabled {...getFieldProps('SeriesName',{initialValue:this.props.defaultValue.SeriesName})}></Input>
                    </FormItem>
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
                        label="备注："
                        help="随便写点什么">
                        <Ueditor  id="productEdContent" height="200"   />
                    </FormItem>


                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" >修改</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>

                    </FormItem>
                </Form>
            </div>
        );
    }
    componentWillMount(){
        this.props.getProductDetail(this.props.params.id)
        //this.props.params.id 是{id：13} 形式

        /*暂时停用*/
        //this.props.getCategory()//显示产品分类
        //this.props.getSeries(this.props.params.categoryId)//显示该产品分类下的产品系列
    }
}


function mapStateToProps(state) {
    console.log( state.product.getPropsValue)
    return {
        options:state.product.options,
        tableData:state.product.tableData,
        defaultValue: state.product.getPropsValue,
        validateStatus:state.solution.validateStatus
    }
}
function mapDispatchToProps(dispatch) {
    return {
        editProduct:bindActionCreators(editProduct,dispatch),
        getProductDetail:bindActionCreators(getProductDetail,dispatch)
    }
}
EditProduct.contextTypes={
    router:PropTypes.object.isRequired

}
EditProduct= Form.create()(EditProduct)


export default connect(mapStateToProps,mapDispatchToProps)(EditProduct) ;

