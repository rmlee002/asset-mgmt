import React, { Component } from 'react';
import { Link } from'react-router-dom';
import { Table, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import Links from '../Nav';
import memoize from 'memoize-one';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            filtered: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        axios.get('/employees')
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error);
            }
            this.setState({employees: res.data, filtered: res.data});
        }).catch(err => {
            console.log(err);
            alert(err);
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.first_name+' '+item.last_name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.employees, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.employees
            })
        }
    }

    render(){
        return(
            <div>
                <Links />
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter a name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                
                <LinkContainer to='/employees/add'>
                    <Button bsStyle='primary'>Add employee</Button>
                </LinkContainer>                

                <Table className="employees">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Affiliation</th>
                            <th>Department(s)</th>
                            <th>Supervisor(s)</th>
                            <th>Reviewer(s)</th>
                            <th>Time approver(s)</th>
                            <th>Start date</th>
                            <th>End date</th>
                            <th>Assets</th>
                            <th>Licenses</th>
                            <th>Notes</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map(employee => 
                            <tr>
                                <td>{employee.first_name+' '+employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.affiliation}</td>
                                <td>{employee.department}</td>
                                <td>{employee.supervisor}</td>
                                <td>{employee.reviewer}</td>
                                <td>{employee.time_approver}</td>
                                <td>
                                    {employee.start?
                                    moment(employee.start).utc().format('YYYY-MM-DD'):''}
                                </td>
                                <td>
                                    {employee.end?
                                    moment(employee.end).utc().format('YYYY-MM-DD'):''}
                                </td>
                                <td>
                                    <Link to={`/employees/${employee.emp_id}/assets`}>
                                        Assets
                                    </Link>
                                </td>
                                <td><a>Licenses</a></td>
                                <td>{employee.notes}</td>
                                <td>
                                    <Link to={`/employees/manage/${employee.emp_id}`}>
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}