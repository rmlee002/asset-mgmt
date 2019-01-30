import React, { Component } from 'react';
import { Modal, Col, Table, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default class History extends Component{
    constructor(props){
        super(props);

        this.handleEnd = this.handleEnd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            emp_id: null,
            show: false,
            end: new Date(),
            owners: []
        }
    }

    componentDidMount(){
        axios.post('/history/asset', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res =>{
            if (res.status >= 400){
                alert(res.data.error);
            }
            else{
                this.setState({
                    owners: res.data
                })
            }            
        })
        .catch(err => {
            alert(err)
            console.log(err);
        })
    }

    handleSubmit(e){
        axios.post('/history/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            history_id: this.state.id
        })
        .then(res => {
            if (res.status >= 400) {
                alert(res.data.error)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    render(){
        return(
            <div>
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter a name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Start</th>
                            <th>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.owners.map(owner => 
                            <tr>
                                <td>{owner.first_name+' '+owner.last_name}</td>
                                <td>
                                    {owner.start?
                                        moment(owner.start).utc().format('YYYY-MM-DD'):''}
                                </td>
                                <td>
                                    {owner.end?
                                        moment(owner.end).utc().format('YYYY-MM-DD')
                                        :<Button 
                                            bsSize='small' 
                                            bsStyle='danger' 
                                            onClick={()=>this.setState({show: true, id: owner.history_id})}
                                        >
                                            Retire
                                        </Button>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={()=>{this.setState({show:false, end: null, emp_id: null})}}>
                <Modal.Header closeButton>
                    <Modal.Title>Retire owner</Modal.Title>                        
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