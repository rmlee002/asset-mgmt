import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Employees from './Employees/Employees';
import Software from './Software/Software';
import protect from './protect'
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
import SoftwareOverview from './Software/SoftwareOverview';

export default () => 
    <Switch>
        <Redirect exact from='/' to='/employees'/>
        <Route path='/login' component={Login} />
        <Route exact path='/employees' component={Employees} />
        <Route path='/employees/add' component={protect(AddEmployee)} />
        <Route path='/employees/:emp_id/manage' component={protect(ManageEmployee)} />
        <Route exact path='/employees/:emp_id/assets' component={EmployeeAssets} />
        <Route path ='/employees/:emp_id/assets/add' component={protect(AddAsset)} />
        <Route exact path ='/employees/:emp_id/licenses' component={EmployeeLicenses} />
        <Route path='/employees/:emp_id/licenses/add' component={protect(AddEmployeeLicense)} />
        <Route exact path='/assets' component={Assets} />
        <Route path='/assets/add' component={protect(AddAssets)} />
        <Route path='/assets/:asset_id/history' component={History} />
        <Route exact path='/assets/:asset_id/manage' component={protect(ManageAsset)} />
        <Route exact path='/assets/:asset_id/editOwner' component={protect(EditOwner)} />
        <Route exact path='/software' component={Software} />
        <Route path='/software/overview' component={SoftwareOverview} />
        <Route path='/software/:software_id/manage' component={protect(ManageSoftware)} />
        <Route path='/software/add' component={protect(AddSoftware)} />
        <Route exact path='/software/:software_id/users' component={Users} />
        <Route path='/software/:software_id/users/add' component={protect(AddUser)} />
    </Switch>