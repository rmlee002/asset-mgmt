import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Employees from './Employees/Employees';
import Hardware from './Hardware';
import Software from './Software';
import protect from './protect';
import Add from './Employees/Add';

export default () => 
    <Switch>
        <Redirect exact from='/' to='/home'/>
        <Route path='/home' component={protect(Home)} />
        <Route path='/login' component={Login} />
        <Route exact path='/employees' component={protect(Employees)} />
        <Route path= '/employees/add' component={protect(Add)} />
        <Route path='/hardware' component={protect(Hardware)} />
        <Route path='/software' component={protect(Software)} />
    </Switch>