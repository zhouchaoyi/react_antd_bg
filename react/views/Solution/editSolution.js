/**
 * Created by Liya on 2016/5/12.
 */
import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,Upload,Modal,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
import {getSolutionDetail,editSolutionDetail} from '../../actions/solution'
import './solution.less';
import Ueditor from '../../utils/ueditor.js'
class EditSolution extends React.Component{

    back(){
        UE.getEditor("ueText2").destroy();
        this.context.router.push('/solution') // 页面跳转
        this.props.form.resetFields();
    }
    handleSubmit(e) {

        e.preventDefault();
        const props=this.props;

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                var text = UE.getEditor("ueText2").getContent();
                props.form.getFieldProps("Text",{initialValue:text})
                console.log("表单提交的值：",props.form.getFieldsValue())
                props.editSolutionDetail(props.defaultValue.Id,props.form.getFieldsValue());
                this.back()
                //返回

               /* confirm({
                    title: '您是否确认提交修改',
                    onOk() {
                        console.log("表单提交的值：",props.form.getFieldsValue())
                        props.editSolutionDetail(props.defaultValue.Id,props.form.getFieldsValue());

                        //返回
                        context.router.push('/solution') // 页面跳转
                        props.form.resetFields();
                    },
                    onCancel() {},
                });*/

            }

        });






    }

    selected(value,o){
        this.props.defaultValue.IndustryId=o.props['aria-cateId']

    }
    handleBack(e){
        e.preventDefault();
       this.back();
    }


    render(){
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout={
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        }
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
        const cateProps= getFieldProps('Industry',{
            initialValue: this.props.defaultValue.Industry,
            rules: [
                { required: true,  message: '请选择行业' },
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
            initialValue:this.props.defaultValue.Publisher,
            rules: [
                { required: true,  message: '请输入发布者' },
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
        const selProps=this.props;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/solutionUpload',

            onChange(info) {

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {

                    selProps.form.getFieldProps("Url",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                } else if(info.file.status === 'removed'){
                    selProps.form.getFieldProps("Url",{initialValue:""})
                }
            },
            listType: 'picture-card',


        };

        return(
            <div>

                <h2>编辑解决方案</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

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
                        id="select"
                        label="类别："
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        hasFeedback
                        validateStatus={ this.props.validateStatus.industry}
                        required
                        help={isFieldValidating('Industry') ? '校验中...' : (getFieldError('Industry') || []).join(', ')}
                        >
                       <Input type="hidden" {...getFieldProps('IndustryId', { initialValue: this.props.defaultValue.IndustryId })}></Input>
                        <Select size="large" {...cateProps}
                                onSelect={this.selected.bind(this)}    style={{ width: 120 }} >
                            {

                                this.props.options.map(function(option,index) {
                                    return(  <Option aria-cateId={option.Id}  key={index}
                                                     value={option.Name}>{option.Name}</Option>)
                                })
                            }
                        </Select>


                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="发布者："
                        hasFeedback
                        validateStatus={ this.props.validateStatus.publisher}
                        required
                        help={isFieldValidating('Publisher') ? '校验中...' : (getFieldError('Publisher') || []).join(', ')}
                        >
                        <Input type="text" {...publisherProps} placeholder="请输入发布者"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="图片：">
                        <Upload {...uploadProps} fileList={this.props.fileList}>
                            <Icon type="plus" />
                            <div className="ant-upload-text" >上传照片</div>
                        </Upload>
                        <Input type="hidden" {...getFieldProps("Url",{initialValue:this.props.defaultValue.Url})}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="简介："
                        help="简明扼要">
                        <Input type="textarea" placeholder="随便写" {...getFieldProps('Intro',{ initialValue: this.props.defaultValue.Intro })} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容："
                       >
                        <Ueditor  id="ueText2" height="200" value={this.props.defaultValue.Text}  />

                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" >修改</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
    componentWillMount(){
        this.props.getSolutionDetail(this.props.params.id)
        //this.props.params.id 是{id：13} 形式
    }


}
function mapStateToProps(state) {

    return {
        defaultValue: state.solution.getPropsValue,
        options:state.solution.options,
        validateStatus:state.solution.validateStatus,
        fileList:state.solution.fileList

    }
}
function mapDispatchToProps(dispatch) {
    return {
        getSolutionDetail:bindActionCreators(getSolutionDetail,dispatch),
        editSolutionDetail:bindActionCreators(editSolutionDetail,dispatch)
    }
}
EditSolution.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}
EditSolution= Form.create()(EditSolution)

export default connect(mapStateToProps,mapDispatchToProps)(EditSolution) ;
