/**
 * Created by Liya on 2016/6/16.
 */
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {Icon, Input, Button, Select, Table,Spin,Modal} from 'antd';

import {getVideo,showBox} from '../../actions/video'
import AddVideo from './addVideo'
class Video extends React.Component{
    handleCancel(){
        this.props.showBox(false)
    }
    handleOk(){
        this.props.showBox(false)
    }
    onShowBox(){
        this.props.showBox(true)
    }
        render(){
            return(
                <div>
                    <h2>视频管理</h2>
                    <div style={{marginTop:'10px'}}>
                        <Button type="primary" onClick={this.onShowBox.bind(this)}>
                            <Icon type="plus"/>
                            添加视频
                        </Button>
                        <Input  style={{width:'150px',marginRight:'5px',marginLeft:'15px'}} placeholder="请输入关键词" />
                        <Button type="primary" shape="circle" style={{marginRight:'15px'}}>
                            <Icon type="search" />
                        </Button>

                    </div>
                    <div style={{marginTop:'10px'}}>



                        <Modal title="添加视频" visible={this.props.isShowBox} onOk={this.handleOk.bind(this) }
                               onCancel={this.handleCancel.bind(this)} footer="">
                             <AddVideo></AddVideo>

                        </Modal>


                        <Table   columns={this.props.tableColumn} dataSource={this.props.tableData} >

                        </Table>


                    </div>

                </div>

            )
        }

    componentDidMount(){
        this.props.getVideo()
    }
}
function mapSateToProps(state){
    return{
        tableColumn:state.video.tableColumn,
        tableData:state.video.tableData,
        isShowBox:state.video.isShowBox
    }
}
function mapDispatchToProps(dispatch){
    return{
        getVideo:bindActionCreators(getVideo,dispatch),
        showBox:bindActionCreators(showBox,dispatch)
    }
}
export default connect(mapSateToProps,mapDispatchToProps)(Video)