/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Table,Modal} from 'antd';
import {listItems,delItem} from '../../../actions/admin_list'
import UserTypeFormModel from './form'

const confirm = Modal.confirm;
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

let keys=[];
function noop() {
    return false;
}


class Admin extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount(){
        this.props.listItems(1,this.props.tableData.pageSize);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            //console.log("come in componentWillReceiveProps <<<<<<<<<<");
            this.props.listItems(this.props.tableData.currentPage,this.props.tableData.pageSize);
        }
    }

    onShowBox(e) {
      this.props.showBox(true)
    }

    addItem(e) {
      this.context.router.push('/template/user/admin_list/form');
    }

    editItem(id,e) {
        //console.log(e);
        this.context.router.push({
            pathname: "/template/user/admin_list/form",
            query: {id: id}
        });
    } 

    delItem(id,e) {
        let _self = this;
        if(id=="" && keys.length==0) {
            Modal.warning({
                title: '请选择要删除的项',
                content: '',
            });
            return;
        }
        confirm({
            title: '确定要删除吗',
            content: '',
            onOk() {
                let ids = "";
                if(id!="") {
                    ids = id;
                }else {
                    ids = keys.join(",");
                }
                //console.log(ids);
                _self.props.delItem(ids,_self.props.tableData);
            },
            onCancel() {},
        });
    } 

    render() {
        let _self = this;
        const tableColumn = [
            {title: '登录名', dataIndex: 'loginName',key:'loginName',
                render: (text,record) => {
                    if(record.publicAccount==1) {
                        text = <span>{text}<span style={{color:"gray",fontSize:"8px"}}>(公共账号)</span></span>;
                    }
                    return <a onClick={this.editItem.bind(this,record.userId)}>{text}</a>
                }
            },
            {title: '密码', dataIndex: 'loginPassword',key:'loginPassword'},
            {title: '用户名', dataIndex: 'userName',key:'userName'},
            {title: '证件号', dataIndex: 'idCard',key:'idCard'},
            {title: '性别', dataIndex: 'sex',key:'sex',render: (text) => text==1?"女":"男"},
            {title: '所属组', dataIndex: 'userGroup',key:'userGroup',render:(text) => {
                text = text.map((item)=>{
                    return <span key={item.groupId} style={{fontSize:"12px"}}><Icon type="user"/>{item.groupName}<br/></span>
                })
                return text;
            }},
            {title: '状态',dataIndex: 'status',key:'status',render: (text) => {
                if(text=="1") {
                    return <span style={{color:"green"}}>启用</span>
                }else if(text=="0") {
                    return <span style={{color:"red"}}>禁用</span>
                }
            }},
            {title: '操作',dataIndex: 'operate',key:'operate',render: (text,record) => {
                return <div>
                            <a onClick={this.editItem.bind(this,record.userId)}><Icon type="edit" /></a> 
                            <span> | </span> 
                            <a onClick={this.delItem.bind(this,record.userId)}><Icon type="delete" /></a>
                       </div>
            }}
        ];
        
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                keys=selectedRowKeys;
            }
        };

        const pagination = {
            total: this.props.tableData.total,
            pageSize: this.props.tableData.pageSize,
            current: this.props.tableData.currentPage,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _self.props.listItems(current,pageSize);
            },
            onChange(current) {
                _self.props.listItems(current,_self.props.tableData.pageSize);
            },
            showTotal: () => "共 "+this.props.tableData.total+" 条记录"
        };

        return (
            <div>
                <h1>系统管理员</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.addItem.bind(this)}>
                        <Icon type="plus"/>
                        添加管理员
                    </Button>
                    <span style={{marginLeft:"10px"}}>选择用户：</span>
                    <Button onClick={this.onShowBox.bind(this)}>
                        <Icon type="setting"/>所属用户组
                    </Button>
                    <Button style={{marginLeft:'10px'}} onClick={this.onShowBox.bind(this)}>
                        <Icon type="setting"/>设置权限
                    </Button>
                    <Button type="ghost" style={{marginLeft:'10px'}} onClick={this.delItem.bind(this,"")}>
                       <Icon type="delete" />
                        批量删除
                    </Button>
                    
                </div>

                <div style={{marginTop:'10px'}}>
                    <Table size="small" rowKey="userId" rowSelection={rowSelection} columns={tableColumn} 
                            dataSource={this.props.tableData.items} pagination={pagination} loading={this.props.loading} />
                </div>
            </div>

        )
    }
    
}

Admin.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.admin_list.tableData,
        reloadGrid: state.admin_list.reloadGrid,
        loading: state.admin_list.loading
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        listItems:bindActionCreators(listItems,dispatch),
        delItem:bindActionCreators(delItem,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Admin)

