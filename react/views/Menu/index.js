import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import { Tabs,Input,Button,Icon,Table } from 'antd';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {getMenu,createMenu} from '../../actions/weChat_menu'

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

//选择操作，全选，反选
var rowSelection={
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    }
}



class Menu1 extends React.Component {

    constructor(props) {
        super(props)
    }

    handleClickMenu(e) {
       // console.log(this.props)
       //console.log(this.props.show)
       // this.props.show=true
       // console.log(this.props.show)
    }
    saveAndPublish(){
        const menu={"button":JSON.stringify(this.props.tableData)}
        this.props.createMenu(JSON.stringify(menu))
    }
    render() {

        return (
            <div>
                <h1 style={{marginBottom:'10px'}}>微信菜单</h1>
                <div style={{marginTop:'10px'}}>

                    <div style={{marginTop:'10px',marginBottom:'10px'}}> <Link to="/addSubMenu">  <Icon type="plus"/>  添加一级菜单</Link></div>


                    <Table  rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData} >

                    </Table>
                    <p style={{color:'#EF1358',fontSize:'18px',marginBottom:'10px'}}>
                        <Icon type="info-circle-o" style={{paddingRight:'6px'}} />
                        修改菜单后需要点击“发布”才可以同步到微信服务器
                    </p>
                    <div><Button type="primary" onClick={this.saveAndPublish.bind(this)}>发布并保存</Button></div>

                </div>

            </div>

        )
    }
    componentDidMount(){
        this.props.getMenu()
    }
}

Menu1.contextTypes = contextTypes;
function mapStateToProps(state){
    console.log("tableData:",state.weChat_menu.tableData)

    return{

        tableColumn: state.weChat_menu.tableColumn,
        tableData: state.weChat_menu.tableData,
    }
}
function mapDispatchToProps(dispatch){
    return {
        getMenu:bindActionCreators(getMenu,dispatch),
        createMenu:bindActionCreators(createMenu,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Menu1)

