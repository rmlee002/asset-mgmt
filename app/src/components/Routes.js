import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Employees from './Employees/Employees';
import Software from './Software';
import protect from './protect';
import Manage from './Employees/Manage';
import Assets from './Assets/Assets';
import History from './Assets/History';

export default () => 
    <Switch>
        <Redirect exact from='/' to='/home'/>
        <Route path='/home' component={Home} />
        <Route path='/login' component={Login} />
        <Route exact path='/employees' component={protect(Employees)} />
        <Route exact path='/assets' component={protect(Assets)} />
        <Route path='/assets/history/:asset_id' component={protect(History)} />
        <Route path='/software' component={protect(Software)} />
        <Route path='/employees/manage/:emp_id' component={protect(Manage)} />
    </Switch>