/**
 * Created by zhouchaoyi on 2016/10/18.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Checkbox,Modal,Spin,Select,Radio,TreeSelect} from 'antd';
import {addItem,queryItemById,updateItem,showSaving,reset,getFormParentItem,showModule,listModule} from '../../../actions/control_panel'
import {getQueryString,getOptions,transToTreeData} from '../../../utils'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};
let parentId="";
let classId="";
let classLevel="";

class FormComponent extends React.Component {

    componentWillMount(){
        //console.log("componentWillMount=<<<<<<<<")
        parentId = getQueryString("parentId");
        classId = getQueryString("classId");
        classLevel = "1";
        let isShowModule = false;
        if(classId.length==20) {
            classLevel = "2";
            isShowModule=true;
        }
        this.props.showModule(isShowModule);
        //获取父节点信息
        let param2 = {};
        param2.currentPage=-1;
        param2.pageSize=-1;
        param2.orderBy=this.props.orderBy;
        param2.classLevel=classLevel;
        param2.status=false;
        this.props.getFormParentItem(param2);

        if(classLevel=="2") {
            let param={};
            param.currentPage=-1;
            param.pageSize=-1;
            param.orderBy="classId,1";
            param.searchStr="";
            this.props.listModule(param);
        }
        let id = getQueryString("id");
        if(id && id.length>0) {
            this.props.queryItemById(id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            this.context.router.replace('/template/perm/control_panel_list');
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
                if(this.props.itemProp.itemId && this.props.itemProp.itemId!="") {
                    data.id = this.props.itemProp.itemId;
                    this.props.updateItem(data);
                }else {
                    this.props.addItem(data);
                }
            }
        });
    }

    handleBack(e){
        this.props.reset();
        this.context.router.replace('/template/perm/control_panel_list');
    }

    render() {
        let _self = this;
        const { getFieldDecorator, getFieldError, isFieldValidating,setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 10},
        };

        const getParentId = function() {
            let itemId = _self.props.itemProp.itemId;
            if(itemId && itemId!="") {
                let flag = true;
                _self.props.formParentItem.map(item => {
                    if(item.itemId==_self.props.itemProp.parentId) {
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

        let treeData = [];
        let items = this.props.moduleList;
        //console.log(this.props.moduleList);
        let rootNode = {};
        rootNode.moduleId="-1";
        rootNode.moduleName="请选择";
        if(items && items.length>0) {
            //将线性数据转换成树形数据
            let children = transToTreeData(items,"moduleId","parentId");
            rootNode.children=children;
        }
        treeData[0] = rootNode;
        //console.log(treeData);

        const getIconUrl = item => {
            if(item.moduleId=="-1") { //根节点
                return "../../../../public/img/module/manage.gif"
            }
            let icon = "";
            if(item.bExt=="1") { //是分类目录
                if(item.url!="") { //路径不为空
                    if (item.status == "1") { //被启用
                        icon = "../../../../public/img/module/module_fld2.gif";
                    }else {
                        icon = "../../../../public/img/module/module_fld2_forbidden.gif";
                    }
                }else {
                    if (item.status == "1") { //被启用
                        icon = "../../../../public/img/module/fld2.gif";
                    }else {
                        icon = "../../../../public/img/module/fld2_forbidden.gif";
                    }
                }
            }else {
                if (item.isPermOnly == "1") { //是权限
                    if (item.status == "1") {
                        icon = "../../../../public/img/module/perm_icon.gif";
                    } else {
                        icon = "../../../../public/img/module/perm_icon_forbidden.gif";
                    }
                } else { //是模块
                    if(item.url!="") { //路径不为空
                        if (item.status == "1") { //被启用
                            icon="../../../../public/img/module/module.gif";
                        }else {
                            icon="../../../../public/img/module/module_forbidden.gif";
                        }
                    }else {
                        if (item.status == "1") { //被启用
                            icon="../../../../public/img/module/module2.gif";
                        }else {
                            icon="../../../../public/img/module/module2_forbidden.gif";
                        }
                    }
                }
            }
            return icon;
        };

        const showTitle = item => {
            let remark="";
            return <span> 
                        <img src={getIconUrl(item)}></img>
                        <span style={{fontWeight:"bold"}}>{item.moduleName}</span>
                        {remark}
                   </span>
        }

        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.moduleId} value={item.moduleId+""} disableCheckbox={item.permType==1 || item.permType==2}  
                        title={showTitle(item)} >
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.moduleId} value={item.moduleId+""} disableCheckbox={item.permType==1 || item.permType==2}  
                        title={showTitle(item)} />;
        });

        return (
            <Spin spinning={this.props.saving} tip="保存中...">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

                    <FormItem
                        {...formItemLayout}
                        label="父节点："
                    >
                        {getFieldDecorator('parentId',{
                            initialValue: getParentId()
                        })(
                            <Select style={{ width: 200 }}>
                                {getOptions(this.props.formParentItem,"itemId","itemName").map(item => {
                                    return <Option key={item.itemId}>{item.itemName}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="节点名称："
                        >
                        {getFieldDecorator('itemName', {
                            initialValue: this.props.itemProp.itemName,
                            rules: [
                                { required: true, min: 1, message: '节点名称不能为空' }
                            ]
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
                        label="对应的模块："
                        style={{display:this.props.isShowModule}}
                    >
                        {getFieldDecorator('moduleId',{
                            initialValue: this.props.itemProp.moduleId+"",
                            getValueFromEvent: (value) => {
                                if(value) {
                                    return value;
                                }else {
                                    return _self.props.form.getFieldValue("moduleId");
                                }
                            }
                        })(
                            <TreeSelect
                                style={{ width: 300 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择模块"
                            >
                                {loop(treeData)}
                            </TreeSelect>
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
                                启用相关菜单 <span style={{color:"gray"}}>(如想关闭此菜单及关联子菜单，请取消勾选)</span>
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
        isShowBox:state.control_panel.isShowBox,
        itemProp: state.control_panel.itemProp,
        saving: state.control_panel.saving,
        reloadGrid: state.control_panel.reloadGrid,
        formParentItem: state.control_panel.formParentItem,
        orderBy: state.control_panel.orderBy,
        isShowModule: state.control_panel.isShowModule,
        moduleList: state.control_panel.moduleList
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        addItem:bindActionCreators(addItem,dispatch),
        queryItemById:bindActionCreators(queryItemById,dispatch),
        updateItem:bindActionCreators(updateItem,dispatch),
        showSaving:bindActionCreators(showSaving,dispatch),
        reset:bindActionCreators(reset,dispatch),
        getFormParentItem:bindActionCreators(getFormParentItem,dispatch),
        showModule:bindActionCreators(showModule,dispatch),
        listModule:bindActionCreators(listModule,dispatch)
    }
}

FormComponent= Form.create()(FormComponent);


export default connect(mapStateToProps,mapDispatchToProps)(FormComponent);