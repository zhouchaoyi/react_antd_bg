import React from 'react';
import {Link} from 'react-router'

class PageNotFound extends React.Component {
    render() {
        return (
            <div>
                <h1>Page Not Found.</h1>
                <p>Go to <Link to="/home">首页</Link></p>
            </div>
        )
    }
}

export default PageNotFound