import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Col, Button } from 'react-bootstrap';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class AddSoftware extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            name: null,
            cost: null,
        }
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/softwares/add', {
            name: this.state.name,
            cost: this.state.cost
        })
        .then(res=>{
            this.props.history.push('/software')
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal onChange={this.handleChange}>
                        <FormGroup controlId='name'>
                            <Col componentClass={ControlLabel} sm={3}>
                                License
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
                                Monthly subscription cost
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='number'
                                    value={this.state.cost}
                                    placeholder='Monthly cost'
                                />                        
                            </Col>
                        </FormGroup>           
                        <FormGroup>
                            <Col smOffset={3} sm={1}>
                                <Button type='submit' bsStyle='success'>Add <FontAwesomeIcon icon='check'/></Button>    
                            </Col>    
                        </FormGroup>
                    </Form>
                </form>
            </React.Fragment>            
        );
    }
}