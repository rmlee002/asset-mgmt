import React, { Component } from 'react';
import { Link } from'react-router-dom';
import { Table, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import "../../Styles/Employees.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Filter from '../Filter';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            filtered: [],
            showArchived: false,
            loggedIn: false,
            theight: document.documentElement.clientHeight - 255
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount(){
        axios.get('/employee')
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

        window.addEventListener('resize', this.handleResize)
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

    handleFilter(options){
        this.setState({
            filtered: this.state.employees.filter((emp)=>!emp.archived || options.showArchived).filter(item => 
                moment(item.start).isSameOrAfter(options.start)
                &&
                moment(item.start).isSameOrBefore(options.end)
                &&
                (options.depts.length > 0 ? options.depts.map(dept => dept.value).some(dept => item.department.split(', ').includes(dept)): true)
            ),
            showArchived: options.showArchived
        })
    }

    handleResize(){
        const h = document.documentElement.clientHeight - 255
        this.setState({
            theight: h
        })
    }

    render(){
        const loggedIn = this.state.loggedIn
        const licensesHead = {
            width: loggedIn?'70px':'86.5px'
        }
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
                {loggedIn &&
                    <LinkContainer to='/employees/add'>
                        <Button className='pull-right' bsStyle='primary'><FontAwesomeIcon icon='user-plus'/> Add employee</Button>
                    </LinkContainer>
                }
                <Filter handleFilter={this.handleFilter} checkbox/>
                <div className='data' id='employees'>
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
                                <th style={licensesHead}>Licenses</th>
                                {loggedIn && <th></th>}
                            </tr>                            
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map(employee =>
                                <tr key={employee.emp_id}>
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
                                            <Link to={`/employees/${employee.emp_id}/manage`}>
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