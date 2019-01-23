import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Links from '../Nav';
import axios from 'axios';
import moment from 'moment';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import Departments from '../Departments';
import Select from 'react-select';
import EmployeeSelect from '../EmployeeSelect';

export default class ManageEmployee extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleRetire = this.handleRetire.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDepartment = this.handleDepartment.bind(this);
        this.handleCreateDepartmentOption = this.handleCreateDepartmentOption.bind(this);
        this.handleAffiliation = this.handleAffiliation.bind(this)

        this.state = {
            value: [],
            emp_id: this.props.match.params.emp_id,
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

    componentDidMount(){
        axios.post('/employees/getEmployee',{
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status > 400){
                alert(res.data.error);
            }
            const employee = res.data[0];
            this.setState({
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                affiliation: employee.affiliation,
                value: employee.department.split(', ').map(department => ({value: department, label: department})),
                supervisor: employee.supervisor,
                reviewer: employee.reviewer,
                time_approver: employee.time_approver,
                start: employee.start,
                end: employee.end,
                notes: employee.notes
            })
        })
        .catch(err => {
            alert(err)
            console.log(err);
        })
    }

    handleStart(date){
        this.setState({
            start: date
        })
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
            affiliation: value.value
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

    handleRetire(){
        axios.post('/employees/manage/retire', {
            emp_id: this.state.emp_id
        })
        .then(res => {
            if (res.status === 200){
                this.props.history.push('/employees')
            }
            else{
                alert('Error retiring employee. Please try again')
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleUpdate(e){
        axios.post('/employees/manage/update', {
            emp_id: this.state.emp_id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            affiliation: this.state.affiliation,
            department: this.state.value.map(val => val.value).join(', '),
            supervisor: this.state.supervisor,
            reviewer: this.state.reviewer,
            time_approver: this.state.time_approver,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null,
            end: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null,
            notes: this.state.notes
        })
        .then(res => {
            if (res.status >= 400){
                alert('Error updating employee. Please try again')
            }
        })
        .catch(err => {
            alert(err)
        });
    }

    render(){
        const isValid = this.state.first_name && this.state.last_name;        
        return(
            <div>
                <Links />
                <Button bsStyle='danger' onClick={this.handleRetire}>Retire</Button>
                <form onSubmit={this.handleUpdate}>
                    <Form horizontal>
                        <FormGroup controlId='first_name'>
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
                                <HelpBlock bsClass='small'>Required</HelpBlock>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='last_name'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Last Name
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type='text'
                                    value={this.state.last_name}
                                    placeholder='Last name'
                                    help = 'Required'
                                    onChange={this.handleChange}
                                />
                                <HelpBlock bsClass='small'>Required</HelpBlock>
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
                                    value={{value: this.state.affiliation, label: this.state.affiliation}}
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
                        <Button type='submit' bsStyle='success' disabled={!isValid}>Update employee</Button>
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