/**
 * Created by zhouchaoyi on 2016/10/18.
 */
import React,{PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Form, Input, Button,Icon,Checkbox,Modal,Spin,Select,Radio,TreeSelect} from 'antd';
import {addItem,queryItemById,updateItem,showSaving,reset,onChange,getUserType} from '../../../actions/module'
import {getQueryString,getOptions} from '../../../utils'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const CheckboxGroup = Checkbox.Group;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};
let id="";
let parentId="";
let type="";

class FormComponent extends React.Component {

    componentWillMount(){
        //console.log("componentWillMount=<<<<<<<<")
        //console.log("parentId="+getQueryString("parentId"));
        let param = {};
        param.currentPage=-1;
        param.pageSize=-1;
        this.props.getUserType(param); //获取通用权限的角色
        id = getQueryString("id");
        if(id && id.length>0) {
            this.props.queryItemById(id);
        }
        parentId = getQueryString("parentId");
    }

    componentWillReceiveProps(nextProps) {
        //console.log("componentWillReceiveProps=<<<<<<<<")
        if(nextProps.reload) {
            this.context.router.replace('/template/perm/module');
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
                data.userType = data.userType.join();
                if(data.userType!="" && data.userType.substring(0,1)==",") {
                    data.userType = data.userType.substring(1);    
                }
                //console.log(data);
                this.props.showSaving(true);
                if(this.props.itemProp.moduleId && this.props.itemProp.moduleId!="") {
                    data.id = this.props.itemProp.moduleId;
                    this.props.updateItem(data);
                }else {
                    this.props.addItem(data);
                }
            }
        });
    }

    handleBack(e){
        this.props.reset();
        this.context.router.replace('/template/perm/module');
    }

    onChange(value) {
        // console.log(value);
        //this.props.onChange(value);
    }

    render() {
        const _self = this;
        const { getFieldDecorator, getFieldError, isFieldValidating,setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 10},
        };

        let treeData = [];
        let items = this.props.tableData.items;
        //console.log(this.props.tableData.items);
        let tempArray=[];
        if(items) {
            //将线性数据转换成树形数据
            for(let i=0; items&&i<items.length; i++) {
                let j = items[i].classId.length/10;
                let myItem = Object.assign({},items[i]); //浅复制，防止出现引用变量
                if(tempArray[j-1]) {
                    tempArray[j-1].push(myItem);
                }else {
                    tempArray[j-1]=[];
                    tempArray[j-1].push(myItem);  
                }
                if(myItem.permType==1 || myItem.permType==2) {
                    disableCheckbox.push(myItem.moduleId+'');
                }
            }
            //console.log("tempArray",tempArray);
            for(let i=tempArray.length-1; i>=1; i--) {
                for(let j=0; j<tempArray[i-1].length; j++) {
                    let item = tempArray[i-1][j];
                    for(let k=0; k<tempArray[i].length; k++) {
                        let item2 = tempArray[i][k];
                        if(item2.parentId == item.moduleId) {
                            if(item.children) {
                                item.children.push(item2);
                            }else {
                                item.children=[];
                                item.children.push(item2);
                            }
                        }
                    }
                }
            }
            //console.log("treeData",tempArray[0]);
            let rootNode = {};
            rootNode.moduleId="-1";
            rootNode.moduleName="根节点";
            rootNode.children=tempArray[0];
            treeData[0] = rootNode;
        }

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
            if(type=="0") { //如果显示的是用户权限
                if(item.permType=="1") { //通用权限
                    remark = <span style={{color:"red",fontWeight:"bold"}}>("{item.permRemark}"通用权限)</span>;
                }else if(item.permType=="2") { //组权限
                    remark = <span style={{color:"maroon",fontWeight:"bold"}}>(组权限)</span>;
                }
            }
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

        const getparentId = ()=> {
            if(id && id.length>0) {
                return this.props.itemProp.parentId+"";
            }else {
                if(parentId && parentId.length>0) {
                    return parentId
                }else {
                    return this.props.itemProp.parentId+"";
                }
            }
        }

        return (
            <Spin spinning={this.props.saving} tip="保存中...">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label="父节点："
                    >
                        {getFieldDecorator('parentId',{
                            initialValue: getparentId(),
                            getValueFromEvent: (value) => {
                                if(value) {
                                    return value;
                                }else {
                                    return _self.props.form.getFieldValue("parentId");
                                }
                            }
                        })(
                            <TreeSelect
                                style={{ width: 300 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择父节点"
                                onChange={this.onChange.bind(this)}
                            >
                                {loop(treeData)}
                            </TreeSelect>
                        )}
                    </FormItem>
                    
                    <FormItem
                        {...formItemLayout}
                        label="名称："
                        >
                        {getFieldDecorator('moduleName', {
                            initialValue: this.props.itemProp.moduleName,
                            rules: [
                                { required: true, min: 1, message: '名称不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="代码："
                        >
                        {getFieldDecorator('moduleCode', {
                            initialValue: this.props.itemProp.moduleCode,
                            rules: [
                                { required: true, min: 1, message: '代码不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="节点类型："
                    >
                        {getFieldDecorator('isPermOnly',{
                            initialValue: this.props.itemProp.isPermOnly+""
                        })(
                            <RadioGroup>
                                <Radio key="0" value="0">模块</Radio>
                                <Radio key="1" value="1">权限</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="通用权限："
                    >
                        {getFieldDecorator('userType',{
                            initialValue: this.props.itemProp.userType.split(",")
                        })(
                            <CheckboxGroup options={this.props.userTypeList} />
                        )}
                        <div style={{color:"blue"}}>选择为某用户类型的通用权限（此类型用户默认具有）。</div>
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
                        label="模块路径："
                    >
                        {getFieldDecorator('url',{
                            initialValue: this.props.itemProp.url
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="关联接口："
                    >
                        {getFieldDecorator('relationUrl',{
                            initialValue: this.props.itemProp.relationUrl
                        })(
                            <Input type="textarea" autosize={{minRows: 8}}/>
                        )}
                        <div style={{color:"gray"}}>多个接口用回车间隔</div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="类别："
                    >
                        {getFieldDecorator('bExt',{
                            valuePropName: 'checked',
                            initialValue: this.props.itemProp.bExt=="1"?true:false
                        })(
                            <Checkbox >
                                分类目录
                            </Checkbox>
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
        isShowBox:state.module.isShowBox,
        itemProp: state.module.itemProp,
        saving: state.module.saving,
        reload: state.module.reload,
        tableData: state.module.tableData,
        userTypeList: state.module.userTypeList
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addItem:bindActionCreators(addItem,dispatch),
        queryItemById:bindActionCreators(queryItemById,dispatch),
        updateItem:bindActionCreators(updateItem,dispatch),
        showSaving:bindActionCreators(showSaving,dispatch),
        reset:bindActionCreators(reset,dispatch),
        onChange:bindActionCreators(onChange,dispatch),
        getUserType:bindActionCreators(getUserType,dispatch)
    }
}

FormComponent= Form.create()(FormComponent);


export default connect(mapStateToProps,mapDispatchToProps)(FormComponent);