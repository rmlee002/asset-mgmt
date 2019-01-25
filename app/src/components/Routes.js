import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Employees from './Employees/Employees';
import Software from './Software/Software';
import protect from './protect';
import ManageEmployee from './Employees/ManageEmployee';
import Assets from './Assets/Assets';
import AddAssets from './Assets/AddAsset';
import History from './Assets/History';
import ManageAsset from './Assets/ManageAsset';
import EmployeeAssets from './Employees/EmployeeAssets';
import AddAsset from './Employees/AddEmployeeAsset';
import Users from './Software/Users';
import AddEmployee from './Employees/AddEmployee';
import EditOwner from './Assets/EditOwner';
import AddSoftware from './Software/AddSoftware';
import AddUser from './Software/AddUser';
import EmployeeLicenses from './Employees/EmployeeLicenses';
import AddEmployeeLicense from './Employees/AddEmployeeLicense';
import ManageSoftware from './Software/ManageSoftware';

export default () => 
    <Switch>
        <Redirect exact from='/' to='/home'/>
        <Route path='/home' component={Home} />
        <Route path='/login' component={Login} />
        <Route exact path='/employees' component={Employees} />
        <Route path='/employees/add' component={protect(AddEmployee)} />
        <Route path='/employees/manage/:emp_id' component={protect(ManageEmployee)} />
        <Route exact path='/employees/:emp_id/assets' component={EmployeeAssets} />
        <Route path ='/employees/:emp_id/addAsset' component={protect(AddAsset)} />
        <Route exact path ='/employees/:emp_id/licenses' component={EmployeeLicenses} />
        <Route path='/employees/:emp_id/licenses/add' component={AddEmployeeLicense} />
        <Route exact path='/assets' component={Assets} />
        <Route path='/assets/add' component={protect(AddAssets)} />
        <Route path='/assets/:asset_id/history' component={History} />
        <Route exact path='/assets/manage/:asset_id' component={protect(ManageAsset)} />
        <Route exact path='/assets/editOwner/:asset_id' component={protect(EditOwner)} />
        <Route exact path='/software' component={Software} />
        <Route path='/software/:software_id/manage' component={ManageSoftware} />
        <Route path='/software/add' component={protect(AddSoftware)} />
        <Route exact path='/software/:software_id/users' component={Users} />
        <Route path='/software/:software_id/users/add' component={AddUser} />
    </Switch>