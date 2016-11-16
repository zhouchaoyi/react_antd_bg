/**
 * Created by zhouchaoyi on 2016/10/18.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Checkbox,Modal,Spin,Select,Radio} from 'antd';
import {addItem,queryItemById,updateItem,showSaving,reset,getDept} from '../../../actions/user_group'
import {getQueryString,getOptions} from '../../../utils'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class FormComponent extends React.Component {

    componentWillMount(){
        //console.log("componentWillMount=<<<<<<<<")
        let param = {};
        param.currentPage=-1;
        param.pageSize=-1;
        param.orderBy="classId,1";
        this.props.getDept(param); //获取所属部门options
        let id = getQueryString("id");
        if(id && id.length>0) {
            this.props.queryItemById(id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            this.context.router.replace('/template/user/user_group_list');
        }
    }
    
    handleSubmit(e){
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }else{
                let data = this.props.form.getFieldsValue();
                //console.log(data);
                this.props.showSaving(true);
                if(this.props.itemProp.groupId && this.props.itemProp.groupId!="") {
                    data.id = this.props.itemProp.groupId;
                    this.props.updateItem(data);
                }else {
                    this.props.addItem(data);
                }
            }
        });
    }

    handleBack(e){
        this.props.reset();
        this.context.router.replace('/template/user/user_group_list');
    }

    render() {
        const _self = this;
        const { getFieldDecorator, getFieldError, isFieldValidating,setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 10},
        };

        return (
            <Spin spinning={this.props.saving} tip="保存中...">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="组名称："
                        >
                        {getFieldDecorator('groupName', {
                            initialValue: this.props.itemProp.groupName,
                            rules: [
                                { required: true, min: 1, message: '组名称不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="组关键字："
                        >
                        {getFieldDecorator('groupKey', {
                            initialValue: this.props.itemProp.groupKey
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="所属部门："
                    >
                        {getFieldDecorator('departmentId',{
                            initialValue: this.props.itemProp.departmentId+""
                        })(
                            <Select style={{ width: 200 }}>
                                {getOptions(this.props.dept,"departmentId","departmentName").map(item => {
                                    return <Option key={item.departmentId}>{item.departmentName}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="备注："
                    >
                        {getFieldDecorator('remark',{
                            initialValue: this.props.itemProp.remark
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="状态："
                    >
                        {getFieldDecorator('status',{
                            valuePropName: 'checked',
                            initialValue: this.props.itemProp.status=="1"?true:false
                        })(
                            <Checkbox >
                                启用
                            </Checkbox>
                        )}
                    </FormItem>

                    <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{marginLeft:"40px"}}  onClick={this.handleBack.bind(this)}>返回</Button>
                    </FormItem>

                </Form>
            </Spin>
        )
    }
}

FormComponent.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        isShowBox:state.user_group.isShowBox,
        itemProp: state.user_group.itemProp,
        saving: state.user_group.saving,
        reloadGrid: state.user_group.reloadGrid,
        dept: state.user_group.dept
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addItem:bindActionCreators(addItem,dispatch),
        queryItemById:bindActionCreators(queryItemById,dispatch),
        updateItem:bindActionCreators(updateItem,dispatch),
        showSaving:bindActionCreators(showSaving,dispatch),
        reset:bindActionCreators(reset,dispatch),
        getDept:bindActionCreators(getDept,dispatch)
    }
}

FormComponent= Form.create()(FormComponent);


export default connect(mapStateToProps,mapDispatchToProps)(FormComponent);