import React, { Component } from 'react';
import { Link } from'react-router-dom';
import { Table, FormGroup, FormControl, ControlLabel, Button, Checkbox} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import ReactTable from 'react-table';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            filtered: [],
            showArchived: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentDidMount(){
        axios.get('/employees')
        .then(res => {
            this.setState({
                employees: res.data,
                filtered: res.data.filter((emp)=>!emp.archived)
            });
        }).catch(err => {
            console.log(err);
            alert(err.response.data)
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.employees.filter((emp) => !emp.archived || this.state.showArchived), e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.employees.filter((emp) => !emp.archived || this.state.showArchived)
            })
        }
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.employees.filter((emp)=>!emp.archived || e.target.checked)
        })
    }

    render(){
        const columns=[
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Affiliation',
                accessor: 'affiliation'
            },
            {
                Header: 'Deparment',
                accessor: 'department'
            },
            {
                Header: 'Supervisor',
                accessor: 'supervisor'
            },
            {
                Header: 'Reviewer',
                accessor: 'reviewer'
            },
            {
                Header: 'Time approver',
                accessor: 'time_approver'
            },
            {
                Header: 'Start date',
                accessor: 'start',
                Cell: date => date.value?moment(date.value).format('YYYY-MM-DD'):''
            },
            {
                Header: 'End date',
                accessor: 'end',
                Cell: date => date.value?moment(date.value).format('YYYY-MM-DD'):''
            },
            {
                Header: 'Notes',
                accessor: 'notes'
            },
        ];
        
        return(
            <React.Fragment>
                <div className='header'>
                    <FormGroup controlid="search">
                        <ControlLabel>Search</ControlLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter a name'
                            onChange = {this.handleChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                    <Checkbox checked={this.state.showArchived} onChange={this.handleCheck}>
                        Show retired
                    </Checkbox>                
                    <LinkContainer to='/employees/add'>
                        <Button bsStyle='primary'>Add employee</Button>
                    </LinkContainer>                    
                </div>
                
                <ReactTable
                    data={this.state.filtered}
                    columns={columns}
                />
                {/* <div className='data'>
                    <Table>
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
                                    <td>{employee.super_first?employee.super_first + ' ' + employee.super_last:''}</td>
                                    <td>{employee.reviewer_first?employee.reviewer_first + ' ' + employee.reviewer_last:''}</td>
                                    <td>{employee.time_first?employee.time_first + ' ' + employee.time_last:''}</td>
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
                                    <td>
                                        <Link to={`/employees/${employee.emp_id}/licenses`}>
                                            Licenses
                                        </Link>
                                    </td>
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
                </div> */}
            </React.Fragment>
        );
    }
}