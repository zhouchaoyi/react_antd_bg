/**
 * Created by Liya on 2016/5/10.
 */
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {Row, Col, Icon} from 'antd'
import { findDOMNode } from 'react-dom';

import './index.less'


const liItem=["poster","pic","page"]
class Material extends React.Component {


    click(ref){
        //添加选中样式
        this.clearClassName(ref)
        const buttonNode = findDOMNode(this.refs[ref]);
        buttonNode.className="actived"
    }
    clearClassName(ref){
        //清除选中样式
        liItem.map(x=>{
            if(ref!=x){
                const buttonNode = findDOMNode(this.refs[x]);
                buttonNode.className=" "
            }
        })
    }
    componentDidMount(){

        //根据路径设置默认选中样式
        const current=window.location.pathname;
        liItem.map(x=>{
            if(current.indexOf(x)>=0){
                const buttonNode = findDOMNode(this.refs[x]);
                buttonNode.className="actived"
            }
        })
    }

    render(){

        // 使用 if/else 逻辑, 判断是否显示子页面内容
        var showLayout = (childrenBody) => {
            if (childrenBody) {
                return (<div>{childrenBody}</div>)
            }
            else {
               // this.context.router.push('/material/poster') // 页面跳转

                return (<div><Icon type="arrow-up"/> 请点击子菜单</div>)
            }
        }

       return(
           <div>

               <Row>
                   <ul className="tab" >
                       <li ><Link to="/material/poster"  ref="poster" onClick={this.click.bind(this,"poster")}>宣传海报</Link></li>
                       <li ><Link to="/material/pic"   ref="pic"   onClick={this.click.bind(this,'pic')}>产品图片</Link></li>
                       <li  ><Link to="/material/page"   ref="page"  onClick={this.click.bind(this,'page')}>宣传单页</Link></li>

                   </ul>
               </Row>

               <Row>

                   <Col span="24">
                       <div style={{marginTop:'10px', marginLeft:'20px'}}>
                           {showLayout(this.props.children)}
                       </div>
                   </Col>
               </Row>

           </div>
       )
    }



}
Material.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}
export default Material
//-------------------- 数据和操作的绑定 ----------------------------------------------------