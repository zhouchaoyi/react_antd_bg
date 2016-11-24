import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect, useRouterHistory, Link,Lifecycle,browserHistory} from 'react-router';
import {createBrowserHistory, useBeforeUnload} from 'history'

import configureStore from './store/configureStore';

import PageNotFound from './views/PageNotFound'
import App from './views/App';
import Home from './views/Home';
import Login from './views/Login';

import Container from './views/Container';

import {getCookie} from './utils';

//const history = useRouterHistory(createBrowserHistory)({basename: ''})
// history.listenBeforeUnload(function () {
//     return 'Are you sure you want to leave this page?'
// })

const store = configureStore();
//console.log("ffffffffffff")
const validate = function (next, replace, callback) {
        const isLoggedIn = !!getCookie('token')
     if (!isLoggedIn && next.location.pathname != '/login') {
          replace('/login')
     }
    console.log('---------------onEnter----------------------')
    callback()
}



render(
    <Provider store={store}>
        <Router history={browserHistory} >

            <Route path="/" onEnter={validate}>
                <IndexRedirect to="login"/>
                <Route component={App}>
                    <Route path="home" component={Home}/>  
                    <Route path="template/:folder/:subfolder(/:name)" component={Container}/>
                </Route> 

                <Route path="login" component={Login}/>
            </Route>
            <Route path="*" component={PageNotFound}/>
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);
