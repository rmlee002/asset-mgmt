import React, { Component } from 'react';
import { Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import Links from '../Nav';
import Manage from './Manage';
import Add from './Add';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            filtered: []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        let self = this;
        fetch('/employees')
        .then(function(res) {
            if (res.status >= 400){
                throw new Error("Bad response from server");
            }
            return res.json();
        }).then(data => {
            self.setState({employees: data, filtered: data});
        }).catch(err => {
            console.log(err);
        })
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            filtered: nextProps.items
        })
    }

    handleChange(e){
        let currList = [];
        let newList = [];
        if (e.target.value !== ''){
            currList = this.state.employees;
            newList = currList.filter(item => {
                const lower = item.display_name.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lower.includes(filter);
            });
        }
        else {
            newList = this.state.employees;
        }
        this.setState({ filtered: newList});
    }

    render(){
        return(
            <div>
                <Links />

                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter values'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <LinkContainer to='/employees/add'>
                    <Add />
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
                            <tr key={employee.id}>
                                <td>{employee.display_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.affiliation}</td>
                                <td>{employee.department}</td>
                                <td>{employee.supervisor}</td>
                                <td>{employee.reviewer}</td>
                                <td>{employee.time_approver}</td>
                                <td>
                                    {employee.start?
                                    moment(employee.start).utc().format('YYYY-MM-DD'):
                                    ''}
                                </td>
                                <td>
                                    {employee.end?
                                    moment(employee.end).utc().format('YYYY-MM-DD'):
                                    ''}
                                </td>
                                <td><a>Assets</a></td>
                                <td><a>Licenses</a></td>
                                <td>{employee.notes}</td>
                                <td>
                                    <Manage />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}