import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Col, Button, ButtonToolbar } from 'react-bootstrap';
import Axios from 'axios';

export default class ManageSoftware extends Component{
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleRetire = this.handleRetire.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        
        this.state={
            name: null,
            cost: null,
            end: new Date()
        }
    }

    componentDidMount(){
        Axios.post('/software/getSoftware', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.setState({
                    name: res.data[0].name,
                    cost: res.data[0].cost
                })
            }
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleUpdate(){
        Axios.post('/software/update', {
            name: this.state.name,
            cost: this.state.cost,
            software_id: this.props.match.params.software_id
        })
        .then(res=>{
            if (res.status >= 400){
                alert(res.data.err)
            }
        })
        .catch(err=>{
            console.log(err)
            alert(err)
        })
    }

    handleRetire(e){
        Axios.post('/software/retire', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.props.history.push('/software')
            }
        })
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handleUpdate}>
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
                            <Col smOffset={3} sm={10}>
                                <ButtonToolbar>
                                    <Button type='submit' bsStyle='success'>Update</Button>
                                    <Button bsStyle='danger' onClick={this.handleRetire}>Retire</Button>
                                </ButtonToolbar> 
                            </Col>
                        </FormGroup>                             
                    </Form>
                </form>
            </React.Fragment>            
        );
    }
}