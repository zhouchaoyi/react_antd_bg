/**
 * Created by Liya on 2016/5/10.
 */
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'
import {Select,Input,Button,Icon,Table} from 'antd'

import {getPoster} from '../../actions/material'
class Poster extends React.Component {

    constructor(props) {
        super(props)
    }

    render(){


        return(
            <div>
                <h2 style={{marginBottom:'20px'}}>海报管理</h2>
                <div style={{marginTop:'10px'}}>

                    <Link to="/material/addPoster" style={{marginLeft:'10px'}}>  <Icon type="plus"/>  添加海报</Link>
                </div>
                <div style={{marginTop:'20px'}}>

                    <Table  columns={this.props.posterColumns} dataSource={this.props.posterData} >

                    </Table>
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.props.getPoster("")
    }



    }
function mapStateToProps(state){
    return{
        posterColumns: state.material.posterColumns,
        posterData: state.material.posterData,

    }
}
function mapDispatchToProps(dispatch){
    return{
        getPoster:bindActionCreators(getPoster,dispatch),
        //getPic:bindActionCreators(getPic,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (Poster)
//-------------------- 数据和操作的绑定 ----------------------------------------------------