import React, { Component } from 'react';
import { Button, Form , FormGroup, Col, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Links from '../Nav';
import Axios from 'axios';
import moment from 'moment';
import EditOwner from './EditOwner';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";

export default class ManageAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleIn = this.handleIn.bind(this)
        this.handleOut = this.handleOut.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.handleOwnerNull = this.handleOwnerNull.bind(this)

        this.state={
            asset_id: null,
            description: null,
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
            department: null,
            owner_id: null,
        }
    }

    componentDidMount(){
        Axios.post('/assets/getAsset', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error('Bad response from server')
            }
            const asset = res.data[0]
            this.setState({
                asset_id: asset.asset_id,
                description: asset.description,
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
                department: asset.department
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

    //For autosuggest component to select owner
    handleOwner = (e,{suggestion, suggestionValue}) => {
        this.setState({
            owner: suggestionValue,
            owner_id: suggestion.emp_id
        })
        
    }

    //For autosuggest component to account for selecting a suggested owner and then deleting
    handleOwnerNull(){
        this.setState({
            owner: null,
            owner_id: null
        })
    }

    //For autosuggest component to select owner
    onBlur = (event, { highlightedSuggestion }) => {
        if (highlightedSuggestion){
            this.setState({
                owner: highlightedSuggestion.first_name+' '+highlightedSuggestion.last_name,
                owner_id: highlightedSuggestion.asset_id
            })
        }
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

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/assets/updateAsset', {
            description: this.state.description,
            model: this.state.model,
            serial_number: this.state.serial_number,
            warranty_provider: this.state.warranty_provider,
            owner: this.state.owner,
            cost: this.state.cost,
            comment: this.state.comment,
            vendor: this.state.vendor,
            order_num: this.state.order_num,
            warranty: this.state.warranty,
            inDate: this.state.inDate,
            outDate: this.state.outDate,
            department: this.state.department,
            asset_id: this.state.asset_id
        })
        .then(res => {            
            if (res.status === 200) {
                // let startDate = new Date();
                // Axios.post('/assets/addHistory/', {
                //     asset_id: this.state.asset_id,
                //     emp_id: this.state.owner_id,
                //     start: moment(startDate).format("YYYY-MM-DD")
                // })
                // .then(res2 => {
                //     if (res2.status >= 400){
                //         alert(res2.data.error)
                //         throw new Error("Bad response from server")
                //     }
                //     else{
                        
                //     }
                // })
                // .catch(err2 => {
                //     alert(err2)
                //     console.log(err2)
                // })
            }
            else{
                alert('Error updating employee. Please try again')
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })        
    }

    render(){
        const isValid = this.state.description?true:false;

        return(
            <div>
                <Links />
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='description'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Description
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type='text'
                                    value={this.state.description}
                                    placeholder='Description'
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChange}
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
                        <FormGroup controlId='owner'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Owner
                            </Col>
                            <Col sm={6}>
                                {/* <FormControl
                                    readOnly={true}
                                    type='text'
                                    value={this.state.owner}
                                    placeholder='Owner'
                                /> */}
                                <EditOwner handleOwnerNull={this.handleOwnerNull} handleOwner={this.handleOwner} onBlur={this.onBlur}/>
                            </Col>
                            {/* <Col>
                                <LinkContainer to={`/assets/manage/${this.state.asset_id}/editOwner`}>
                                    <Button>Change Owner</Button>
                                </LinkContainer>
                            </Col> */}
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
                        <FormGroup controlId='department'>
                            <Col componentClass={ControlLabel} sm={3}>Department</Col>
                            <Col sm={7}>
                                <FormControl componentClass='select' value={this.state.department} onChange={this.handleChange}>
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
                    </Form>
                    <Button type = 'submit' bsStyle='success' disabled={!isValid}>Update Asset</Button>
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