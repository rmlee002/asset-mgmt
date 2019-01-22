import React, { Component } from 'react';
import { Button, Form , FormGroup, Col, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Links from '../Nav';
import Axios from 'axios';
import moment from 'moment';
import EditOwner from './EditOwner';
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import Departments from '../Departments';

export default class ManageAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleIn = this.handleIn.bind(this)
        this.handleOut = this.handleOut.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.handleOwnerNull = this.handleOwnerNull.bind(this)
        this.handleRetire = this.handleRetire.bind(this)
        this.refresh = this.refresh.bind(this)
        this.handleDepartment = this.handleDepartment.bind(this);
        this.handleCreateDepartmentOption = this.handleCreateDepartmentOption.bind(this);

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
            value: null,
            owner_id: null,
        }
    }

    componentDidMount(){
        this.refresh()
    }

    refresh(){
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
                value: asset.department.split(', ').map(department => ({value: department, label: department}))
            })
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    handleDepartment(value){
        this.setState({value})
    }

    handleCreateDepartmentOption(value){
        this.setState({
            value: [...this.state.value, {value: value, label: value}]
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

    handleRetire(){
        Axios.post('/assets/retire', {
            asset_id: this.state.asset_id
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
        e.preventDefault();
        Axios.post('/assets/updateAsset', {
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
            department: this.state.value.map(val => val.value).join(', '),
            asset_id: this.state.asset_id
        })
        .then(res => {            
            if (res.status === 200) {
                
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
                <Button bsStyle='danger' onClick={this.handleRetire}>Retire</Button>
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
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
                                <Departments createDept = {this.handleCreateDepartmentOption} handleChange={this.handleDepartment} value={this.state.value}/>
                            </Col>
                        </FormGroup>
                    </Form>
                    <Button type = 'submit' bsStyle='success'>Update Asset</Button>
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