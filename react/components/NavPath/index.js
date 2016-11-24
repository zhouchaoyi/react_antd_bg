import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {updateNavPath,updateNavPathByReload} from '../../actions/menu'

import './index.less'

const defaultProps = {
  navpath: []
}
const propTypes = {
  navpath: PropTypes.array
}
const contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

class NavPath extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount() {
	  //console.log("NavPath WillMount<<<<<<<<");
	//   let path = window.location.pathname;
	//   if(path!="/home" && this.props.navpath.length==0) {
	// 	  this.props.updateNavPathByReload(path);
	//   }
  }

  gotoHome() {
	  //console.log("gotoHome<<<<<");
	  this.props.updateNavPath("","","");
	  this.context.router.push("/home");
  }

  render () {
    const { navpath } = this.props
    const bread = navpath.map((item)=>{
      return (
        <Breadcrumb.Item key={'bc-'+item.key}>{item.name}</Breadcrumb.Item>
      )
    })
    return (
      <div className="ant-layout-breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item key='bc-0'><a onClick={this.gotoHome.bind(this)}>首页</a></Breadcrumb.Item>
          {bread}
        </Breadcrumb>
      </div>
    )
  }
}

NavPath.propTypes = propTypes;
NavPath.defaultProps = defaultProps;
NavPath.contextTypes = contextTypes;

function mapStateToProps(state) {
  return {
    navpath: state.menu.navpath
  }
}

function mapDispatchToProps(dispatch) {
    return {
        updateNavPath: bindActionCreators(updateNavPath, dispatch),
        updateNavPathByReload: bindActionCreators(updateNavPathByReload, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(NavPath)
