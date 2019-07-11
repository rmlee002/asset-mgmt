import React, { Component } from 'react'
import { Button, Table, Form, FormGroup, FormControl, ControlLabel, Col, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';
import memoize from 'memoize-one';

export default class AddEmployeeLicense extends Component{
    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.state={
            software: [],
            filtered: [],
            show: false,
            start: new Date(),
            theight: document.documentElement.clientHeight - 240,
            archived: false
        }
    }

    componentDidMount(){
        Axios.post('/licenses/getSoftware', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            this.setState({
                software: res.data,
                filtered: res.data
            })
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        });

        Axios.post('/employee/checkArchived', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            this.setState({
                archived: res.data[0].archived
            })
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data);
        })

        window.addEventListener('resize', this.handleResize)
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.name).toLowerCase().includes(filterText.toLowerCase()))
    );

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.software, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.software
            })
        }
        
    }

    handleResize(){
        const h = document.documentElement.clientHeight - 240
        this.setState({
            theight: h
        })
    }

    handleStart(date){
        this.setState({
            start: date
        })
    }

    handleSubmit(e){
        e.preventDefault();
        if (this.state.archived){
            alert('Error: Cannot add license to retired employee!');
        }
        else{
            Axios.post('/licenses/add', {
                emp_id: this.props.match.params.emp_id,
                software_id: this.state.software_id,
                start: moment(this.state.start).format('YYYY-MM-DD')
            })
            .then(res => {
                this.props.history.push(`/employees/${this.props.match.params.emp_id}/licenses`)
            })
            .catch(err => {
                console.log(err);
                alert(err.response.data)
            })
        }
    }

    render(){
        return(
            <React.Fragment>
                <FormGroup controlId="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter software name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <div className='data' id='addLicense'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>License</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map((software) => 
                                <tr key={software.software_id}>
                                    <td>{software.name}</td>
                                    <td>
                                        <Button bsSize='small' bsStyle='success' onClick={()=>this.setState({show:true, software_id: software.software_id})}>Add</Button>
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </Table>
                    <Modal show={this.state.show} onHide={()=>this.setState({show:false, start: new Date(), software_id: null})}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add License</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.handleSubmit}>                        
                            <Modal.Body>
                                <Form horizontal>
                                    <FormGroup controlId='start'>
                                        <Col componentClass={ControlLabel} sm={3}>
                                            Start date
                                        </Col>
                                        <Col sm={7}>
                                            <DatePicker selected={this.state.start} onChange={this.handleStart}/>
                                        </Col>
                                    </FormGroup>
                                </Form>                           
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type='submit' bsStyle='success'>Add</Button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
}