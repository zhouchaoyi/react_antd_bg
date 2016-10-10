import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {Row, Col, Icon} from 'antd'


class Movie extends React.Component {


    render() {

        // 使用 if/else 逻辑, 判断是否显示子页面内容
        var showLayout = (childrenBody) => {
            if (childrenBody) {
                return (<div>{childrenBody}</div>)
            }
            else {
                return (<div><Icon type="arrow-left"/> 请点击左侧</div>)
            }
        }


        return (
            <div>
                <h1 style={{marginBottom:'20px'}}>React 基本功能演示</h1>

                <Row>
                    <Col span="3" style={{background:'#f2f2f2', height:'500px'}}>
                        <ul style={{margin:'20px 0px 0px 10px'}}>
                            <li><Link to="/movie/bind">数据绑定</Link></li>
                            <li><Link to="/movie/redirect">页面跳转</Link></li>
                            <li><Link to="/movie/box">弹窗</Link></li>
                            <li><Link to="/movie/table">表格</Link></li>
                        </ul>
                    </Col>
                    <Col span="21">
                        <div style={{marginTop:'10px', marginLeft:'20px'}}>
                            {showLayout(this.props.children)}
                        </div>
                    </Col>
                </Row>

            </div>

        )
    }
}


export default Movie

