import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, FormControl, HelpBlock, ControlLabel, ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Links from '../Nav';
import axios from 'axios';

export default class Manage extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        
        this.state = {
            success: false,
            error: false,
            show: false,
            first_name: '',
            last_name: '',
            email: '',
            affiliation: '',
            department: '',
            supervisor: '',
            reviewer: '',
            time_approver:'',
            start: new Date(),
            end: new Date(),
            notes:''
        };
    }

    // componentDidMount(){

    //     let self=this;
    //     axios.post('/employees/getEmployee', {
    //         id: this.props.match.params
    //     })
    //     .then(res => {
    //         if (res.status >= 400){
    //             alert(res.data.err)
    //         }
    //     })
    //     .then(data => {
    //         self.setState({
    //             first_name: data[0].first_name
    //         })
    //         alert(this.state.first_name)
    //     })
    //     .catch(err => {
    //         alert(err)
    //     })
    // }

    componentDidMount(){
        let employee = this.props.location.state
        this.setState({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            affiliation: employee.affiliation,
            department: employee.department,
            supervisor: employee.supervisor,
            reviewer: employee.reviewer,
            time_approver: employee.reviewer,
            start: employee.start,
            end: employee.end,
            notes: employee.notes
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id] : e.target.value
        });
    }

    render(){
        const isValid = this.state.first_name.length > 0 && this.state.last_name.length > 0;
        
        return(
            <div>
                <Links />
                <form onSubmit={this.handleSubmit}>
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
                                <FormControl componentClass='select' selected={this.state.affiliation} onChange={this.handleChange}>
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
                        <ButtonToolbar>
                            <Button type='submit' bsStyle='success' disabled={!isValid}>Update employee</Button>
                            <Button bsStyle='danger'>Retire</Button>
                        </ButtonToolbar>
                         </Form>    
                </form>                   
            </div>
        );
    }
}