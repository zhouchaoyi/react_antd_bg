/**
 * Created by zhouchaoyi on 2016/10/18.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Checkbox,Modal,Spin,Select,Radio} from 'antd';
import {addItem,queryItemById,updateItem,showSaving,reset,getParentDept} from '../../../actions/department_list'
import {getQueryString} from '../../../utils'

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
        this.props.getParentDept(param); //获取父部门options
        let id = getQueryString("id");
        if(id && id.length>0) {
            this.props.queryItemById(id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            this.context.router.replace('/template/user/department_list');
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
                if(this.props.itemProp.departmentId && this.props.itemProp.departmentId!="") {
                    data.id = this.props.itemProp.departmentId;
                    data.classId = this.props.itemProp.classId;
                    this.props.updateItem(data);
                }else {
                    this.props.addItem(data);
                }
            }
        });
    }

    handleBack(e){
        this.props.reset();
        this.context.router.replace('/template/user/department_list');
    }

    render() {
        let _self = this;
        const { getFieldDecorator, getFieldError, isFieldValidating,setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 10},
        };

        //生成父部门的options
        let parentDept = [];
        this.props.parentDept.map(item => {
            let tempItem = Object.assign({},item);
            parentDept.push(tempItem);
        });
        //console.log("parentDept",parentDept); 
        if(parentDept && parentDept.length>0) {
            for (var i = 0; i < parentDept.length; i++) {
                for(var j=0;j<parentDept[i].classId.length/10;j++){
                    if(parentDept[i].departmentName.indexOf("└")==-1) {
                        parentDept[i].departmentName="└"+parentDept[i].departmentName;
                    }
                    if(j>0) {
                        parentDept[i].departmentName = "　" + parentDept[i].departmentName;
                    }
                }
            }
            if(parentDept[0].departmentId!=-1) {
                var data={};
                data.departmentId=-1;
                data.departmentName="-请选择-";
                data.classId = "";
                parentDept.unshift(data);
            }
            parentDept = parentDept.map(item => {
                return <Option key={item.departmentId}>{item.departmentName}</Option>
            });
        }

        const getParentId = function() {
            let departmentId = _self.props.itemProp.departmentId;
            if(departmentId && departmentId!="") {
                let flag = true;
                _self.props.parentDept.map(item => {
                    if(item.departmentId==_self.props.itemProp.parentId) {
                        flag=false;
                    }
                });
                if(flag) {
                    return "-1";
                }else {
                    return _self.props.itemProp.parentId+"";
                }
            }else {
                let parentId = getQueryString("parentId");
                if(parentId && parentId.length>0) {
                    return parentId+"";
                }else {
                    return "-1";
                }
            }
        }

        return (
            <Spin spinning={this.props.saving} tip="保存中...">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="部门名称："
                        >
                        {getFieldDecorator('departmentName', {
                            initialValue: this.props.itemProp.departmentName,
                            rules: [
                                { required: true, min: 1, message: '部门名称不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="父部门："
                    >
                        {getFieldDecorator('parentId',{
                            initialValue: getParentId()
                        })(
                            <Select style={{ width: 200 }}>
                                {parentDept}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="代码："
                        >
                        {getFieldDecorator('departmentKey', {
                            initialValue: this.props.itemProp.departmentKey
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="描述："
                    >
                        {getFieldDecorator('remark',{
                            initialValue: this.props.itemProp.remark
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="类型："
                    >
                        {getFieldDecorator('isTypeOnly',{
                            valuePropName: 'checked',
                            initialValue: this.props.itemProp.isTypeOnly=="1"?true:false
                        })(
                            <Checkbox >
                                非实体部门(仅作分类使用)
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
        isShowBox:state.department_list.isShowBox,
        itemProp: state.department_list.itemProp,
        saving: state.department_list.saving,
        reloadGrid: state.department_list.reloadGrid,
        parentDept: state.department_list.parentDept
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addItem:bindActionCreators(addItem,dispatch),
        queryItemById:bindActionCreators(queryItemById,dispatch),
        updateItem:bindActionCreators(updateItem,dispatch),
        showSaving:bindActionCreators(showSaving,dispatch),
        reset:bindActionCreators(reset,dispatch),
        getParentDept:bindActionCreators(getParentDept,dispatch)
    }
}

FormComponent= Form.create()(FormComponent);


export default connect(mapStateToProps,mapDispatchToProps)(FormComponent);