import React, {PropTypes} from 'react'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'
import './index.less'
import { Link } from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {logout} from '../../actions/user'
import {delCookie} from '../../utils'
import {loginUrl} from '../../common/app';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

 class Header extends React.Component {
  constructor () {
    super()
  }

  handleClick () {

    console.log("dd")
  }
   logout(e){
     console.log(this.props)
     //this.props.logout(this.props)
     delCookie("token");
    top.location.href=loginUrl;  
    //this.context.router.replace('/login');
     //console.log("logout")
   }

  render () {
    const {user} = this.props
    return (
      <div className='ant-layout-header'>
        <Menu className="header-menu"
        mode="horizontal">
          <SubMenu title={<span><Icon type="user" />{user.user}</span>}  >
            {/*<Menu.Item key="setting:2" >选项2</Menu.Item>
            <Menu.Divider />*/}
            <Menu.Item key="setting:3" > <a onClick={this.logout.bind(this)}>注销</a></Menu.Item>
          </SubMenu>
            { /*<Menu.Item key="mail">
            <Icon type="question" />帮助
          </Menu.Item>*/}
        </Menu>
      </div>
    )
  }





}
function mapStateToProps(state) {
    const {user} = state;
    //console.log("user<<<<<<<");
    //console.log(user);
    return { loggingOut: user.loggingOut};
}
function mapDispatchToProps(dispatch) {
  return {
    logout: bindActionCreators(logout, dispatch)
  }
}
Header.contextTypes = contextTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Header)
