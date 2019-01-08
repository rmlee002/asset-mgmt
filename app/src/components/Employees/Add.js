import React, { Component } from 'react';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";

import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default class Add extends Component{
    constructor(props){
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            success: false,
            show: false,
            first_name: '',
            last_name: '',
            email: '',
            supervisor: '',
            reviewer: '',
            time_approver:'',
            start: new Date(),
            end: new Date(),
            notes:''
        };
    }

    handleClose(){
        this.setState({
            show: false
        });
    }

    handleShow(){
        this.setState({
            show: true
        });
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
            [e.target.id] : e.target.value
        });
    }

    handleSubmit(e){
        e.preventDefault()
        axios.post('/employees/add', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            supervisor: this.state.supervisor,
            reviewer: this.state.reviewer,
            time_approver: this.state.time_approver,
            start: this.state.start,
            end: this.state.end,
            notes: this.state.notes
        })
        .then(res => {
            alert('reached');
            if (res.status >= 400){
                alert(res.data.error);
            }
            else{
                this.setState({
                    success: true
                });
                alert(this.state.success);
            }
        })
        .catch(err => {
            console.log(err);
            alert('Error: Please try again');
        });
    }

    render(){
        return(
            <div>
                <Button bsStyle='link' onClick={this.handleShow}>
                    Add employee
                </Button>
                <Modal show = {this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                    <FormControl componentClass='select' placeholder='Select affiliation' onChange={this.handleChange}>
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
                                    <FormControl componentClass='select' placeholder='Select department' onChange={this.handleChange}>
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
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type = 'submit' bsStyle='success'>Add Employee</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }    
}