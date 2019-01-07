import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Links from './Nav';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: []
        }
    }

    componentDidMount(){
        let self = this;
        axios.get('/employees')
        .then(res => {
            if (res.status >= 400){
                throw new Error("Bad response from server");
            }
            return res.json();
        }).then(data => {
            self.setState({employees: data});
        }).catch(err => {
            console.log(err);
        })
    }

    render(){
        return(
            <div>
                <Links />
                <Table className="employees">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Affiliation</th>
                            <th>Department(s)</th>
                            <th>Supervisor(s)</th>
                            <th>Reviewer(s)</th>
                            <th>Time approver(s)</th>
                            <th>Start date</th>
                            <th>End date</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.employees.map(employee => 
                            <tr key={employee.id}>
                                <td>{employee.first_name}</td>
                                <td>{employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.affiliation}</td>
                                <td>{employee.department}</td>
                                <td>{employee.supervisor}</td>
                                <td>{employee.reviewer}</td>
                                <td>{employee.time_approver}</td>
                                <td>{employee.start}</td>
                                <td>{employee.end}</td>
                                <td>{employee.notes}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}