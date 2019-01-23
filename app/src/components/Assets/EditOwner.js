import React, { Component } from 'react';
import { Modal, Button, Table, FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';
import Links from '../Nav';
import Axios from 'axios';
import memoize from 'memoize-one';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class EditOwner extends Component{
    constructor(props){
        super(props)

        this.handleStart = this.handleStart.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            emp_id: null,
            start: new Date(),
            employees: [],
            filtered: [],
            show: false
        }
    }

    componentDidMount(){
        Axios.post('/history/asset/add', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error);
            }
            this.setState({employees: res.data, filtered: res.data});
        }).catch(err => {
            console.log(err);
            alert(err);
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.first_name+' '+item.last_name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.employees, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.employees
            })
        }
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/history/add', {
            asset_id: this.props.match.params.asset_id,
            emp_id: this.state.emp_id,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null
        })
        .then(res => {
            if(res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.props.history.push(`/assets/history/${this.props.match.params.asset_id}`)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    handleStart(date){
        this.setState({
            start: date
        })
    }

    render(){
        return(
            <div>
                <Links />
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Affiliation</th>
                            <th>Department</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map(employee => 
                            <tr>
                                <td>{employee.first_name+" "+employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.affiliation}</td>
                                <td>{employee.department}</td>
                                <td><Button bsStyle='success' bsSize='small' onClick={() => this.setState({show:true, emp_id:employee.emp_id})}>Assign</Button></td>
                            </tr>
                            )}
                    </tbody>
                </Table>            
                <Modal show={this.state.show} onHide={()=>{this.setState({show:false, start: null, emp_id: null})}}>
                <Modal.Header closeButton>
                    <Modal.Title>Add asset</Modal.Title>                        
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        <FormGroup controlId='start'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Enter start date: 
                            </Col> 
                            <Col sm={4}>
                                <DatePicker 
                                    selected={this.state.start}
                                    onChange={this.handleStart}
                                />
                            </Col>                                
                        </FormGroup>                     
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' bsStyle='success'>Assign</Button>
                    </Modal.Footer>
                </form>                    
                </Modal>
            </div>
        ); 
    }
}