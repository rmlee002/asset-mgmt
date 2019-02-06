import React, { Component } from 'react';
import { Button, Form , FormGroup, Col, ControlLabel, FormControl, ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';
import ManageModal from '../ManageModal';

export default class ManageAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleIn = this.handleIn.bind(this)
        this.handleOut = this.handleOut.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRetire = this.handleRetire.bind(this)
        this.handleUnretire=this.handleUnretire.bind(this)

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
            outDate: null,
            archived: null
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
                outDate: asset.outDate,
                archived: asset.archived
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
        this.setState({
            outDate: date
        });
    }

    handleRetire(e){
        e.preventDefault();
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

    handleUnretire(){
        Axios.post('/assets/unretire', {
            asset_id: this.state.asset_id
        })
        .then(res=>{
            if(res.status>=400){
                alert(res.data.error)
            }
            else{
                this.props.history.push('/assets')
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
            outDate: this.state.outDate?moment(this.state.outDate).format('YYYY-MM-DD'):null,
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
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>                                
                        <FormGroup controlId='serial_number'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Serial Number
                            </Col>
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
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
                            <Col sm={6}>
                                <DatePicker
                                    selected={this.state.outDate}
                                    onChange={this.handleOut}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={3} sm={2}>
                                <ButtonToolbar>
                                    <Button type = 'submit' bsStyle='success'>Update Asset</Button>
                                    {!this.state.archived?
                                        <ManageModal 
                                        id='Retire'
                                        title='Retire asset'
                                        date={this.state.outDate?this.state.outDate:new Date()}
                                        handleSubmit={this.handleRetire}
                                        handleDate={this.handleOut}
                                    />:
                                        <Button bsStyle='primary'  onClick={this.handleUnretire}>Unarchive</Button>}
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