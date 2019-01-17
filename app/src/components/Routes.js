import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Employees from './Employees/Employees';
import Software from './Software';
import protect from './protect';
import ManageEmployee from './Employees/Manage';
import Assets from './Assets/Assets';
import AddAssets from './Assets/AddNew';
import History from './Assets/History';
import ManageAsset from './Assets/Manage';
import EmployeeAssets from './Employees/EmployeeAssets';
import AddAsset from './Employees/AddAsset';

export default () => 
    <Switch>
        <Redirect exact from='/' to='/home'/>
        <Route path='/home' component={Home} />
        <Route path='/login' component={Login} />
        <Route exact path='/employees' component={protect(Employees)} />
        <Route exact path='/assets' component={protect(Assets)} />
        <Route path='/assets/add' component={protect(AddAssets)} />
        <Route path='/assets/history/:asset_id' component={protect(History)} />
        <Route exact path='/assets/manage/:asset_id' component={protect(ManageAsset)} />
        <Route path='/software' component={protect(Software)} />
        <Route path='/employees/manage/:emp_id' component={protect(ManageEmployee)} />
        <Route exact path='/employees/:emp_id/assets' component={protect(EmployeeAssets)} />
        <Route path ='/employees/:emp_id/addAsset' component={protect(AddAsset)} />
    </Switch>