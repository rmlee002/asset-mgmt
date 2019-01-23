import React, { Component } from 'react';
import { Col, Table, FormGroup, FormControl, ControlLabel, Button, Modal } from 'react-bootstrap';
import Axios from 'axios';
import memoize from 'memoize-one';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Links from '../Nav';

export default class AddAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            show: false,
            asset: null,
            assets: [],
            filtered: [],
            start: new Date()
        }
    }

    componentDidMount(){
        Axios.get('/history/employee/add', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error("Bad response from server")
            }
            this.setState({
                assets: res.data,
                filtered: res.data
            })
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.serial_number).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.assets, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.assets
            })
        }        
    }   

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/history/add', {
            asset_id: this.state.asset_id,
            emp_id: this.props.match.params.emp_id,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.props.history.push(`/employees/${this.props.match.params.emp_id}/assets`)
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
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
                        placeholder='Enter serial number'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>                
                <Table>
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Model</th>                            
                            <th>Comment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map(item =>                             
                            <tr>
                                <td>{item.serial_number}</td>
                                <td>{item.model}</td>                                
                                <td>{item.comment}</td>                          
                                <td>
                                    <Button bsStyle='success' bsSize='small' onClick={() => {this.setState({show:true, asset_id: item.asset_id})}}>
                                        Add
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={()=>{this.setState({show:false, start: null, asset_id: null})}}>
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
                            <Button type='submit' bsStyle='success'>Add</Button>
                        </Modal.Footer>
                    </form>                    
                </Modal>
            </div>
        );
    }
}