import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, FormControl, ControlLabel, ButtonToolbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import moment from 'moment';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import Departments from '../Departments';
import Select from 'react-select';
import EmployeeSelect from '../EmployeeSelect';
import ManageModal from '../ManageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        this.handleEmployeeAssign = this.handleEmployeeAssign.bind(this)
        this.handleDate = this.handleDate.bind(this)
        this.handleUnretire = this.handleUnretire.bind(this)

        this.state = {
            show: false,
            depts: [],
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
            date: new Date(),
            notes:null,
            archived: false
        };
    }

    componentDidMount(){
        axios.post('/employee/getEmployee',{
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            const employee = res.data[0];
            this.setState({
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                affiliation: employee.affiliation,
                depts: employee.department.split(', ').map(department => ({value: department, label: department})),
                supervisor: employee.super_first?{value: employee.supervisor_id, label:employee.super_first+' '+employee.super_last}:null,
                reviewer: employee.reviewer_first?{value: employee.reviewer_id, label:employee.reviewer_first+' '+employee.reviewer_last}:null,
                time_approver: employee.time_first?{value: employee.time_approver_id, label:employee.time_first+' '+employee.time_last}:null,
                start: employee.inDate,
                end: employee.outDate,
                notes: employee.notes,
                archived: employee.archived
            })
        })
        .catch(err => {
            alert(err.response.data)
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

    handleDepartment(depts){
        this.setState({depts})
    }

    handleCreateDepartmentOption(value){
        this.setState({
            depts: [...this.state.depts, {value: value, label: value}]
        })        
    }

    handleEmployeeAssign = id => value =>{
        this.setState({ 
            [id]: value
        })
    };

    handleRetire(e){
        e.preventDefault();
        axios.post('/employee/retire', {
            emp_id: this.state.emp_id,
            outDate: moment(this.state.date).format('YYYY-MM-DD')
        })
        .then(res => {
            this.props.history.push('/employees')
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    handleUnretire(){
        axios.post('/employee/unretire', {
            emp_id: this.state.emp_id
        })
        .then(() => {
            this.props.history.push('/employees')
        })
        .catch(err=>{
            console.log(err)
            alert(err.response.data)
        })
    }

    handleDate(date){
        this.setState({
            date: date
        })
    }

    handleUpdate(e){
        axios.post('/employee/update', {
            emp_id: this.state.emp_id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            affiliation: this.state.affiliation,
            department: this.state.depts.map(val => val.value).join(', '),
            supervisor: this.state.supervisor?this.state.supervisor.value:null,
            reviewer: this.state.reviewer?this.state.reviewer.value:null,
            time_approver: this.state.time_approver?this.state.time_approver.value:null,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null,
            outDate: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null,
            notes: this.state.notes
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        });
    }

    render(){
        const isValid = this.state.first_name && this.state.last_name;
        return (
            <React.Fragment>
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
                                    help='Required'
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
                                        {value: 'Part-time/Hourly', label: 'Part-time/Hourly'},
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
                                <Departments
                                    defaultvalue={this.state.depts}
                                    createDept={this.handleCreateDepartmentOption}
                                    handleChange={this.handleDepartment}
                                    depts={this.state.depts}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='supervisor'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Supervisor(s)
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect
                                    value={this.state.supervisor}
                                    onChange={this.handleEmployeeAssign('supervisor')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='reviewer'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Reviewer(s)
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect
                                    value={this.state.reviewer}
                                    onChange={this.handleEmployeeAssign('reviewer')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='time_approver'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Time Approver(s)
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect
                                    value={this.state.time_approver}
                                    onChange={this.handleEmployeeAssign('time_approver')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='start'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Start date
                            </Col>
                            <Col sm={7}>
                                <DatePicker
                                    className='form-control'
                                    selected={this.state.start}
                                    onChange={this.handleStart}
                                />
                            </Col>
                        </FormGroup>
                        {this.state.archived ?
                            <FormGroup controlId='end'>
                                <Col componentClass={ControlLabel} sm={3}>
                                    End date
                                </Col>
                                <Col sm={7}>
                                    <DatePicker
                                        isClearable
                                        className='form-control'
                                        selected={this.state.end}
                                        onChange={this.handleEnd}
                                    />
                                </Col>
                            </FormGroup>
                            : null
                        }
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
                        <FormGroup>
                            <Col smOffset={3} sm={3}>
                                <ButtonToolbar>
                                    <Button type='submit' bsStyle='success' disabled={!isValid}>Update
                                        employee <FontAwesomeIcon icon='check'/></Button>
                                    {!this.state.archived ?
                                        <ManageModal
                                            type='Retire'
                                            title='Retire employee'
                                            size='medium'
                                            date={this.state.date}
                                            handleSubmit={this.handleRetire}
                                            handleDate={this.handleDate}
                                        />
                                        : <Button bsStyle='primary' onClick={this.handleUnretire}>Unarchive</Button>}
                                </ButtonToolbar>
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