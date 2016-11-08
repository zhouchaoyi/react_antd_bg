/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Tree,Modal,Input} from 'antd';
import {listItems,onCheck,reset,onExpand,addItem,isShowInfo,onSelect} from '../../../actions/perm'
import {getQueryString} from '../../../utils'

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

let id="";
let name="";
let type="";
let disableCheckbox = [];
function noop() {
    return false;
}


class Perm extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount(){
        //console.log("componentWillMount<<<<<<<<<");
        id = getQueryString("id");
        name = getQueryString("name");
        type = getQueryString("type");
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        //console.log("componentWillReceiveProps<<<<<<<<<");
        //console.log("showInfo",nextProps.showInfo);
        if(nextProps.showInfo) {
            const modal = Modal.info({
                title: nextProps.infoText,
                content: '',
                onOk() {
                    nextProps.isShowInfo(false);
                }
            });
        }
    }

    loadData() {
        let param={};
        param.currentPage=-1;
        param.pageSize=-1;
        param.orderBy="classId,1";
        param.searchStr="";
        param.permUserId=id;
        param.permType=type;
        this.props.listItems(param);
    }

    handleBack(e){
        this.props.reset();
        this.context.router.replace('/template/user/admin_list');
    }

    onCheck(checkedKeys,e) {
        //console.log("前",checkedKeys);
        //console.log(e.node.props.eventKey);
        let eventKey = e.node.props.eventKey;
        let classId="";
        let items = this.props.tableData.items;
        for(let i=0; items&&i<items.length; i++) {
            if(items[i].moduleId==eventKey && items[i].isParent=='1') {
                classId = items[i].classId;
                break;
            }
        }
        for(let i=0; classId.length>0&&i<items.length; i++) {
            if(items[i].classId.indexOf(classId)==0 && items[i].classId!=classId) { //是子节点
                if(items[i].permType!=1 && items[i].permType!=2) { //不是通用权限或组权限
                    if(e.checked) {
                        if(checkedKeys.indexOf(items[i].moduleId+'')==-1) {
                            checkedKeys.push(items[i].moduleId+'');
                        }
                    }else {
                        let pos = checkedKeys.indexOf(items[i].moduleId+'')
                        if(pos!=-1) {
                            checkedKeys.splice(pos,1);
                        }
                    }
                }
            }    
        }
        //console.log("后",checkedKeys);
        this.props.onCheck(checkedKeys);
    }

    onExpand(expandedKeys) {
        this.props.onExpand(expandedKeys);
    }

    save() {
        let checkedKeys = [];
        for(let i=0;i<this.props.checkedKeys.length;i++) {
            let key = this.props.checkedKeys[i];
            if(disableCheckbox.indexOf(key)==-1) {
                checkedKeys.push(key);
            }
        }
        //alert(checkedKeys.join(","));
        let param={};
        param.id=id;
        param.type=type;
        param.moduleIds=checkedKeys.join(",");
        this.props.addItem(param);
    }

    onSelect(selectedKey) {
        //console.log(selectedKey);
        let itemProp = {};
        for(let i=0;i<this.props.tableData.items.length;i++) {
            let item = this.props.tableData.items[i];
            if(item.moduleId == selectedKey) {
                itemProp = Object.assign({},item);
                break;
            }
        }
        this.props.onSelect(itemProp);
    }

    render() {
        let _self = this;

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
            treeData = tempArray[0];
        }

        const getIconUrl = item => {
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
                    <TreeNode key={item.moduleId} disableCheckbox={item.permType==1 || item.permType==2}  
                        title={showTitle(item)} >
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.moduleId} disableCheckbox={item.permType==1 || item.permType==2}  
                        title={showTitle(item)} />;
        });

        let itemDetail="";
        let itemProp = this.props.itemProp;
        if(itemProp.bExt=="1"&&itemProp.url.length==0) {
            itemDetail = (
                <div>
                    <div>名称：{itemProp.moduleName}</div><br/>
                    <div>代码：{itemProp.moduleCode}</div><br/>
                    <div>说明：{itemProp.remark}</div><br/>
                    <div>类别：{itemProp.bExt==1?'分类目录':'权限/模块'}</div><br/>
                    <div>状态：{itemProp.status==1?'启用':'禁用'}</div>
                </div>
            );
        }else {
            //console.log(relationUrl);
            if(itemProp.relationUrl && itemProp.relationUrl.split) {
                itemProp.relationUrl = itemProp.relationUrl.split("\n").map((item,index) => {
                    return <span key={index}><br/>{item}</span>
                });
            }
            itemDetail = (
                <div>
                    <div>名称：{itemProp.moduleName}</div><br/>
                    <div>代码：{itemProp.moduleCode}</div><br/>
                    <div>通用权限：{itemProp.userType}</div><br/>
                    <div>路径：{itemProp.url}</div><br/>
                    <div>关联接口：{itemProp.relationUrl}</div><br/>
                    <div>说明：{itemProp.remark}</div><br/>
                    <div>类别：{itemProp.bExt==1?'分类目录':'权限/模块'}</div><br/>
                    <div>状态：{itemProp.status==1?'启用':'禁用'}</div>
                </div>
            );
        }

        return (
            <div>
                <div style={{float:"left"}}>
                    <h2>设置权限 - {name}</h2>
                    <div style={{marginTop:'10px'}}>
                        请勾选修改权限设置，修改完成请点击“保存”按钮。
                        <Button type="primary" onClick={this.save.bind(this)}>
                            <Icon type="save"/>
                            保存
                        </Button>
                        <Button onClick={this.loadData.bind(this)} style={{marginLeft:"10px"}}>
                            重置
                        </Button>
                        <Button onClick={this.handleBack.bind(this)} style={{marginLeft:"10px"}}>
                            <Icon type="rollback"/>返回
                        </Button>
                    </div>
                    <Tree
                        checkable={true} checkStrictly={true} 
                        expandedKeys={this.props.expandedKeys} onExpand={this.onExpand.bind(this)} autoExpandParent={false}
                        checkedKeys={this.props.checkedKeys} onCheck={this.onCheck.bind(this)} 
                        onSelect={this.onSelect.bind(this)}
                    >
                        {loop(treeData)}
                    </Tree>
                </div>
                <div style={{display:this.props.showDetail,float:"left",marginTop:"80px",fontSize:"14px"}}>
                    {itemDetail}
                </div>
            </div>
        )
    }
    
}

Perm.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.perm.tableData,
        checkedKeys:state.perm.checkedKeys,
        expandedKeys:state.perm.expandedKeys,
        showInfo:state.perm.showInfo,
        infoText:state.perm.infoText,
        showDetail:state.perm.showDetail,
        itemProp:state.perm.itemProp
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        listItems:bindActionCreators(listItems,dispatch),
        onCheck:bindActionCreators(onCheck,dispatch),
        reset:bindActionCreators(reset,dispatch),
        onExpand:bindActionCreators(onExpand,dispatch),
        addItem:bindActionCreators(addItem,dispatch),
        isShowInfo:bindActionCreators(isShowInfo,dispatch),
        onSelect:bindActionCreators(onSelect,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Perm)

