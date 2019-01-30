import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';

export default class AddAssets extends Component{
    constructor(props){
        super(props)

        // this.handleChange = this.handleChange.bind(this);
        this.handleIn = this.handleIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this)

        this.state = {
            warranty_provider: null,
            vendor: null,
            order_num: null,
            warranty: null,
            inDate: null,
            assets: [{
                model: null,
                serial_number: null,               
                cost: null,
                comment: null,
            }]           
        }
    }

    handleAssetChange = index => e => {
        let assets = [...this.state.assets]
        assets[index][e.target.id] = nullify(e.target.value)
        this.setState({ assets })             
    }

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
        if(date){
            this.setState({
                inDate: moment(date).format("YYYY-MM-DD")
            });
        }
        else{
            this.setState({
                inDate: null
            })
        }
    }

    handleSubmit(e){
        e.preventDefault();
        axios.post('/assets/add', {
            order_num: this.state.order_num,
            vendor: this.state.vendor,
            inDate: this.state.inDate,
            warranty: this.state.warranty,            
            warranty_provider: this.state.warranty_provider,
            assets: JSON.stringify(this.state.assets)
        })
        .then(res => {
            if (res.status === 200) {
                this.props.history.push('/assets')
            }
            else{
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
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='order_num'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Order Number
                            </Col>
                            <Col sm={7}>
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
                            <Col sm={7}>
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
                            <Col sm={7}>
                                <DatePicker
                                    selected={this.state.inDate}
                                    onChange={this.handleIn}
                                />
                            </Col>
                        </FormGroup>               
                        <FormGroup controlId='warranty_provider'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Warranty Provider
                            </Col>
                            <Col sm={7}>
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
                            <Col sm={7}>
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
                                <Button bsStyle='danger' onClick={() => this.handleRemove(index)}>Remove</Button>                              
                                <FormGroup controlId='serial_number'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Serial Number
                                    </Col>
                                    <Col sm={7}>
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
                                    <Col sm={7}>
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
                                    <Col sm={7}>
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
                                    <Col sm={7}>
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
                    </Form>
                    <ButtonToolbar>
                        <Button onClick={this.handleAdd} block>Add asset</Button>
                    </ButtonToolbar>
                    <ButtonToolbar>
                        <Button type='submit' bsStyle='success' block>Submit</Button>
                    </ButtonToolbar>
                    
                </form>
            </div>
        );
    }
}

function nullify(value){
    if (value === '' || value==='Select...') {
        return null
    }
    return value
}