import React, { Component } from 'react';
import { Link } from'react-router-dom';
import { Table, FormGroup, FormControl, ControlLabel, Button, Checkbox} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import "../../Styles/Employees.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            filtered: [],
            showArchived: false,
            loggedIn: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
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

        axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.first_name + ' ' + item.last_name).toLowerCase().includes(filterText.toLowerCase()))
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
        const loggedIn = this.state.loggedIn

        return(
            <React.Fragment>
                <FormGroup>
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter a name'
                        onChange = {this.handleChange}
                    />
                </FormGroup>          
                <Checkbox checked={this.state.showArchived} onChange={this.handleCheck} inline>
                    Show retired
                </Checkbox>

                {loggedIn &&
                    <LinkContainer to='/employees/add'>
                        <Button className='pull-right' bsStyle='primary'><FontAwesomeIcon icon='user-plus'/> Add employee</Button>
                    </LinkContainer>
                }

                <div className='data employees'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Affiliation</th>
                                <th>Department</th>
                                <th>Supervisor</th>
                                <th>Reviewer</th>
                                <th>Time approver</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Notes</th>
                                <th>Assets</th>
                                <th>Licenses</th>
                                {loggedIn && <th></th>}
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
                                    <td>{employee.notes}</td>
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
                                    {loggedIn && 
                                        <td>
                                            <Link to={`/employees/manage/${employee.emp_id}`}>
                                                <FontAwesomeIcon icon='edit'/>
                                            </Link>
                                        </td>
                                    }                                    
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}