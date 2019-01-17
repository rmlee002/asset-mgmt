import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Links from '../Nav';
import axios from 'axios';
import moment from 'moment';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";

export default class ManageEmployee extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleRetire = this.handleRetire.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.state = {
            success: false,
            error: false,
            show: false,
            emp_id: this.props.match.params.emp_id,
            first_name: null,
            last_name: null,
            email: null,
            affiliation: null,
            department: null,
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
                department: employee.department,
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

    handleUpdate(){
        axios.post('/employees/manage/update', {
            emp_id: this.state.emp_id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            affiliation: this.state.affiliation,
            department: this.state.department,
            supervisor: this.state.supervisor,
            reviewer: this.state.reviewer,
            time_approver: this.state.time_approver,
            start: moment(this.state.start).format("YYYY-MM-DD"),
            end: moment(this.state.end).format("YYYY-MM-DD"),
            notes: this.state.notes
        })
        .then(res => {
            if (res.status === 200){
                this.forceUpdate();
            }
            else{
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
                                <FormControl componentClass='select' value={this.state.affiliation} onChange={this.handleChange}>
                                    <option>Select...</option>
                                    <option value='Contractor'>Contractor</option>
                                    <option value='Employee'>Employee</option>
                                    <option value='Part-time/Hourly'>Part-time/Hourly</option>
                                    <option value='Intern'>Intern</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='department'>
                            <Col componentClass={ControlLabel} sm={3}>Department</Col>
                            <Col sm={7}>
                                <FormControl componentClass='select' value={this.state.department} onChange={this.handleChange}>
                                    <option>Select...</option>
                                    <option value='CQA'>CQA</option>
                                    <option value='VPT'>VPT</option>
                                    <option value='TCoE'>TCoE</option>
                                    <option value='TI'>TI</option>
                                    <option value='Sharepoint'>Sharepoint</option>                                        
                                    <option value='NGC'>NGC</option>
                                    <option value='NAVSUP'>NAVSUP</option>                                        
                                    <option value='MHV'>MHV</option>
                                    <option value='IDC'>IDC</option>                                        
                                    <option value='VA'>VA</option>
                                    <option value='BD'>BD</option>
                                    <option value='Cm/Tools'>CM/Tools</option>
                                    <option value='DITD'>DITD</option>
                                    <option value='BD'>BD</option>
                                    <option value='HR'>HR</option>
                                    <option value='Accounting'>Accounting</option>
                                    <option value='Legal'>Legal</option>
                                    <option value='IT'>IT</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='supervisor'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Supervisor(s)
                            </Col>
                            <Col sm={7}>
                                <FormControl 
                                    type='text'
                                    value={this.state.supervisor}
                                    placeholder='Supervisor(s)'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='reviewer'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Reviewer(s)
                            </Col>
                            <Col sm={7}>
                                <FormControl 
                                    type='text'
                                    value={this.state.reviewer}
                                    placeholder='Reviewer(s)'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='time_approver'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Time Approver(s)
                            </Col>
                            <Col sm={7}>
                                <FormControl 
                                    type='text'
                                    value={this.state.time_approver}
                                    placeholder='Time approver(s)'
                                    onChange={this.handleChange}
                                />
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