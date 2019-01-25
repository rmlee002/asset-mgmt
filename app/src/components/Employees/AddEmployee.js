import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Links from '../Nav';
import Departments from '../Departments';
import Select from 'react-select';
import EmployeeSelect from '../EmployeeSelect';

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
            value: [],
            show: false,
            first_name: null,
            last_name: null,
            email: null,
            affiliation: null,
            supervisor: null,
            reviewer: null,
            time_approver:null,
            start: null,
            end: null,
            notes:null
        };
    }

    handleStart(date){
        if(date){
            this.setState({
                start: moment(date).format("YYYY-MM-DD")
            });
        }
        else{
            this.setState({
                start: null
            })
        }
    }

    handleEnd(date){
        if(date){
            this.setState({
                end: moment(date).format("YYYY-MM-DD")
            });
        }
        else{
            this.setState({
                end: null
            })
        }
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

    handleDepartment(value){
        this.setState({value})
    }

    handleCreateDepartmentOption(value){
        this.setState({
            value: [...this.state.value, {value: value, label: value}]
        })        
    }

    handleEmployeeAssign = id => value => {
        this.setState({
            [id]: value?value.value:null
        })
    }

    handleSubmit(e){
        e.preventDefault()
        axios.post('/employees/add', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            affiliation: this.state.affiliation,
            department: this.state.value.map(val => val.value).join(', '),
            supervisor: this.state.supervisor,
            reviewer: this.state.reviewer,
            time_approver: this.state.time_approver,
            start: this.state.start,
            end: this.state.end,
            notes: this.state.notes
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error);
            }
            else{
                this.props.history.push('/employees')
            }
        })
        .catch(err => {
            console.log(err);
            alert(err);
        });
    }

    render(){
        return(
            <div>
                <Links />  
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='first_name' validationState={this.validateFirst}>
                            <Col componentClass={ControlLabel} sm={3}>
                                First Name
                            </Col>
                            <Col sm={7}>
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
                            <Col sm={7}>
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
                            <Col sm={7}>
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
                            <Col sm={7}>
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
                            <Col sm={7}>
                                <Departments createDept = {this.handleCreateDepartmentOption} handleChange={this.handleDepartment} value={this.state.value}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='supervisor'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Supervisor(s)
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect onChange={this.handleEmployeeAssign('supervisor')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='reviewer'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Reviewer(s)
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect onChange={this.handleEmployeeAssign('reviewer')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='time_approver'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Time Approver(s)
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect onChange={this.handleEmployeeAssign('time_approver')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='start'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Start date
                            </Col>
                            <Col sm={7}>
                                <DatePicker
                                    selected={this.state.start}
                                    onChange={this.handleStart}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='end'>
                            <Col componentClass={ControlLabel} sm={3}>
                                End date
                            </Col>
                            <Col sm={7}>
                                <DatePicker
                                    selected={this.state.end}
                                    onChange={this.handleEnd}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='notes'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Notes
                            </Col>
                            <Col sm={7}>
                                <FormControl 
                                    type='text'
                                    value={this.state.notes}
                                    placeholder='Notes'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <Button type = 'submit' bsStyle='success'>Add Employee</Button>
                    </Form>    
                </form>                               
            </div>
        );
    }
}

function nullify(value){
    if (value === '' || value==='Select...') {
        return null
    }
    return value
}