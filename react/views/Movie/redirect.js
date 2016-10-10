import React, {PropTypes} from 'react'
import {Button, Icon} from 'antd'
import {Link} from 'react-router'


var btnStyle = {
    marginTop: '20px',
    marginBottom: '20px'
}




class Redirect extends React.Component {

    onTest() {
        console.log('begin redirect...')
        this.context.router.push('/movie/table') // 页面跳转
    }

    render() {


        return (
            <div>
                <h2>通过js跳转1</h2>
                <div>
                    <Button type="primary" style={btnStyle} onClick={this.onTest.bind(this)}>点击此处, 通过js跳转</Button>
                </div>


                <h2>链接跳转</h2>
                <div>
                    <Link to="/movie/table">这是链接跳转, 请点击</Link>
                </div>
            </div>
        )
    }


}

Redirect.contextTypes = {
    router: PropTypes.object.isRequired, // 可以通过 this.context.router.replace 进行跳转
    store: PropTypes.object.isRequired
}


export default Redirect