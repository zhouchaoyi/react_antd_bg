/**
 * Created by Liya on 2016/5/23.
 */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';


import {getCategory,showBox} from '../../actions/solution'
import AddSolutionCate from './addSolutionCate'

class SolutionCate extends React.Component{

    handleBack(e){
        e.preventDefault();
        this.context.router.push('/product') // 页面跳转
    }
    onShowBox() {
        this.props.showBox(true)
    }
    handleOk(){
        this.props.showBox(false);

    }
    handleCancel() {
        this.props.showBox(false);

    }
    render(){

        return(
            <div>
                <h2>方案类别管理</h2>
                <div style={{marginTop:"20px"}}>
                    <Button type="ghost"  style={{marginRight:'10px'}} onClick={this.handleBack.bind(this)}>
                        <Icon type="left" />
                        返回
                    </Button>
                    <Button type="primary"   onClick={this.onShowBox.bind(this)}>
                        <Icon type="plus"/>
                        添加产品类别
                    </Button>

                    <Modal title="添加行业分类" visible={this.props.isShowBox} onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)} footer="">
                        <AddSolutionCate></AddSolutionCate>

                    </Modal>

                </div>
                <div  style={{marginTop:'10px'}}>
                    <Table  columns={this.props.cateColumn}  dataSource={this.props.cateData} >

                    </Table>

                </div>
            </div>
        )
    }
    componentDidMount(){
        this.props.getCategory("");
    }
}

function mapStateToProps(state){
    return{
        cateColumn:state.solution.cateColumn,
        cateData:state.solution.cateData,
        isShowBox: state.solution.isShowBox,
    }
}
function mapDispatchToProps(dispatch){
    return{
        getCategory:bindActionCreators(getCategory,dispatch),
        showBox:bindActionCreators(showBox,dispatch),
    }
}
SolutionCate.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
}

export default connect(mapStateToProps,mapDispatchToProps)(SolutionCate)
