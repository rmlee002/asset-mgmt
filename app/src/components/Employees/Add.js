import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, HelpBlock} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Links from '../Nav'

export default class AddEmployee extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            success: false,
            error: false,
            show: false,
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

    handleSubmit(e){
        e.preventDefault()
        axios.post('/employees/add', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            affiliation: this.state.affiliation,
            department: this.state.department,
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
                this.handleClose();
                this.props.refresh();
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
                                <FormControl componentClass='select' onChange={this.handleChange}>
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
                                <FormControl componentClass='select' onChange={this.handleChange}>
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