import React from 'react'
import {connect} from 'react-redux'

class Home extends React.Component {

    render() {
        let userName="";
        let userType="";
        let sex="";
        if(this.props.user) {
            //console.log(this.props.user);
            userName=this.props.user.userName;
            userType=this.props.user.userType;
            sex=this.props.user.sex=="0"?"男":"女";
        }

        return (
            <div>
                {/*<h1>后台首页</h1>*/}
                <div style={{float: "left"}}>
                    <img src="../../../../public/img/default_user.gif"/>
                </div>
                <div style={{float: "left",marginLeft: "25px",marginTop: "30px"}}>
                    <span style={{fontSize:"22px"}}>欢迎您，{userName}</span><br/><br/>
                    <span>身份：{userType}</span><br/><br/>
                    <span>性别：{sex}</span><br/><br/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user:state.user.user
    }
}
export default connect(mapStateToProps)(Home)
