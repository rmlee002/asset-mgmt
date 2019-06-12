import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class AddLaptop extends Component{
    constructor(props){
        super(props);

        this.handleIn = this.handleIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.getValidationState = this.getValidationState.bind(this);

        this.state = {
            warranty_provider: null,
            vendor: null,
            order_num: null,
            warranty: null,
            inDate: new Date(),
            assets: [{
                model: null,
                serial_number: null,               
                cost: null,
                comment: null,
            }]           
        }
    }

    handleAssetChange = index => e => {
        let assets = [...this.state.assets];
        assets[index][e.target.id] = nullify(e.target.value);
        this.setState({ assets });
    };

    handleOrderChange(e){
        this.setState({
            [e.target.id]: nullify(e.target.value)
        })
    }

    handleAdd(){
        this.setState((prevState) => ({
            assets: [...prevState.assets, {model:null, serial_number:null, cost:null, comment:null}]
        }))
    }

    handleRemove(index){
        this.setState({
            assets: this.state.assets.filter((asset, assetIndex) => index !== assetIndex)
        })
    }

    handleIn(date){
        this.setState({
            inDate: date
        });
    }

    handleSubmit(e){
        e.preventDefault();
        axios.post('/laptops/add', {
            order_num: this.state.order_num,
            vendor: this.state.vendor,
            inDate: this.state.inDate?moment(this.state.inDate).format('YYYY-MM-DD'):null,
            warranty: this.state.warranty,            
            warranty_provider: this.state.warranty_provider,
            assets: JSON.stringify(this.state.assets)
        })
        .then(res => {
            this.props.history.push('/assets/laptops')
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        })
    }

    getValidationState(){
        return this.state.order_num == null || this.state.inDate == null
            || this.state.assets.some(val => { return val.model == null || val.serial_number == null })
    }
    
    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='order_num'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Order Number
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.order_num}
                                    placeholder='Order Number'
                                    onChange={this.handleOrderChange.bind(this)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='vendor'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Vendor
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.vendor}
                                    placeholder='Vendor'
                                    onChange={this.handleOrderChange.bind(this)}
                                />
                            </Col>
                        </FormGroup>         
                        <FormGroup controlId='inDate'>
                            <Col componentClass={ControlLabel} sm={3}>
                                In Date
                            </Col>
                            <Col sm={6}>
                                <DatePicker
                                    className='form-control'
                                    selected={this.state.inDate}
                                    onChange={this.handleIn}
                                />
                            </Col>
                        </FormGroup>               
                        <FormGroup controlId='warranty_provider'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Warranty Provider
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.warranty_provider}
                                    placeholder='Warranty Provider'
                                    onChange={this.handleOrderChange.bind(this)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='warranty'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Warranty
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.warranty}
                                    placeholder='Warranty'
                                    onChange={this.handleOrderChange.bind(this)}
                                />
                            </Col>
                        </FormGroup>                       
                        {this.state.assets.map((item, index) => 
                            <div>
                                <br />
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Item #{index+1}
                                    </Col>
                                    <Col sm={6}>
                                        <Button bsStyle='danger' onClick={() => this.handleRemove(index)}>
                                            <FontAwesomeIcon icon='trash'/> Remove
                                        </Button>
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='serial_number'>                                        
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Serial Number
                                    </Col>
                                    <Col sm={6}>
                                        <FormControl
                                            type='text'
                                            value={this.state.serial_number}
                                            placeholder='Serial Number'
                                            onChange={this.handleAssetChange(index)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='model'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Model
                                    </Col>
                                    <Col sm={6}>
                                        <FormControl
                                            type='text'
                                            value={this.state.model}
                                            placeholder='Model'
                                            onChange={this.handleAssetChange(index)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='cost'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Cost
                                    </Col>
                                    <Col sm={6}>
                                        <FormControl
                                            type='number'
                                            value={this.state.cost}
                                            placeholder='Cost'
                                            onChange={this.handleAssetChange(index)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId='comment'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Comment
                                    </Col>
                                    <Col sm={6}>
                                        <FormControl
                                            type='text'
                                            value={this.state.comment}
                                            placeholder='Comment'
                                            onChange={this.handleAssetChange(index)}
                                        />
                                    </Col>
                                </FormGroup>
                            </div>
                        )}         
                        <FormGroup>
                            <Col smOffset={3} sm={2}>
                                <ButtonToolbar>
                                    <Button onClick={this.handleAdd}><FontAwesomeIcon icon='laptop-medical'/> Add more</Button>
                                    <Button
                                        type='submit'
                                        bsStyle='success'
                                        disabled={this.getValidationState()}
                                    >
                                        <FontAwesomeIcon icon='check'/> Submit
                                    </Button>
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