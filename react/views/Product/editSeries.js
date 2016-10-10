import React, {PropTypes}from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Form, Input, Button, Checkbox, Radio, Tooltip, Icon,Select,message,Modal,Upload} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

import {editSeries,getSeriesDetail,getCategory} from '../../actions/product'

class EditSeries extends React.Component {


    handleSubmit(e) {

        e.preventDefault();
        const props=this.props;
        const  context=this.context

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                props.editSeries(props.defaultValue.Id,props.form.getFieldsValue());
                context.router.push('/product') // 页面跳转
                props.form.resetFields();

                //confirm({
                //    title: '您是否确认提交修改',
                //    onOk() {
                //        props.editSeries(props.defaultValue.Id,props.form.getFieldsValue());
                //        context.router.push('/product') // 页面跳转
                //        props.form.resetFields();
                //
                //    },
                //    onCancel() {},
                //});
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
        this.context.router.push('/product') // 页面跳转
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
        const cateProps= getFieldProps('Cate',{
            initialValue: this.props.defaultValue.Cate,
            rules: [
                { required: true,  message: '请选择分类' },
            ],
            onChange: (e) => {

                if(!e){
                    this.props.validateStatus.cate="error"
                }else{
                    this.props.validateStatus.cate="success"
                }
            }
        })
        const selProps=this.props;
        const uploadProps = {
            name: 'xfile',
            action: '/api/v1/productUpload',
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: "\\"+selProps.defaultValue.Pic,
                thumbUrl: "\\"+selProps.defaultValue.Pic,
            }],

            onChange(info) {

                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {

                    selProps.form.getFieldProps("Pic",{initialValue:info.file.response.path})
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                } else if(info.file.status === 'removed'){
                    console.log("删除")
                    selProps.form.getFieldProps("Pic",{initialValue:""})
                }
            },
            listType: 'picture-card',


        };
        return (
            <div>
                <h2>产品系列修改</h2>
                <Form horizontal >

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
                        id="select"
                        label="类别："
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        hasFeedback
                        validateStatus={ this.props.validateStatus.model.cate}
                        required
                        help={isFieldValidating('CategoryId') ? '校验中...' : (getFieldError('CategoryId') || []).join(', ')}
                        >
                        <Input type="hidden" {...getFieldProps('CategoryId', { initialValue: this.props.defaultValue.CategoryId })}></Input>
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
                        label="图片：">
                        <Upload {...uploadProps}>
                            <Icon type="plus" />
                            <div className="ant-upload-text" >上传照片</div>
                        </Upload>
                        <Input {...getFieldProps("Pic",{initialValue:this.props.defaultValue.Pic})}></Input>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注："
                        help="随便写点什么">
                        <Input type="textarea" placeholder="随便写" {...getFieldProps('Remark')} />
                    </FormItem>


                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit"  onClick={this.handleSubmit.bind(this)} >修改</Button>
                        <Button style={{marginLeft:"40px"}}  type="primary" onClick={this.handleBack.bind(this)}>返回</Button>

                    </FormItem>
                </Form>
            </div>
        );
    }
    componentWillMount(){
        this.props.getSeriesDetail(this.props.params.id)
        //this.props.params.id 是{id：13} 形式
        this.props.getCategory()
    }
}


function mapStateToProps(state) {
    console.log("***********",state.product.result)
    return {
        defaultValue: state.product.getPropsValue,
        options:state.product.options,
        result:state.product.result,
        validateStatus:state.solution.validateStatus
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getCategory:bindActionCreators(getCategory,dispatch),
        editSeries:bindActionCreators(editSeries,dispatch),
        getSeriesDetail:bindActionCreators(getSeriesDetail,dispatch)
    }
}
EditSeries.contextTypes={
    router:PropTypes.object.isRequired

}
EditSeries= Form.create()(EditSeries)


export default connect(mapStateToProps,mapDispatchToProps)(EditSeries) ;

