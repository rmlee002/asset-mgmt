import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Departments from '../Departments';
import Select from 'react-select';
import EmployeeSelect from '../EmployeeSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class AddEmployee extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDepartment = this.handleDepartment.bind(this);
        this.handleCreateDepartmentOption = this.handleCreateDepartmentOption.bind(this);
        this.handleAffiliation = this.handleAffiliation.bind(this)
        this.handleEmployeeAssign = this.handleEmployeeAssign.bind(this)

        this.state = {
            success: false,
            depts: [],
            show: false,
            first_name: null,
            last_name: null,
            email: null,
            affiliation: null,
            supervisor: null,
            reviewer: null,
            time_approver:null,
            start: new Date(),
            end: null,
            notes:null
        };
    }

    handleStart(date){
        this.setState({
            start: date
        });
    }

    handleEnd(date){
        this.setState({
            end: date
        });
    }

    handleChange(e){
        this.setState({
            [e.target.id] : nullify(e.target.value)
        });
    }

    handleAffiliation(value){
        this.setState({
            affiliation: value?value.value:null
        })
    }

    handleDepartment(depts){
        this.setState({depts})
    }

    handleCreateDepartmentOption(value){
        this.setState({
            depts: [...this.state.depts, {value: value, label: value}]
        })        
    }

    handleEmployeeAssign = id => value => {
        this.setState({
            [id]: value?value.value:null
        })
    };

    handleSubmit(e){
        e.preventDefault();
        axios.post('/employee/add', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            affiliation: this.state.affiliation,
            department: this.state.depts.map(val => val.value).join(', '),
            supervisor: this.state.supervisor,
            reviewer: this.state.reviewer,
            time_approver: this.state.time_approver,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null,
            end: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null,
            notes: this.state.notes
        })
        .then(res => {
            this.props.history.push('/employees')
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data);
        });
    }

    render(){
        const invalid = this.state.first_name === null || this.state.last_name === null || this.state.email === null
                        || this.state.affiliation === null || this.state.department === null || this.state.supervisor === null
                        || this.state.reviewer === null || this.state.time_approver === null || this.state.start === null
                        || this.state.depts.length === 0;

        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='first_name' validationState={this.validateFirst}>
                            <Col componentClass={ControlLabel} sm={3}>
                                First Name
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.first_name}
                                    placeholder='First name'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='last_name' validationState={this.validateLast}>
                            <Col componentClass={ControlLabel} sm={3}>
                                Last Name
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.last_name}
                                    placeholder='Last name'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='email'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Email
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='email'
                                    value={this.state.email}
                                    placeholder='Email'
                                    onChange={this.handleChange}
                                />
                            </Col>                                
                        </FormGroup>
                        <FormGroup controlId='affiliation'>
                            <Col componentClass={ControlLabel} sm={3}>Affiliation</Col>
                            <Col sm={6}>
                                <Select
                                    onChange={this.handleAffiliation}
                                    options={[
                                        {value: 'Contractor', label: 'Contractor'},
                                        {value: 'Employee', label: 'Employee'},
                                        {value: 'Part-time/Hourly', label: 'Part-time/Hourly' },
                                        {value: 'Intern', label: 'Intern'}
                                    ]}
                                >
                                </Select>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='department'>
                            <Col componentClass={ControlLabel} sm={3}>Department</Col>
                            <Col sm={6}>
                                <Departments createDept = {this.handleCreateDepartmentOption} handleChange={this.handleDepartment} value={this.state.depts}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='supervisor'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Supervisor
                            </Col>
                            <Col sm={6}>
                                <EmployeeSelect onChange={this.handleEmployeeAssign('supervisor')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='reviewer'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Reviewer
                            </Col>
                            <Col sm={6}>
                                <EmployeeSelect onChange={this.handleEmployeeAssign('reviewer')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='time_approver'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Time Approver
                            </Col>
                            <Col sm={6}>
                                <EmployeeSelect onChange={this.handleEmployeeAssign('time_approver')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='start'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Start date
                            </Col>
                            <Col sm={6}>
                                <DatePicker
                                    className='form-control'
                                    selected={this.state.start}
                                    onChange={this.handleStart}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='end'>
                            <Col componentClass={ControlLabel} sm={3}>
                                End date
                            </Col>
                            <Col sm={6}>
                                <DatePicker
                                    isClearable
                                    className='form-control'
                                    selected={this.state.end}
                                    onChange={this.handleEnd}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='notes'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Notes
                            </Col>
                            <Col sm={6}>
                                <FormControl 
                                    type='text'
                                    value={this.state.notes}
                                    placeholder='Notes'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={3} sm={1}>
                                <Button 
                                    type = 'submit'
                                    bsStyle='success'
                                    disabled={invalid}
                                ><FontAwesomeIcon icon='check'/> Add Employee</Button>
                            </Col>
                        </FormGroup>
                    </Form>    
                </form>                               
            </React.Fragment>
        );
    }
}

function nullify(value){
    if (value === '' || value==='Select...') {
        return null
    }
    return value
}