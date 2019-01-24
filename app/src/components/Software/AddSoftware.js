import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Col, Button } from 'react-bootstrap';
import Links from '../Nav';
import Axios from 'axios';

export default class AddSoftware extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            license: null,
            cost: null,
        }
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/software/add', {
            license: this.state.license,
            cost: this.state.cost
        })
        .then(res=>{
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.props.history.push('/software')
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render(){
        return(
            <div>
                <Links />
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal onChange={this.handleChange}>
                        <FormGroup controlId='license'>
                            <Col componentClass={ControlLabel} sm={3}>
                                License
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type='text'
                                    value={this.state.license}
                                    placeholder='License Name'
                                />                        
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='cost'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Monthly subscription cost
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type='number'
                                    value={this.state.cost}
                                    placeholder='Monthly cost'
                                />                        
                            </Col>
                        </FormGroup>                        
                        <Button type='submit' bsStyle='success'>Add</Button>          
                    </Form>
                </form>
            </div>            
        );
    }
}