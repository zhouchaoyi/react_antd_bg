import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import { Tabs,Input,Button,Icon,Select } from 'antd';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};





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
    deleteWXMenu(){
        console.log("删除菜单")
    }
    editWXMenu(){
        console.log("修改菜单")
    }
    addWXMenu(){
        console.log("添加菜单")
    }
    render() {

        return (
            <div>
                <h1 style={{marginBottom:'10px'}}>微信菜单</h1>
                <Tabs defaultActiveKey="1" type="card" onChange={this.handleClickMenu.bind(this)}>
                    <TabPane tab="产品相关" key="1">

                        {
                           this.props.customMenu.map(x=>{
                              return(
                                  <div style={{padding:'10px'}} key={x.key}>{x.name}
                                      <a onClick={this.editWXMenu.bind(this)} style={{paddingLeft:'10px'}}><Icon type="edit" /></a>
                                      <a onClick={this.deleteWXMenu.bind(this)} style={{paddingLeft:'10px'}}> <Icon type="delete" /></a>
                                     </div>

                              )

                            })
                        }
                        <Button type="ghost" onClick={this.addWXMenu.bind(this)}><Icon type="plus"/>添加菜单</Button>
                        <div style={{marginTop:'10px'}}>
                            <Button type="primary" htmlType="submit" style={{marginTop:'10px'}}>
                                <Icon type="edit" />
                                更新并发布
                            </Button>
                        </div>
                    </TabPane>
                    <TabPane tab="信息活动" key="2"></TabPane>
                    <TabPane tab="在线服务" key="3"></TabPane>
                </Tabs>
            </div>

        )
    }
}

Menu1.contextTypes = contextTypes;
function mapStateToProps(state){
    state.wxMenu.menu.map(x=>{
        console.log("mapS",x.name)
    })
    return{
        customMenu:state.wxMenu.menu
    }
}
export default connect(mapStateToProps,null)(Menu1)

