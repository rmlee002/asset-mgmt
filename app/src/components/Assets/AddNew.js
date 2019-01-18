import React, { Component } from 'react';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, Col, HelpBlock, ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Links from '../Nav';
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
            show: false,
            warranty_provider: null,
            vendor: null,
            order_num: null,
            warranty: null,
            inDate: null,
            assets: [{
                description: null,
                model: null,
                serial_number: null,               
                cost: null,
                comment: null,               
                department: null
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
            assets: [...prevState.assets, {description:null, model:null, serial_number:null, cost:null, comment:null, department:null}]
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
        const isValid = this.state.description?true:false
        return(
            <div>
                <Links />
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
                                <FormGroup controlId='description'>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Description
                                    </Col>
                                    <Col sm={7}>
                                        <FormControl
                                            type='text'
                                            value={this.state.description}
                                            placeholder='Description'
                                            onChange={this.handleAssetChange(index)}
                                        />
                                        <HelpBlock bsClass='small'>Required</HelpBlock>
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
                                        <FormControl componentClass='select' onChange={this.handleAssetChange(index)}>
                                            <option>Select...</option>
                                            <option value='CQA'>CQA</option>
                                            <option value='VPT'>VPT</option>
                                            <option value='TCoE'>TCoE</option>
                                            <option value='TI'>TI</option>
                                            <option value='Sharepoint'>Sharepoint</option>                                        
                                            <option value='NGC'>NGC</option>
                                            <option value='NAVSUP'>NAVSUP</option>                                        
                                            <option value='MHV'>MHV</option>
                                            <option value='IDC'>IDC</option>                                        
                                            <option value='VA'>VA</option>
                                            <option value='BD'>BD</option>
                                            <option value='Cm/Tools'>CM/Tools</option>
                                            <option value='DITD'>DITD</option>
                                            <option value='BD'>BD</option>
                                            <option value='Northrop'>Northrop</option>
                                            <option value='Overhead'>Overhead</option>
                                            <option value='HR'>HR</option>
                                            <option value='Accounting'>Accounting</option>
                                            <option value='Legal'>Legal</option>
                                            <option value='IT'>IT</option>
                                        </FormControl>
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