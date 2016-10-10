import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';

import {getAllSolution,getCategory} from '../../actions/solution'


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

class Solution extends React.Component {
    jumpToSolutionCate(){
        this.context.router.push('/solutionCate') // 页面跳转
    }

    render() {
        return (
            <div>
                <h1>解决方案列表</h1>
                <div style={{marginTop:'10px'}}>
                    <Input  style={{width:'150px',marginRight:'5px'}} placeholder="请输入关键词" />
                    <Button type="primary" shape="circle" style={{marginRight:'15px'}}>
                        <Icon type="search" />
                    </Button>
                    <Select defaultValue="请选择" style={{width:'120px'}} onChange={this.handleChange.bind(this)}>

                        {

                            this.props.options.map(function(option) {
                                return(  <Option key={option.Id}
                                value={option.Id}>{option.Name}</Option>)
                             })
                        }

                    </Select>
                    <Button type="primary"  style={{marginLeft:'20px'}} onClick={this.jumpToSolutionCate.bind(this)}>  类别管理</Button>


                </div>
                <div style={{marginTop:'10px'}}> <Link to="/addSolution">  <Icon type="plus"/>  添加解决方案</Link></div>
                <div style={{marginTop:'10px'}}>
                    { this.props.loading == 1 ? (<Spin />) : (<span></span>) }
                    { this.props.loading == 2 ? (<span>
                     <Table rowSelection={rowSelection} columns={this.props.tableColumn} dataSource={this.props.tableData} >

                     </Table>
                    </span>) : (<span></span>) }



                </div>



            </div>
        )

    }
    handleChange(industryId){

        this.props.getAllSolution(industryId);
    }
    componentDidMount(){
        this.props.getAllSolution();
        this.props.getCategory();
    }
    componentWillReceiveProps(nextProps) {

        console.log('new product count=' + nextProps.tableData.length)
        nextProps.tableData.forEach(
            (x, index)=> {
                //console.log(index)
                //console.log(x)
            }

        )

    }

}

//-------------------- 数据和操作的绑定 ----------------------------------------------------
// 将 state 映射到页面中(放到props)
function mapStateToProps(state) {
    return {
        tableColumn: state.solution.tableColumn,
        tableData: state.solution.tableData,
        options:state.solution.options,
        loading: state.solution.loading
    }
}
// 将 action 操作映射到页面中(放到props)
function mapDispatchToProps(dispatch) {
    return {
        getCategory:bindActionCreators(getCategory,dispatch),
        getAllSolution: bindActionCreators(getAllSolution, dispatch),
        //deleteProduct:bindActionCreators(deleteProduct,dispatch),
        //showBox:bindActionCreators(showBox,dispatch),
        //showEditBox:bindActionCreators(showEditBox,dispatch)
    }
}
Solution.contextTypes={
    router:PropTypes.object.isRequired
}
export default connect(mapStateToProps,mapDispatchToProps)(Solution)