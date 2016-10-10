import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,Upload,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import {addSeries,getCategory} from '../../actions/product'

class AddSeries extends React.Component {


    handleSubmit(e) {
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                this.props.addSeries(this.props.form.getFieldsValue());
                this.props.form.resetFields();
                this.context.router.push('/product')

            }

        });
    }
    handleBack(e){
        e.preventDefault();
        this.context.router.push('/product') // 页面跳转
    }
    selected(value,o){
        this.props.form.getFieldProps("CategoryId",{initialValue:o.props['aria-cateId']})


    }
    userExists(rule, value, callback) {
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if (value === 'JasonWood') {
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    callback();
                }
            }, 800);
        }
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
                { validator: this.userExists },
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
        const  cateIdProps=getFieldProps('Cate',{
            rules: [
                { required: true, message: '请选择分类' },
            ],
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.cate="error"
                }else{
                    this.props.validateStatus.cate="success"
                }
            }
        })
        const picList=[]
        const props=this.props
        var count=0;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/productUpload',
            data:{
                filename:'test'
            },
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {

                if (info.file.status !== 'uploading') {
                    //console.log(info.file.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    props.form.getFieldProps("Pic",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                }
            }
        };
        return (
            <div>
                <h2 style={{marginBottom:'10px'}}>添加产品系列</h2>
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem
                            {...formItemLayout}
                            label="系列名称："
                            hasFeedback
                            validateStatus={ this.props.validateStatus.name}
                            required
                            help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                            >
                            <Input type="text" {...nameProps } placeholder="请输入名称"/>
                        </FormItem>
                        <FormItem

                            label="类别："
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}
                            hasFeedback
                            validateStatus={ this.props.validateStatus.cate}
                            required
                            help={isFieldValidating('CategoryId') ? '校验中...' : (getFieldError('CategoryId') || []).join(', ')}
                            >
                            <Input type="hidden" {...getFieldProps('CategoryId')}></Input>
                            <Select placeholder="请选择分类"  size="large"  {...cateIdProps}   style={{ width: 120 }}
                                     onSelect={this.selected.bind(this)}
                                >
                                {

                                    this.props.options.map(function(option,index) {
                                        return(  <Option aria-cateId={option.Id} key={index}
                                                         value={option.Name}>{option.Name}</Option>)
                                    })
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="图片：">

                            <div className="clearfix">
                                <Upload {...uploadProps}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>


                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="备注："
                            help="随便写点什么">
                            <Input type="textarea" placeholder="随便写" {...getFieldProps('Remark')} />



                        </FormItem>


                        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit">添加</Button>
                            <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                        </FormItem>

                    </Form>
                </div>
        );
    }
    componentWillMount(){

        //this.props.params.id 是{id：13} 形式
        this.props.getCategory()
    }
}

function mapStateToProps(state) {
    return {

        options:state.product.options,
        validateStatus:state.product.validateStatus

    }
}
function mapDispatchToProps(dispatch) {
    return {
        getCategory:bindActionCreators(getCategory,dispatch),
        addSeries:bindActionCreators(addSeries,dispatch),

    }
}
AddSeries.contextTypes={
    router:PropTypes.object.isRequired
}
AddSeries= Form.create()(AddSeries)


export default connect(mapStateToProps,mapDispatchToProps)(AddSeries) ;

