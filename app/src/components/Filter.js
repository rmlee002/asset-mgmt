import React, { Component } from 'react';
import { Button, Form, ButtonToolbar, FormGroup, ControlLabel, Col, Well, Collapse } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Departments from './Departments';

export default class Filter extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDepartment = this.handleDepartment.bind(this)
        this.handleCreateDepartmentOption = this.handleCreateDepartmentOption.bind(this)
        this.handleClear = this.handleClear.bind(this)

        this.state={
            open: false,
            start: null,
            end: null,
            depts: []
        }
    }

    handleDepartment(depts){
        this.setState({depts})
    }

    handleCreateDepartmentOption(value){
        this.setState({
            depts: [...this.state.depts, {value: value, label: value}]
        })        
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.handleFilter({
            start: this.state.start?this.state.start:new Date(1970,0,1),
            end: this.state.end?this.state.end:new Date(),
            depts: this.state.depts
        })
        this.setState({
            open: false
        })
    }

    handleClear(){
        this.props.handleFilter({
            start: new Date(1970, 0, 1),
            end: new Date(),
            depts: []
        })
        this.setState({
            open: false,
            start: null,
            end: null,
            depts: []
        })
    }

    render(){
        return(
            <div>
                <Button bsStyle='link' onClick={()=>this.setState({open: !this.state.open})}>
                    Filter
                </Button>
                <Collapse in={this.state.open}>
                    <Well>
                        <form onSubmit={this.handleSubmit}>
                            <Form horizontal> 
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={1}>
                                        From: 
                                    </Col>
                                    <Col sm = {2}>
                                        <DatePicker isClearable selected={this.state.start} onChange={date => this.setState({start: date})}/>
                                    </Col>
                                    <Col componentClass={ControlLabel} sm={1}>
                                        To: 
                                    </Col>    
                                    <Col sm={1}>
                                        <DatePicker isClearable selected={this.state.end} onChange={date => this.setState({end: date})}/>
                                    </Col>
                                </FormGroup>              
                            </Form>      
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={1}>
                                        Department(s):
                                    </Col>
                                    <Col sm={4}>
                                        <Departments createDept={this.handleCreateDepartmentOption} handleChange={this.handleDepartment} value={this.state.depts}/>
                                    </Col>
                                </FormGroup>
                            </Form>
                            <Col sm={1}></Col>
                            <ButtonToolbar>                                
                                <Button type='submit' bsSize='small' bsStyle='success'>Apply</Button> 
                                <Button bsSize='small' onClick={this.handleClear}>Clear</Button>                               
                            </ButtonToolbar>                            
                        </form>    
                    </Well>
                </Collapse>
            </div>
        );
    }
}