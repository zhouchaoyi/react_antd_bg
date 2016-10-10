/**
 * Created by Liya on 2016/5/19.
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

import {getPicDetail,addPicDetail} from '../../actions/material'
import {getCategory,getSeries} from '../../actions/product'
class AddPic extends React.Component{

    handleSubmit(e) {

        e.preventDefault();
        const props=this.props;
        const context= this.context;

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                confirm({
                    title: '您是否确认提交修改',
                    onOk() {
                        console.log("表格提交的信息为：",props.form.getFieldsValue())
                        props.addPicDetail(props.form.getFieldsValue());

                        //返回
                        context.router.push('/material/pic') // 页面跳转
                        props.form.resetFields();
                    },
                    onCancel() {},
                });

            }

        });



    }

    selected(value,o){
        const id=o.props['aria-cateId']
        this.props.form.getFieldProps("CategoryId",{initialValue:id})
        this.props.form.getFieldProps("SeriesId",{initialValue:""})
        this.props.getSeries(id);
    }
    seriesSelected(value,o){
        this.props.form.getFieldProps("SeriesId",{initialValue:o.props['aria-seriesId']})
    }
    handleBack(e){
        e.preventDefault();
        this.context.router.push('/material/pic') // 页面跳转
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
        const cateProps= getFieldProps('Cate',{
            rules: [
                { required: true,  message: '请选择行业' },
            ],
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.cate="error"
                }else{
                    this.props.validateStatus.cate="success"
                }
            }
        })
        const serProps=getFieldProps('Series',{
            rules: [
                { required: true,  message: '请选择系列' },
            ],
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.series="error"
                }else{
                    this.props.validateStatus.series="success"
                }
            }
        })
        const selProps=this.props;
        const picList=[]
        const props=this.props
        var count=0;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/picUpload',
            listType: 'picture',
            multiple:true,
            onPreview: (file) => {
                this.props.priviewImage=file.url;
                this.props.priviewVisible=true


            },
            onChange(info) {

                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                //console.log(info);
                if (info.file.status === 'done') {
                    count++
                    picList.push({uid:info.file.response.uid,picPath:"\\"+info.file.response.path,picName:info.file.response.name})
                   if(count==info.fileList.length){
                       props.form.getFieldProps("Url",{initialValue:JSON.stringify(picList)})
                       console.log(JSON.stringify(picList))
                       message.success(`${info.file.name} 上传成功。`);
                   }

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                } else if(info.file.status === 'removed'){
                    picList.map((x,index)=>{

                        if(x.uid==info.file.uid){
                            console.log(x)
                            console.log("删除")
                            picList.splice(index,1)

                        }
                    })
                    console.log(picList)
                    props.form.getFieldProps("Url",{initialValue:JSON.stringify(picList)})

                }
            },



        };
        return(
            <div>

                <h2 style={{marginBottom:'20px'}}>添加图片</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem
                        {...formItemLayout}
                        label="图片名称："
                        hasFeedback
                        validateStatus={this.props.validateStatus.name}
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
                        validateStatus={this.props.validateStatus.cate}
                        required
                        help={isFieldValidating('Cate') ? '校验中...' : (getFieldError('Cate') || []).join(', ')}
                        >
                        <Input type="hidden" {...getFieldProps('CategoryId')}></Input>
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

                        label="系列："
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        hasFeedback
                        validateStatus={this.props.validateStatus.series}
                        required
                        help={isFieldValidating('Series') ? '校验中...' : (getFieldError('Series') || []).join(', ')}
                        >
                        <Input type="hidden" {...getFieldProps('SeriesId')}></Input>
                        <Select size="large" {...serProps}
                                onSelect={this.seriesSelected.bind(this)}    style={{ width: 220 }} >
                            {

                                this.props.seriesItem.map(function(option,index) {
                                    return(  <Option aria-seriesId={option.id}  key={index}
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


                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" >添加</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
    componentWillMount(){

        //this.props.params.id 是{id：13} 形式
        this.props.getCategory()
    }


}
function mapStateToProps(state) {
    console.log("state.props.tableData",state.product.tableData)
    return {

        options:state.product.options,
        seriesItem:state.product.tableData,
        validateStatus:state.material.validateStatus,


    }
}
function mapDispatchToProps(dispatch) {
    return {
        getCategory:bindActionCreators(getCategory,dispatch),
        getSeries:bindActionCreators(getSeries,dispatch),
        addPicDetail:bindActionCreators(addPicDetail,dispatch)
    }
}
AddPic.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}
AddPic= Form.create()(AddPic)

export default connect(mapStateToProps,mapDispatchToProps)(AddPic) ;
