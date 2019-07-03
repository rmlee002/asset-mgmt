import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Col, Button, ButtonToolbar } from 'react-bootstrap';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class ManageSoftware extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleRetire = this.handleRetire.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleUnretire = this.handleUnretire.bind(this);
        
        this.state={
            name: null,
            cost: null,
            archived: false,
            end: new Date()
        }
    }

    componentDidMount(){
        Axios.post('/software/getSoftware', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            this.setState({
                name: res.data[0].name,
                cost: res.data[0].cost,
                archived: res.data[0].archived
            })
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: nullify(e.target.value)
        })
    }

    handleUpdate(e){
        e.preventDefault();
        Axios.post('/software/update', {
            name: this.state.name,
            cost: this.state.cost,
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            window.location.reload();
        })
        .catch(err=>{
            console.log(err);
            alert(err.response.data)
        })
    }

    handleRetire(){
        Axios.post('/software/retire', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            this.props.history.push('/software')
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data)
        })
    }

    handleUnretire(){
        Axios.post('/software/unretire',{
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            this.props.history.push('/software')
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        })
    }

    render(){
        const invalid = this.state.name == null || this.state.cost == null || this.state.cost < 0;

        return (
            <React.Fragment>
                <form onSubmit={this.handleUpdate}>
                    <Form horizontal onChange={this.handleChange}>
                        <FormGroup controlId='name'>
                            <Col componentClass={ControlLabel} sm={3}>
                                License*
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.name}
                                    placeholder='License Name'
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='cost'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Monthly subscription cost*
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='number'
                                    step={'any'}
                                    value={this.state.cost}
                                    placeholder='Monthly cost'
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={3} sm={4}>
                                <ButtonToolbar>
                                    <Button
                                        type='submit'
                                        bsStyle='success'
                                        disabled={invalid}
                                    >
                                        Update <FontAwesomeIcon icon='check'/>
                                    </Button>
                                    {!this.state.archived ?
                                        <Button bsStyle='danger' onClick={this.handleRetire}>Retire <FontAwesomeIcon
                                            icon='archive'/></Button>
                                        : <Button bsStyle='primary' onClick={this.handleUnretire}>Unarchive</Button>}
                                </ButtonToolbar>
                            </Col>
                        </FormGroup>
                    </Form>
                </form>
            </React.Fragment>
        );
    }
}

function nullify(value){
    if (value === '' || value==='Select...') {
        return null
    }
    return value
}