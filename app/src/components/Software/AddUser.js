import React, { Component } from 'react'
import { Button, Form, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import EmployeeSelect from '../EmployeeSelect';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';

export default class AddUser extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEmployee = this.handleEmployee.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleEnd = this.handleEnd.bind(this)

        this.state={
            emp_id: null,
            start: new Date(),
            end: null
        }
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/licenses/add', {
            emp_id: this.state.emp_id,
            software_id: this.props.match.params.software_id,
            start: moment(this.state.start).format('YYYY-MM-DD'),
            end: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.props.history.push(`/software/${this.props.match.params.software_id}/users`)
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleEmployee(value){
        this.setState({
            emp_id: value?value.value:null
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
        })
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='user'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Employee
                            </Col>
                            <Col sm={7}>
                                <EmployeeSelect onChange={this.handleEmployee}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='start'>
                            <Col componentClass={ControlLabel} sm={3}>
                                License start date
                            </Col>
                            <Col sm={7}>
                                <DatePicker selected={this.state.start} onChange={this.handleStart}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='end'>
                            <Col componentClass={ControlLabel} sm={3}>
                                License end date
                            </Col>
                            <Col sm={7}>
                                <DatePicker selected={this.state.end} onChange={this.handleEnd}/>
                            </Col>
                        </FormGroup>
                        <Button type='submit' bsStyle='success'>Add user license</Button>
                    </Form>
                </form>
            </React.Fragment>
        );
    }
}