import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Employees from './Employees/Employees';
import Software from './Software/Software';
import protect from './protect'
import ManageEmployee from './Employees/ManageEmployee';
import Laptops from './Assets/Laptops/Laptops';
import AddLaptop from './Assets/Laptops/AddLaptop';
import LaptopHistory from './Assets/Laptops/LaptopHistory';
import ManageLaptop from './Assets/Laptops/ManageLaptop';
import EmployeeAssets from './Employees/EmployeeAssets';
import AddAsset from './Employees/AddEmployeeAsset';
import AssetReporting from './Assets/Reporting/AssetReporting';
import Users from './Software/Users';
import AddEmployee from './Employees/AddEmployee';
import EditOwner from './Assets/Laptops/EditOwner';
import AddSoftware from './Software/AddSoftware';
import AddUser from './Software/AddUser';
import EmployeeLicenses from './Employees/EmployeeLicenses';
import AddEmployeeLicense from './Employees/AddEmployeeLicense';
import ManageSoftware from './Software/ManageSoftware';
import SoftwareOverview from './Software/SoftwareOverview';
import NonLaptops from './Assets/NonLaptops/NonLaptops';
import AddNonLaptop from './Assets/NonLaptops/AddNonlaptop';
import ManageNonLaptop from './Assets/NonLaptops/ManageNonLaptop';
import SoftwareReporting from './Software/SoftwareReporting';

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
        <Route exact path='/assets/laptops' component={Laptops} />
        <Route path='/assets/laptops/add' component={protect(AddLaptop)} />
        <Route path='/assets/laptops/:laptop_id/history' component={LaptopHistory} />
        <Route exact path='/assets/laptops/:laptop_id/manage' component={protect(ManageLaptop)} />
        <Route exact path='/assets/nonlaptops' component={NonLaptops} />
        <Route path='/assets/nonlaptops/add' component={AddNonLaptop} />
        <Route path='/assets/nonlaptops/:hardware_id/manage' component={ManageNonLaptop} />
        <Route path='/assets/reporting/:contract' component={AssetReporting} />
        <Route exact path='/assets/laptops/:laptop_id/editOwner' component={protect(EditOwner)} />
        <Route exact path='/software' component={Software} />
        <Route path='/software/overview' component={SoftwareOverview} />
        <Route path='/software/:software_id/manage' component={protect(ManageSoftware)} />
        <Route path='/software/add' component={protect(AddSoftware)} />
        <Route exact path='/software/:software_id/users' component={Users} />
        <Route path='/software/:software_id/users/add' component={protect(AddUser)} />
        <Route path='/software/reporting/:contract' component = {SoftwareReporting} />
    </Switch>