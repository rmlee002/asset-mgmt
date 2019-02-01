import React, { Component } from 'react';
import { Button, Form , FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';

export default class ManageAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleIn = this.handleIn.bind(this)
        this.handleOut = this.handleOut.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRetire = this.handleRetire.bind(this)

        this.state={
            asset_id: null,
            model: null,
            serial_number: null,
            warranty_provider: null,
            owner: null,
            cost: null,
            comment: null,
            vendor: null,
            order_num: null,
            warranty: null,
            inDate: null,
            outDate: null
        }
    }

    componentDidMount(){
        Axios.post('/assets/getAsset', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error);
            }
            const asset = res.data[0]
            this.setState({
                asset_id: asset.asset_id,
                model: asset.model,
                serial_number: asset.serial_number,
                warranty_provider: asset.warranty_provider,
                owner: asset.owner,
                cost: asset.cost,
                comment: asset.comment,
                vendor: asset.vendor,
                order_num: asset.order_num,
                warranty: asset.warranty,
                inDate: asset.inDate,
                outDate: asset.outDate
            })
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: nullify(e.target.value)
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

    handleOut(date){
        if(date){
            this.setState({
                outDate: moment(date).format("YYYY-MM-DD")
            });
        }
        else{
            this.setState({
                outDate: null
            })
        }
    }

    handleRetire(){
        Axios.post('/assets/retire', {
            asset_id: this.state.asset_id,
            end: moment(this.state.end).format('YYYY-MM-DD')
        })
        .then(res => {
            if (res.status === 200){
                this.props.history.push('/assets')
            }
            else{
                alert(res.data.error)
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleSubmit(e){
        Axios.post('/assets/updateAsset', {
            model: this.state.model,
            serial_number: this.state.serial_number,
            warranty_provider: this.state.warranty_provider,
            owner: this.state.owner,
            owner_id: this.state.owner_id,
            cost: this.state.cost,
            comment: this.state.comment,
            vendor: this.state.vendor,
            order_num: this.state.order_num,
            warranty: this.state.warranty,
            inDate: this.state.inDate,
            outDate: this.state.outDate,
            asset_id: this.state.asset_id
        })
        .then(res => {            
            if (res.status >= 400) {
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
            <React.Fragment>
                <Button bsStyle='danger' onClick={this.handleRetire}>Retire</Button>

                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>                        
                        <FormGroup controlId='serial_number'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Serial Number
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type='text'
                                    value={this.state.serial_number}
                                    placeholder='Serial Number'
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='order_num'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Order Number
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type='text'
                                    value={this.state.order_num}
                                    placeholder='Order Number'
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='in'>
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
                        <FormGroup controlId='out'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Out Date
                            </Col>
                            <Col sm={7}>
                                <DatePicker
                                    selected={this.state.outDate}
                                    onChange={this.handleOut}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                    <Button type = 'submit' bsStyle='success'>Update Asset</Button>
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