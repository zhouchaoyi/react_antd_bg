import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Validation,Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,Upload,message,notification} from 'antd';
const Validator = Validation.Validator;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;


import {getCategory,addSolution} from '../../actions/solution'
import Ueditor from '../../utils/ueditor.js'

class AddSolutiontForm extends React.Component {
    constructor(props) {
        super(props)
    }
    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((errors,value)=>{


            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else {
                var text = UE.getEditor("ueText").getContent();
                UE.getEditor("ueText").destroy();
                this.props.form.getFieldProps("Text",{initialValue:text})
                console.log('收到表单值：', this.props.form.getFieldsValue());
                this.props.addSolution(this.props.form.getFieldsValue());
                this.context.router.push('/solution') // 页面跳转
                this.props.form.resetFields();
            }

        })
    }

    selected(value,o){
        this.props.form.getFieldProps("IndustryId",{initialValue:o.props['aria-cateId']})
    }
    handleChange(){
        console.log("handleChangehandleChangehandleChange")
    }

    handleBack(e){
        e.preventDefault();
        //UE.getEditor("ueText").destroy();
        this.context.router.push('/solution') // 页面跳转
    }
    render() {

        const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const _validateStatus="";
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
        const  cateIdProps=getFieldProps('Industry',{
            rules: [
                { required: true, message: '请选择行业' },

            ],
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.industry="error"
                }else{
                    this.props.validateStatus.industry="success"
                }
            }
        })
        const  publisherProps=getFieldProps('Publisher',{
            rules:[
                {required:true,message:'请输入发布者'}
            ],
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.publisher="error"
                }else{
                    this.props.validateStatus.publisher="success"
                }
            }
        })
        const  props=this.props;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/solutionUpload',
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
                    let picList=[];

                    props.form.getFieldProps("Url",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    props.form.getFieldProps("Url",{initialValue:""})
                    message.error(`${info.file.name} 上传失败。`);
                }
            },


        };
        return (
            <div>
                <h2 style={{marginBottom:'20px'}}>添加解决方案</h2>

                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem
                        {...formItemLayout}
                        label="方案名称："
                        hasFeedback
                        validateStatus={this.props.validateStatus.name}
                        required
                        help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                        >
                        <Input type="text" {...nameProps} placeholder="请输入名称"  />
                    </FormItem>
                    <FormItem
                        id="select"
                        label="行业："
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        hasFeedback
                        validateStatus={ this.props.validateStatus.industry}
                        required
                        help={isFieldValidating('Industry') ? '校验中...' : (getFieldError('Industry') || []).join(', ')}
                        >
                        <Input type="hidden" {...getFieldProps('IndustryId')}></Input>
                        <Select placeholder="请选择行业" size="large"  {...cateIdProps}   style={{ width: 120 }}
                                onSelect={this.selected.bind(this)}>
                            {

                                this.props.options.map(function(option,index) {
                                    return(  <Option aria-cateId={option.Id} key={index}
                                                     value={option.Name}>{option.Name}</Option>)
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                         labelCol={ {span: 6}} wrapperCol={{ span: 6 }}
                         label="发布者："
                         hasFeedback
                         validateStatus={this.props.validateStatus.publisher}
                         required
                         help={isFieldValidating('Publisher') ? '校验中...' : (getFieldError('Publisher') || []).join(', ')}
                        >
                        <Input type="text" {...publisherProps} placeholder="请输入发布者"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="图片："
                        help="只能上传一张图片"
                        >
                        <Upload {...uploadProps}>
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>

                        </Upload>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="简介：">
                        <Input type="textarea" {...getFieldProps('Intro')} placeholder="请输入简介"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容："
                       >
                        <Ueditor  id="ueText" height="200"  />
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

        this.props.getCategory();
    }
    componentWillReceiveProps(nextProps) {
        const result=nextProps.result
        const loading=nextProps.loading

       /* if(result==1 && loading==2){
                notification.success({
                    message: 'Success',
                    description: "添加成功"
                });

             this.context.router.push('/solution') // 页面跳转
            this.props.form.resetFields();
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
    console.log("result:",state.solution.result)
    return {
        options:state.solution.options,
        formData:state.solution.formData,
        validateStatus:state.solution.validateStatus,
        result:state.solution.result,
        loading:state.solution.loading

    }
}
function mapDispatchToProps(dispatch) {
    return {

        getCategory:bindActionCreators(getCategory,dispatch),
        addSolution:bindActionCreators(addSolution,dispatch)
    }
}



AddSolutiontForm.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}
AddSolutiontForm= Form.create()(AddSolutiontForm)
export default connect(mapStateToProps,mapDispatchToProps)(AddSolutiontForm) ;

