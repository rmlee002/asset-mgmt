import React, { Component } from 'react';
import {Button, Form, FormGroup, Col, ControlLabel, FormControl, ButtonToolbar, Checkbox, Radio} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';
import ManageModal from '../../ManageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Departments from '../../Departments';

export default class ManageLaptop extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleIn = this.handleIn.bind(this);
        this.handleOut = this.handleOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRetire = this.handleRetire.bind(this);
        this.handleUnretire=this.handleUnretire.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleContract = this.handleContract.bind(this);
        this.handleCreateContractOption = this.handleCreateContractOption.bind(this);
        this.handleWarranty = this.handleWarranty.bind(this);

        this.state={
            hardware_id: null,
            model: null,
            description: null,
            serial_number: null,
            warranty_provider: null,
            owner: null,
            contract: [],
            cost: null,
            comment: null,
            vendor: null,
            order_number: null,
            warranty: null,
            warrantyUnit: null,
            inDate: null,
            outDate: null,
            archived: null,
            broken: null
        }
    }

    componentDidMount(){
        Axios.post('/nonlaptops/getNonLaptop', {
            hardware_id: this.props.match.params.hardware_id
        })
        .then(res => {
            const hardware = res.data[0];
            const utcStart = new Date(hardware.inDate);
            const localStart = new Date(utcStart.getTime() + utcStart.getTimezoneOffset() * 60000);
            const utcEnd = hardware.outDate? new Date(hardware.outDate) : null;
            const localEnd = utcEnd? new Date(utcEnd.getTime() + utcEnd.getTimezoneOffset() + 60000) : utcEnd;
            this.setState({
                hardware_id: hardware.hardware_id,
                model: hardware.model,
                description: hardware.description,
                serial_number: hardware.serial_number,
                warranty_provider: hardware.warranty_provider,
                owner: hardware.owner,
                contract: hardware.contract?hardware.contract.split(', ').map(contract => ({value: contract, label: contract})):[],
                cost: hardware.cost,
                comment: hardware.comment,
                vendor: hardware.vendor,
                order_number: hardware.order_number,
                warranty: hardware.warranty ? hardware.warranty.match(/\d+/) : null,
                warrantyUnit: hardware.warranty ? hardware.warranty.replace(/[\d\s]/, '').trim() : null,
                inDate: localStart,
                outDate: localEnd,
                archived: hardware.archived,
                broken: hardware.broken
            })
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        })
    }

    handleChange(e){
        this.setState({
            [e.target.id]: nullify(e.target.value)
        })
    }

    handleIn(date){
        this.setState({
            inDate: date
        });
    }

    handleOut(date){
        this.setState({
            outDate: date
        });
    }

    handleCheck(e){
        this.setState({
            broken: e.target.checked
        })
    }

    handleContract(contract){
        this.setState({contract})
    }

    handleCreateContractOption(value){
        this.setState({
            contract: [...this.state.contract, {value: value, label: value}]
        })        
    }

    handleRetire(e){
        e.preventDefault();
        const end = this.state.outDate?moment(this.state.outDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');

        Axios.post('/nonlaptops/retire', {
            hardware_id: this.state.hardware_id,
            outDate: end
        })
        .then(res => {
            this.props.history.push('/assets/nonlaptops')            
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data)
        })
    }

    handleUnretire(){
        Axios.post('/nonlaptops/unretire', {
            hardware_id: this.state.hardware_id
        })
        .then(res=>{
            this.props.history.push('/assets/nonlaptops')
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data)
        })
    }

    handleWarranty(e){
        const val = e.target.value === '0'? null : e.target.value;
        this.setState({
            warranty: val
        })
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/nonlaptops/updateNonLaptop', {
            hardware_id: this.state.hardware_id,
            model: this.state.model,
            description: this.state.description,
            serial_number: this.state.serial_number,
            warranty_provider: this.state.warranty_provider,
            owner: this.state.owner,
            contract: this.state.contract.length !== 0? this.state.contract.map(val => val.value).join(', '): null,
            cost: this.state.cost,
            vendor: this.state.vendor,
            order_number: this.state.order_number,
            warranty: this.state.warranty ? this.state.warranty + ' ' + this.state.warrantyUnit : null,
            inDate: this.state.inDate?moment(this.state.inDate).format('YYYY-MM-DD'):null,
            outDate: this.state.outDate?moment(this.state.outDate).format('YYYY-MM-DD'):null,
            broken: this.state.broken,
            comment: this.state.comment
        })
        .then(res => {
            window.location.reload();
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        })        
    }

    render(){
        const invalid1 = this.state.order_number == null || this.state.inDate == null
            || this.state.model == null || this.state.serial_number == null || this.state.cost == null || this.state.cost < 0;
        const invalid2 = this.state.order_number == null || this.state.inDate == null
            || this.state.model == null || this.state.serial_number == null || this.state.cost == null || this.state.outDate == null || this.state.cost < 0;
        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <Form horizontal>
                        <FormGroup controlId='serial_number'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Serial Number*
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
                                Model*
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
                        <FormGroup controlId='description'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Description
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.description}
                                    placeholder='Description'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='owner'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Owner
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.owner}
                                    placeholder='Owner'
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='contract'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Contract
                            </Col>
                            <Col sm={6}>
                                <Departments
                                    defaultvalue={this.state.contract}
                                    createDept = {this.handleCreateContractOption}
                                    handleChange={this.handleContract}
                                    depts={this.state.contract}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='cost'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Cost*
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='number'
                                    step='0.01'
                                    value={this.state.cost}
                                    placeholder='Cost'
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
                        <FormGroup controlId='order_number'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Order Number*
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.order_number}
                                    placeholder='Order Number'
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
                        <FormGroup controlId='warranty'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Warranty
                            </Col>
                            {/*<Col sm={6}>
                                <FormControl
                                    type='text'
                                    value={this.state.warranty}
                                    placeholder='Warranty'
                                    onChange={this.handleChange}
                                />
                            </Col>*/}
                            <Col sm={2}>
                                <FormControl
                                    type={'number'}
                                    step={'1'}
                                    min={0}
                                    value={this.state.warranty}
                                    onChange={this.handleWarranty}
                                    placeholder={'Warranty'}
                                />
                            </Col>
                            <Col sm={2}>
                                <Radio
                                    name={'unit'}
                                    checked={this.state.warrantyUnit==='yr.'}
                                    onChange={() => this.setState({warrantyUnit: 'yr.'})}
                                    inline
                                >
                                    Years
                                </Radio>{' '}
                                <Radio
                                    name={'unit'}
                                    checked={this.state.warrantyUnit==='mo.'}
                                    onChange={() => this.setState({warrantyUnit: 'mo.'})}
                                    inline
                                >
                                    Months
                                </Radio>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId='in'>
                            <Col componentClass={ControlLabel} sm={3}>
                                In Date*
                            </Col>
                            <Col sm={7}>
                                <DatePicker
                                    className='form-control'
                                    selected={this.state.inDate}
                                    onChange={this.handleIn}
                                />
                            </Col>
                        </FormGroup>
                        {this.state.archived?
                            <FormGroup controlId='out'>
                                <Col componentClass={ControlLabel} sm={3}>
                                    Out Date
                                </Col>
                                <Col sm={6}>
                                    <DatePicker
                                        isClearable
                                        className='form-control'
                                        selected={this.state.outDate}
                                        onChange={this.handleOut}
                                    />
                                </Col>
                            </FormGroup>
                            : null
                        }
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
                        <FormGroup controlId='broken'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Broken
                            </Col>
                            <Col sm={6}>
                                <Checkbox checked={this.state.broken} onChange={this.handleCheck}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={3} sm={7}>
                                <ButtonToolbar>
                                    <Button
                                        // onClick={this.handleSubmit}
                                        type={'submit'}
                                        bsStyle='success'
                                        disabled={this.state.archived? invalid2 : invalid1}
                                    >
                                        <FontAwesomeIcon icon='check'/> Update Non-Laptop
                                    </Button>
                                    {!this.state.archived?
                                        <ManageModal
                                            type='Retire'
                                            title='Retire non-laptop'
                                            date={this.state.outDate?this.state.outDate:new Date()}
                                            handleSubmit={this.handleRetire}
                                            handleDate={this.handleOut}
                                        />:
                                        <Button bsStyle='primary' onClick={this.handleUnretire}>Unarchive</Button>}
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
