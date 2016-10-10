/**
 * Created by Liya on 2016/5/17.
 */

import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import {Select,Input,Button,Icon,Table} from 'antd'


import {getPage} from '../../actions/material'
class Page extends React.Component{
    render(){
        return(
            <div>
                <h2 style={{marginBottom:'20px'}}>单页管理</h2>
                <div style={{marginTop:'10px'}}>

                    <Link to="/material/addPage" style={{marginLeft:'10px'}}>  <Icon type="plus"/>  添加宣传单页</Link>
                </div>
                <div style={{marginTop:'20px'}}>

                    <Table columns={this.props.pageColumn} dataSource={this.props.pageData} >

                    </Table>
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.props.getPage();
    }
}
function mapStateToProps(state){
    return{
        pageColumn: state.material.pageColumn,
        pageData: state.material.pageData,

    }
}
function mapDispatchToProps(dispatch){
    return{
        getPage:bindActionCreators(getPage,dispatch),
    }
}
export default  connect(mapStateToProps,mapDispatchToProps)(Page)
