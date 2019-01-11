import React, { Component } from 'react';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, Col, HelpBlock} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default class Add extends Component{
    constructor(props){
        super(props)

        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleIn = this.handleIn.bind(this)
        this.handleOut = this.handleOut.bind(this)

        this.state = {
            show: false,
            description: '',
            model: '',
            serial_number: '',
            warranty_providder: '',
            owner: '',
            cost: '',
            comment: '',
            vendor: '',
            order_num: '',
            warranty: '',
            in: new Date(),
            out: new Date(),
            contract: ''
        }
    }

    handleShow(){
        this.setState({
            show: true
        })
    }

    handleClose(){
        this.setState({
            show: false,
            description: '',
            model: '',
            serial_number: '',
            warranty_providder: '',
            owner: '',
            cost: 0,
            comment: '',
            vendor: '',
            order_num: '',
            warranty: '',
            in: new Date(),
            out: new Date(),
            department: ''
        })
    }

    handleIn(date){
        this.setState({
            in: moment(date).format("YYYY-MM-DD")
        });
    }

    handleOut(date){
        this.setState({
            out: moment(date).format("YYYY-MM-DD")
        });
    }

    handleChange(e){
        this.setState({
            [e.target.id]: nullify(e.target.value)
        })
    }

    handleSubmit(){
        axios.post('/assets/add', {
            model: this.state.model,
            serial_number: this.state.serial_number,
            warranty_provider: this.state.warranty_provider,
            owner: this.state.owner,
            cost: this.state.cost,
            comment: this.state.comment,
            vendor: this.state.vendor,
            order_num: this.state.order_num,
            warranty: this.state.warranty,
            in: this.state.in,
            out: this.state.in,
            department: this.state.department
        })
    }

    render(){
        const isValid = this.state.description.length > 0
        return(
            <div>
                <Button bsStyle='primary' onClick={this.handleShow}>
                    Add asset
                </Button> 
                <Modal show = {this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Asset</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit}>
                            <Form horizontal>
                                <FormGroup controlId='description'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Description
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.description}
                                            placeholder='Description'
                                            onChange={this.handleChange}
                                        />
                                        <HelpBlock bsClass='small'>Required</HelpBlock>
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='model'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Model
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.model}
                                            placeholder='Model'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='serial_number'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Serial Number
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.serial_number}
                                            placeholder='Serial Number'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='warranty_provider'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Warranty Provider
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.warranty_provider}
                                            placeholder='Warranty Provider'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='owner'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Owner
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.owner}
                                            placeholder='Owner'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='cost'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Cost
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='number'
                                            value={this.state.cost}
                                            placeholder='Cost'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='comment'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Comment
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.comment}
                                            placeholder='Comment'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='vendor'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Vendor
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.vendor}
                                            placeholder='Vendor'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='order_num'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Order Number
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.order_num}
                                            placeholder='Order Number'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='warranty'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Warranty
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.warranty}
                                            placeholder='Warranty'
                                            onChange={this.handleChange}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='in'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        In Date
                                    </Col>
                                    <Col sm={7}>
                                        <DatePicker
                                            selected={this.state.in}
                                            onChange={this.handleIn}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='out'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Out Date
                                    </Col>
                                    <Col sm={7}>
                                        <DatePicker
                                            selected={this.state.out}
                                            onChange={this.handleOut}
                                        />
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
                                            <option value='Northrop'>Northrop</option>
                                            <option value='Overhead'>Overhead</option>
                                            <option value='HR'>HR</option>
                                            <option value='Accounting'>Accounting</option>
                                            <option value='Legal'>Legal</option>
                                            <option value='IT'>IT</option>
                                        </FormControl>
                                    </Col>
                                </FormGroup>
                            </Form>
                            <Button type = 'submit' bsStyle='success' disabled={!isValid}>Add Employee</Button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

function nullify(value){
    if (value === '' || value === 'Select...'){
        return null;
    }
    return value;
}