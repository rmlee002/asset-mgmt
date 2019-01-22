import React, { Component } from 'react';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, Col, HelpBlock, ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Links from '../Nav';
import axios from 'axios';
import Departments from '../Departments';

export default class AddAssets extends Component{
    constructor(props){
        super(props)

        // this.handleChange = this.handleChange.bind(this);
        this.handleIn = this.handleIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this)
        this.handleDepartment = this.handleDepartment.bind(this);
        this.handleCreateDepartmentOption = this.handleCreateDepartmentOption.bind(this);
        this.click = this.click.bind(this)

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
                value: []
            }]           
        }
    }

    click(){
        alert(this.state.assets[0].value.map(val => val.value).join(', '))
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

    handleDepartment= index => val => {
        let assets = [...this.state.assets]
        assets[index].value = val
        this.setState({ assets })
    }

    handleCreateDepartmentOption = index => val => {
        let assets = [...this.state.assets]
        assets[index].value = [...assets[index].value, {value: val, label: val}]
        this.setState({ assets })        
    }

    handleAdd(){
        this.setState((prevState) => ({
            assets: [...prevState.assets, {model:null, serial_number:null, cost:null, comment:null, department:null}]
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
                <Links />
                <Button onClick={this.click}>Click</Button>
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
                                <FormGroup controlId='department'>
                                    <Col componentClass={ControlLabel} sm={3}>Department</Col>
                                    <Col sm={7}>
                                        <Departments createDept = {this.handleCreateDepartmentOption(index)} handleChange={this.handleDepartment(index)} value={this.state.assets[index].value}/>
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