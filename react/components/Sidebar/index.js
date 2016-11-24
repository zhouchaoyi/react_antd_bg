import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router'
import {getAllMenu, updateNavPath} from '../../actions/menu'


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import './index.less'

const defaultProps = {
    items: [],
    currentIndex: 0
}

const propTypes = {
    items: PropTypes.array,
    currentIndex: PropTypes.number
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        //console.log('props=>')
        //console.log(props)

        this.menuClickHandle = this.menuClickHandle.bind(this);
    }


    componentDidMount() {

        //console.log('begin load menu...router=>')

        //console.log('props=>')
        //console.log(this.props)


        let currentPath = window.location.pathname
        //console.log('currentPath=>' + currentPath)

        this.props.getAllMenu(currentPath)
        //console.log('end load menu...')

    }

    componentWillReceiveProps(nextProps) {


        //console.log(nextProps)
    }

    menuClickHandle(item) {
        // console.log(item)
        // console.log(item.key, item.keyPath)
        // console.log(window.location.pathname)
        //更新面包屑导航
        this.props.updateNavPath(item.keyPath, item.key, window.location.pathname)
    }

    render() {

        const {items} = this.props
        //console.log('render menu...')
        //console.log(items)

        let openKey = []
        const menu = items.map((item) => {
            openKey.push('sub' + item.itemId)
            return (
                <SubMenu
                    key={'sub'+item.itemId}
                    title={<span><Icon type='book' />{item.itemName}</span>}
                >
                    {item.child.map((node) => {

                        // return (
                        //     node.link ?
                        //         <Menu.Item key={'menu'+node.key}>
                        //             <Link to={node.link}>{node.name}</Link>
                        //         </Menu.Item>
                        //         :
                        //         <Menu.Item key={'menu'+node.itemId}>{node.itemName}</Menu.Item>
                        // )
                        return (
                            <MenuItemGroup title={'---'+node.itemName+'---'} key={'ItemGroup'+node.itemId}>
                                {node.child.map((childNode) => {
                                    return  <Menu.Item key={'menu'+childNode.itemId}>
                                                <Link to={'/'+childNode.url.substring(0,childNode.url.indexOf("\."))}>{childNode.itemName}</Link>
                                            </Menu.Item>
                                })}
                            </MenuItemGroup>
                        )
                    })}
                </SubMenu>
            )
        });


        return (
            <aside className="ant-layout-sider">
                <div className="ant-layout-logo">后台管理系统</div>
                <Menu
                    mode="inline" theme="dark" /*openKeys={openKey} selectedKeys={this.props.selectedKey}*/
                    onClick={this.menuClickHandle}
                >
                    {menu}
                </Menu>

            </aside>
        )
    }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

Sidebar.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}

function mapStateToProps(state) {

    return {
        items: state.menu.items,
        currentIndex: state.menu.currentIndex,
        selectedKey: state.menu.selectedKey
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAllMenu: bindActionCreators(getAllMenu, dispatch),
        updateNavPath: bindActionCreators(updateNavPath, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
