/**
 * Created by Liya on 2016/5/17.
 */
import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,Upload,Modal,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

import './pic.less';

import {getPageDetail,editPage} from '../../actions/material'
class EditPage extends React.Component{

    handleSubmit(e) {

        e.preventDefault();
        const props=this.props;
        const context= this.context;

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                console.log("表单提交的数据是：",props.form.getFieldsValue())
                props.editPage(props.defaultValue.Id,props.form.getFieldsValue());

                //返回
                context.router.push('/material/page') // 页面跳转
                props.form.resetFields();
              /*  confirm({
                    title: '您是否确认提交修改',
                    onOk() {
                        console.log("表单提交的数据是：",props.form.getFieldsValue())
                        props.editPicDetail(props.defaultValue.Id,props.form.getFieldsValue());

                        //返回
                        context.router.push('/material/pic') // 页面跳转
                        props.form.resetFields();
                    },
                    onCancel() {},
                });*/

            }

        });






    }



    handleBack(e){
        e.preventDefault();
        this.context.router.push('/material/page') // 页面跳转
    }

    render(){
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout={
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        }
        const nameProps = getFieldProps('Name', {
            rules: [
                { required: true, min: 1, message: '用户名至少为 1个字符' }

            ],
            initialValue: this.props.defaultValue.Name,
            onChange: (e) => {
                const value=e.target.value;
                if(value.length<1){
                    this.props.validateStatus.pageName="error"
                }else{
                    this.props.validateStatus.pageName="success"
                }
            }
        });



        const selProps=this.props;
        const addFileList=[];
        if(selProps.defaultValue.Url!=undefined ){
            if(selProps.defaultValue.Url!=""){
                const  defaultPic=JSON.parse(selProps.defaultValue.Url)

                if(defaultPic){
                    defaultPic.map(x=>{
                        addFileList.push({uid:x.uid,picPath:x.picPath,picName:x.picName})
                    })

                }
            }

        }

        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/pageUpload',
            listType: 'picture-card',
            multiple:true,
            onPreview: (file) => {
                this.props.priviewImage=file.url;
                this.props.priviewVisible=true
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    console.log("-----------",info.file)
                    addFileList.push({uid:info.file.response.uid, picPath:"\\"+info.file.response.path,picName:info.file.response.name})

                        selProps.form.getFieldProps("Url",{initialValue:JSON.stringify(addFileList)})
                        console.log("selProps.defaultValue.Url************:",addFileList)
                        message.success(`${info.file.name} 上传成功。`);

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                } else if(info.file.status === 'removed'){
                    addFileList.length=0//清空原数组
                    info.fileList.map(x=>{
                        addFileList.push({uid:x.uid,picPath:x.url,picName:x.name})
                    })
                    selProps.form.getFieldProps("Url",{initialValue:JSON.stringify(addFileList)})
                }
            },




        };


        return(
            <div>

                <h2 style={{marginBottom:'20px'}}>宣传单页编辑</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="海报名称："
                        hasFeedback
                        validateStatus={this.props.validateStatus.pageName}
                        required
                        help={isFieldValidating('Name') ? '校验中...' : (getFieldError('Name') || []).join(', ')}
                        >
                        <Input type="text" {...nameProps } placeholder="请输入海报名称"/>
                    </FormItem>



                    <FormItem
                        {...formItemLayout}
                        label="图片：">

                        <Upload {...uploadProps} fileList={this.props.fileList}>
                            <Icon type="plus" />
                            <div className="ant-upload-text" >上传照片</div>
                        </Upload>
                        <Input type="hidden" {...getFieldProps("Url",{initialValue:selProps.defaultValue.Url})}/>

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
        this.props.getPageDetail(this.props.params.id)
        //this.props.params.id 是{id：13} 形式
    }

    componentWillReceiveProps(xx){

    }


}
function mapStateToProps(state) {

    return {
        defaultValue: state.material.getPropsValue,
        validateStatus:state.material.validateStatus,
        priviewVisible:state.material.priviewVisible,
        priviewImage:state.material.priviewVisible,
        fileList:state.material.fileList,

    }
}
function mapDispatchToProps(dispatch) {
    return {

        getPageDetail:bindActionCreators(getPageDetail,dispatch),
        editPage:bindActionCreators(editPage,dispatch)
    }
}
EditPage.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}
EditPage= Form.create()(EditPage)

export default connect(mapStateToProps,mapDispatchToProps)(EditPage) ;
