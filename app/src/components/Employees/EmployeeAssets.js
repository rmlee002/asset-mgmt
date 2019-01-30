import React, { Component } from 'react';
import { Table, Button , Modal, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default class EmployeeAssets extends Component{
    constructor(props){
        super(props);

        this.handleEnd = this.handleEnd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            show: false,
            end: new Date(),
            asset_id: null,
            assets: []
        }
    }

    componentDidMount(){        
        Axios.post('/history/employee', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error);
            }
            this.setState({
                assets: res.data
            })
        })
        .catch(err =>{
            alert(err)
            console.log(err)
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    handleSubmit(){
        Axios.post('/history/retire', {
            history_id: this.state.id,
            end: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    render(){
        return(
            <div>
                <LinkContainer to={`/employees/${this.props.match.params.emp_id}/addAsset`}>
                    <Button bsStyle='primary'>
                        Add asset
                    </Button>
                </LinkContainer>
                <Table>
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Model</th>                            
                            <th>Comment</th>
                            <th>Start Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.assets.map(item => 
                            <tr>
                                <td>{item.serial_number}</td>
                                <td>{item.model}</td>
                                <td>{item.comment}</td>
                                <td>{item.start?moment(item.start).format('YYYY-MM-DD'):''}</td>
                                <td><Button bsStyle='danger' bsSize='small' onClick={() => {this.setState({show: true, id: item.history_id})}}>Retire</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={()=>{this.setState({show:false, end: null, asset_id: null})}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Retire asset</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <FormGroup controlId='start'>
                                <Col componentClass={ControlLabel} sm={3}>
                                    Enter end date: 
                                </Col> 
                                <Col sm={4}>
                                    <DatePicker 
                                        selected={this.state.end}
                                        onChange={this.handleEnd}
                                    />
                                </Col>                                
                            </FormGroup>                     
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='submit' bsStyle='danger'>Retire</Button>
                        </Modal.Footer>
                    </form>                    
                </Modal>
            </div>
        );
    }
}