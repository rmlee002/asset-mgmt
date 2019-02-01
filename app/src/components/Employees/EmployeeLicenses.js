import React, { Component } from 'react'
import { Table, Button, Modal, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class EmployeeLicenses extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)

        this.state={
            licenses: [],
            show: false,
            end: new Date(),
            software_id: null
        }
    }

    componentDidMount(){
        Axios.post('/licenses/getUserData', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.setState({
                    licenses: res.data
                })
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleSubmit(){
        Axios.post('/licenses/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            software_id: this.state.software_id,
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status  >= 400){
                alert(res.data.error)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    render(){
        return(
            <div>
                <LinkContainer to={`/employees/${this.props.match.params.emp_id}/licenses/add`}>
                    <Button bsStyle='primary'>Add license</Button>
                </LinkContainer>                
                <Table>
                    <thead>
                        <tr>
                            <th>License</th>
                            <th>Start</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.licenses.map((license) => 
                            <tr>
                                <td>{license.name}</td>
                                <td>{license.start?moment(license.start).format('YYYY-MM-DD'):''}</td>
                                <td><Button bsStyle='danger' bsSize='small' onClick={() => this.setState({show: true, software_id: license.software_id})}>Retire</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={()=>{this.setState({show:false, end: new Date(), software_id: null})}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Retire license</Modal.Title>                        
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Enter end date: 
                                    </Col> 
                                    <Col sm={4}>
                                        <DatePicker 
                                            selected={this.state.end}
                                            onChange={date => this.setState({ end: date })}
                                        />
                                    </Col>                             
                                </FormGroup>
                            </Form>                                      
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