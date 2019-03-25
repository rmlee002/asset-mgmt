import React, { Component } from 'react';
import { Button, Form, ButtonToolbar, FormGroup, ControlLabel, Col, Well, Collapse, Checkbox } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Departments from './Departments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Filter extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDepartment = this.handleDepartment.bind(this)
        this.handleCreateDepartmentOption = this.handleCreateDepartmentOption.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.handleCheck = this.handleCheck.bind(this)

        this.state={
            open: false,
            start: null,
            end: null,
            showArchived: false,
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
            showArchived: this.state.showArchived,
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
            showArchived: false,
            depts: []
        })
        this.setState({
            open: false,
            start: null,
            end: null,
            showArchived: false,
            depts: []
        })
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked
        })
    }

    render(){
        return(
            <React.Fragment>
                <Button 
                    bsStyle='link'
                    onClick={()=>this.setState({open: !this.state.open})}
                >
                    Filter <FontAwesomeIcon icon='filter'/>
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
                                        <DatePicker 
                                            className='form-control'
                                            fixedHeight
                                            isClearable 
                                            selected={this.state.start} 
                                            onChange={date => this.setState({start: date})}
                                        />
                                    </Col>
                                    <Col componentClass={ControlLabel} sm={1}>
                                        To: 
                                    </Col>    
                                    <Col sm={2}>
                                        <DatePicker 
                                            isClearable 
                                            className='form-control'
                                            selected={this.state.end} 
                                            onChange={date => this.setState({end: date})}
                                        />
                                    </Col>
                                </FormGroup>              
                            </Form>      
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={1}>
                                        Department(s):
                                    </Col>
                                    <Col sm={5}>
                                        <Departments createDept={this.handleCreateDepartmentOption} handleChange={this.handleDepartment} value={this.state.depts}/>
                                    </Col>
                                </FormGroup>
                                {this.props.checkbox &&
                                    <FormGroup>
                                        <Col smOffset={1} sm={2}>
                                            <Checkbox checked={this.state.showArchived} onChange={this.handleCheck}>Show retired</Checkbox>
                                        </Col>
                                    </FormGroup>
                                }                                
                                <FormGroup>
                                    <Col smOffset={1} sm={2}>
                                        <ButtonToolbar>                                
                                            <Button type='submit' bsSize='small' bsStyle='success'>
                                                Apply <FontAwesomeIcon icon="check"/>
                                            </Button> 
                                            <Button bsSize='small' onClick={this.handleClear}>
                                                Clear <FontAwesomeIcon icon="undo"/>
                                            </Button>                               
                                        </ButtonToolbar>
                                    </Col>  
                                </FormGroup>                                
                            </Form>                                                 
                        </form>    
                    </Well>
                </Collapse>
            </React.Fragment>
        );
    }
}