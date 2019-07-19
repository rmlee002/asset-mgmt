import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Col, Button } from 'react-bootstrap';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class AddSoftware extends Component{
    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

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
            console.log(err);
            alert(err.response.data)
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: nullify(e.target.value)
        })
    }

    render(){
        const invalid = this.state.name == null || this.state.cost == null || this.state.cost < 0;

        return(
            <React.Fragment>
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
                                step={'0.01'}
                                value={this.state.cost}
                                placeholder='Monthly cost'
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={3} sm={1}>
                            <Button
                                onClick={this.handleSubmit}
                                bsStyle='success'
                                disabled={invalid}
                            >
                                Add <FontAwesomeIcon icon='check'/>
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
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
