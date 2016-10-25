/**
 * Created by zhouchaoyi on 2016/10/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Button, Table,Modal} from 'antd';
import {getUserType,showBox,queryUserTypeById,delUserType} from '../../../actions/user_type'
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


class UserType extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount(){
        this.props.getUserType(1,this.props.tableData.pageSize);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.reloadGrid) {
            //console.log("come in componentWillReceiveProps <<<<<<<<<<");
            this.props.getUserType(this.props.tableData.currentPage,this.props.tableData.pageSize);
        }
    }

    // componentWillUpdate(nextProps, nextState) {
    //     //console.log("componentWillUpdate <<<<<<<<<<<<<");
    // }

    onShowBox(e) {
      this.props.showBox(true)
    }

    editUserType(typeId,e) {
        //console.log(e);
        this.props.queryUserTypeById(typeId);
        //this.props.showBox(true);
    } 

    delUserType(typeId,e) {
        let _self = this;
        if(typeId=="" && keys.length==0) {
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
                if(typeId!="") {
                    ids = typeId;
                }else {
                    ids = keys.join(",");
                }
                //console.log(ids);
                _self.props.delUserType(ids,_self.props.tableData);
            },
            onCancel() {},
        });
    } 

    render() {
        let _self = this;
        const tableColumn = [
            {title: '角色名', dataIndex: 'typeName',key:'typeName',
                render: (text,record) => <a onClick={this.editUserType.bind(this,record.typeId)}>{text}</a>},
            {title: '描述', dataIndex: 'remark',key:'remark'},
            {title: '状态',dataIndex: 'status',key:'status',render: (text) => {
                if(text=="1") {
                    return <span style={{color:"green"}}>启用</span>
                }else if(text=="0") {
                    return <span style={{color:"red"}}>禁用</span>
                }
            }},
            {title: '操作',dataIndex: 'operate',key:'operate',render: (text,record) => {
                return <div>
                            <a onClick={this.editUserType.bind(this,record.typeId)}><Icon type="edit" /></a> 
                            <span> | </span> 
                            <a onClick={this.delUserType.bind(this,record.typeId)}><Icon type="delete" /></a>
                       </div>
            }}
        ];
        
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                // console.log("onChange<<<<<<");
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                keys=selectedRowKeys;
            },
            onSelect(record, selected, selectedRows) {
                // console.log("onSelect<<<<<<");
                // console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
                // console.log("onSelectAll<<<<<<");
                // console.log(selected, selectedRows, changeRows);
            }
        };

        const pagination = {
            total: this.props.tableData.total,
            pageSize: this.props.tableData.pageSize,
            current: this.props.tableData.currentPage,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _self.props.getUserType(current,pageSize);
            },
            onChange(current) {
                _self.props.getUserType(current,_self.props.tableData.pageSize);
            },
            showTotal: () => "共 "+this.props.tableData.total+" 条记录"
        };

        return (
            <div>
                <h1>用户角色</h1>
                <div style={{marginTop:'10px'}}>

                    <Button type="primary"   onClick={this.onShowBox.bind(this)}>
                        <Icon type="plus"/>
                        添加角色
                    </Button>
                    <Button type="ghost" style={{marginLeft:'10px'}} onClick={this.delUserType.bind(this,"")}>
                       <Icon type="delete" />
                        批量删除
                    </Button>
                    
                    <UserTypeFormModel></UserTypeFormModel>

                </div>

                <div style={{marginTop:'10px'}}>
                    <Table size="small" rowKey="typeId" rowSelection={rowSelection} columns={tableColumn} 
                            dataSource={this.props.tableData.items} pagination={pagination} loading={this.props.loading} />
                </div>
            </div>

        )
    }
    
}

UserType.contextTypes = contextTypes;

function mapStateToProps(state) {
    return {
        tableData:state.user_type.tableData,
        reloadGrid: state.user_type.reloadGrid,
        loading: state.user_type.loading
    }
    
}
function mapDispatchToProps(dispatch) {
    return {
        getUserType:bindActionCreators(getUserType,dispatch),
        showBox:bindActionCreators(showBox,dispatch),
        queryUserTypeById:bindActionCreators(queryUserTypeById,dispatch),
        delUserType:bindActionCreators(delUserType,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(UserType)

