import React, { Component } from 'react';
import {Route, Switch, Redirect, Link} from 'react-router-dom';
import protect from './protect';
import Login from './Login';
import Home from './Home';

export default class App extends Component {

    render(){
        return (
            <div>
                {/* <li><Link to ='/login'>Login</Link></li>
                <li><Link to='/home'>Home</Link></li>
                
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/home' component={protect(Home)}/>
                </Switch> */}
                <Redirect from='/' to='/home' />
                <Route path='/home' component={protect(Home)} />
                <Route path='/login' component={Login} />
            </div>
        );
    }
}