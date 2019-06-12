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
import ReactTable from 'react-table';

export default class Employees extends Component {
    constructor(props){
        super(props);
        this.state = {
            employees: [],
            filtered: [],
            showArchived: false,
            loggedIn: false,
            /*theight: document.documentElement.clientHeight - 255,
            nameIcon: 'sort',
            startIcon: 'sort'*/
            // endIcon: 'sort'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        /*this.handleResize = this.handleResize.bind(this);
        this.handleNameSortAscend = this.handleNameSortAscend.bind(this);
        this.handleNameSortDescend = this.handleNameSortDescend.bind(this);
        this.handleStartAscend = this.handleStartAscend.bind(this);
        this.handleStartDescend = this.handleStartDescend.bind(this);*/
        // this.handleEndAscend = this.handleEndAscend.bind(this);
        // this.handleEndDescend = this.handleEndDescend.bind(this);
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
        });

        axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        });

        window.addEventListener('resize', this.handleResize)
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.first_name + ' ' + item.last_name).toLowerCase().includes(filterText.toLowerCase()))
    );

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

   /* handleResize(){
        const h = document.documentElement.clientHeight - 255
        this.setState({
            theight: h
        })
    }

    handleNameSortAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name)}),
            nameIcon: 'sort-up',
            startIcon: 'sort',
            endIcon: 'sort'
        })
    }

    handleNameSortDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return (b.first_name + b.last_name).localeCompare(a.first_name + a.last_name)}),
            nameIcon: 'sort-down',
            startIcon: 'sort',
            endIcon: 'sort'
        })
    }

    handleStartAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return(moment(a.start) - moment(b.start))}),
            startIcon: 'sort-up',
            nameIcon: 'sort',
            endIcon: 'sort'
        })
    }

    handleStartDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return(moment(b.start) - moment(a.start))}),
            startIcon: 'sort-down',
            nameIcon: 'sort',
            endIcon: 'sort'
        })
    }

    handleEndAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return(moment(a.end) - moment(b.end))}),
            endIcon: 'sort-up',
            nameIcon: 'sort',
            startIcon: 'sort'
        })
    }

    handleEndDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return(moment(b.end) - moment(a.end))}),
            endIcon: 'sort-down',
            nameIcon: 'sort',
            startIcon: 'sort'
        })
    }*/

    render(){
        const loggedIn = this.state.loggedIn;
        /*const licensesHead = {
            width: loggedIn?'70px':'86.5px'
        };

        const nameIcon = this.state.nameIcon;
        const startIcon = this.state.startIcon;*/
        // const endIcon = this.state.endIcon

        const columns = [
            {
                Header: "Name",
                id: "name",
                accessor: val => val.first_name + " " + val.last_name,
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Email",
                accessor: "email",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Affiliation",
                accessor: "affiliation"
            },
            {
                Header: "Department",
                accessor: "department"
            },
            {
                Header: "Supervisor",
                id: "supervisor",
                accessor: val => val.super_first? val.super_first + " " + val.super_last : "",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Reviewer",
                id: "reviewer",
                accessor: val => val.reviewer_first? val.reviewer_first + ' ' + val.reviewer_last : "",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Time Approver",
                id: "time_approver",
                accessor: val => val.time_first? val.time_first + ' ' + val.time_last : "",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Start Date",
                accessor: "start",
                Cell: val => moment(val.value).format('YYYY-MM-DD')
            },
            {
                Header: "End Date",
                accessor: "end",
                Cell: val => val.value? moment(val.value).format('YYYY-MM-DD') : null
            },
            {
                Header: "Notes",
                accessor: "notes",
                style: { 'white-space': 'unset' }
            },
            {
                id: "links",
                accessor: val => val,
                Cell: val => {
                    return (
                        <div>
                            <div>
                                <Link to={`/employees/${val.value.emp_id}/assets`}>
                                    Assets
                                </Link>
                            </div>
                            <div>
                                <Link to={`/employees/${val.value.emp_id}/licenses`}>
                                    Licenses
                                </Link>
                            </div>
                            {loggedIn &&
                                <div>
                                    <Link to={`/employees/${val.value.emp_id}/manage`}>
                                        Edit <FontAwesomeIcon icon='edit'/>
                                    </Link>
                                </div>
                            }
                        </div>
                    )
                }
            }
        ];

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
                <br/>
                <br/>
                <ReactTable
                    data={this.state.filtered}
                    columns={columns}
                    className='-striped -highlight'
                   /* SubComponent={row => {
                        return (
                            <div>
                                <Link to={`/employees/${row.original.emp_id}/assets`}>
                                    Assets
                                </Link>
                                <Link to={`/employees/${row.original.emp_id}/licenses`}>
                                    Licenses
                                </Link>
                                {loggedIn &&
                                    <Link to={`/employees/${row.original.emp_id}/manage`}>
                                        Edit <FontAwesomeIcon icon='edit'/>
                                    </Link>
                                }
                            </div>
                        )
                    }}*/
                />
               {/* <div className='data' id='employees'>
                    <Table striped hover>
                        <thead>                            
                            <tr>
                                <th 
                                    className='sort-head'
                                    onClick={(nameIcon==='sort'||nameIcon==='sort-down')?this.handleNameSortAscend:this.handleNameSortDescend}
                                >
                                    Name <FontAwesomeIcon icon={nameIcon}/>
                                </th>
                                <th>Email</th>
                                <th>Affiliation</th>
                                <th>Department</th>
                                <th>Supervisor</th>
                                <th>Reviewer</th>
                                <th>Time approver</th>
                                <th 
                                    className='sort-head'
                                    onClick={(startIcon==='sort'||startIcon==='sort-down')?this.handleStartAscend:this.handleStartDescend}
                                >
                                    Start Date <FontAwesomeIcon icon={startIcon}/>
                                </th>                                
                                <th 
                                    // className='sort-head'
                                    // onClick={(endIcon==='sort'||endIcon==='sort-down')?this.handleEndAscend:this.handleEndDescend}
                                >
                                    End date 
                                     <FontAwesomeIcon icon={endIcon}/>
                                </th>
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
                </div>*/}
            </React.Fragment>
        );
    }
}