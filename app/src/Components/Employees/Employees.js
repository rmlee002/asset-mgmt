import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';
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
            loggedIn: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount(){
        axios.get('/employee')
        .then(res => {
            console.log(res.data);
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

    handleFilter(options){
        this.setState({
            filtered: this.state.employees.filter((emp)=>!emp.archived || options.showArchived).filter(item => 
                moment(item.inDate).utc().isSameOrAfter(options.start)
                &&
                (options.end? moment(item.inDate).utc().isSameOrBefore(options.end) : true)
                &&
                (options.depts.length > 0 ? options.depts.map(dept => dept.value).some(dept => item.department.split(', ').includes(dept)): true)
            ),
            showArchived: options.showArchived
        })
    }

    render(){
        const loggedIn = this.state.loggedIn;

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
                width: 240
            },
            {
                Header: "Affiliation",
                accessor: "affiliation",
                width: 90
            },
            {
                Header: "Department",
                accessor: "department",
                width: 90
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
                accessor: "inDate",
                Cell: val => moment(val.value).utc().format('YYYY-MM-DD'),
                width: 90
            },
            {
                Header: "End Date",
                accessor: "outDate",
                Cell: val => val.value? moment(val.value).utc().format('YYYY-MM-DD') : null,
                width: 90
            },
            {
                Header: "Notes",
                accessor: "notes",
                style: { 'white-space': 'unset' }
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
                    SubComponent={row => {
                        return (
                            <div style={{margin: 'auto', padding: '20px'}}>
                                <ButtonToolbar>
                                    <LinkContainer to={`/employees/${row.original.emp_id}/assets`}>
                                        <Button bsStyle={'primary'}>Assets</Button>
                                    </LinkContainer>

                                    <LinkContainer to={`/employees/${row.original.emp_id}/licenses`}>
                                        <Button bsStyle={'primary'}>Licenses</Button>
                                    </LinkContainer>
                                    {this.state.loggedIn &&
                                        <LinkContainer to={`/employees/${row.original.emp_id}/manage`}>
                                            <Button bsStyle={'primary'}> Edit <FontAwesomeIcon icon='edit'/></Button>
                                        </LinkContainer>
                                    }
                                </ButtonToolbar>
                            </div>
                        )
                    }}
                />
            </React.Fragment>
        );
    }
}