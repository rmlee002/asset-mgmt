import React, { Component } from 'react';
import {Button, Form, FormGroup, Col, ControlLabel, FormControl, ButtonToolbar, Checkbox, Radio} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import moment from 'moment';
import ManageModal from '../../ManageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        this.handleDate = this.handleDate.bind(this);
        this.handleWarranty = this.handleWarranty.bind(this);

        this.state={
            laptop_id: null,
            model: null,
            serial_number: null,
            warranty_provider: null,
            owner: null,
            cost: null,
            comment: null,
            vendor: null,
            order_num: null,
            warranty: null,
            warrantyUnit: null,
            inDate: null,
            outDate: null,
            archived: null,
            broken: null,
            date: null
        }
    }

    componentDidMount(){
        Axios.post('/laptops/getLaptop', {
            laptop_id: this.props.match.params.laptop_id
        })
        .then(res => {
            const laptop = res.data[0];
            const utcStart = new Date(laptop.inDate);
            const localStart = new Date(utcStart.getTime() + utcStart.getTimezoneOffset() * 60000);
            const utcEnd = laptop.outDate? new Date(laptop.outDate) : null;
            const localEnd = utcEnd? new Date(utcEnd.getTime() + utcEnd.getTimezoneOffset() * 60000): utcEnd;

            this.setState({
                laptop_id: laptop.laptop_id,
                model: laptop.model,
                serial_number: laptop.serial_number,
                warranty_provider: laptop.warranty_provider,
                owner: laptop.owner,
                cost: laptop.cost,
                comment: laptop.comment,
                vendor: laptop.vendor,
                order_num: laptop.order_num,
                warranty: laptop.warranty ? laptop.warranty.match(/\d+/) : null,
                warrantyUnit: laptop.warranty ? laptop.warranty.replace(/[\d\s]/, '').trim() : null,
                inDate: localStart,
                outDate: localEnd,
                archived: laptop.archived,
                broken: laptop.broken
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

    handleDate(date){
        this.setState({date});
    }

    handleCheck(e){
        this.setState({
            broken: e.target.checked
        })
    }

    handleWarranty(e){
        const val = e.target.value === '0' ? null : e.target.value;
        this.setState({
            warranty: val
        })
    }

    handleRetire(e){
        e.preventDefault();
        const end = this.state.outDate?moment(this.state.outDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
        Axios.post('/laptops/retire', {
            laptop_id: this.state.laptop_id,
            end: end
        })
        .then(res => {
            this.props.history.push('/assets/laptops')
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data);
        })
    }

    handleUnretire(){
        Axios.post('/laptops/unretire', {
            laptop_id: this.state.laptop_id
        })
        .then(res=>{
            this.props.history.push('/assets/laptops')
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data)
        })
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/laptops/updateLaptop', {
            laptop_id: this.state.laptop_id,
            model: this.state.model,
            serial_number: this.state.serial_number,
            warranty_provider: this.state.warranty_provider,
            cost: this.state.cost,
            vendor: this.state.vendor,
            order_num: this.state.order_num,
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
        const invalid1 = this.state.serial_number == null || this.state.model == null || this.state.inDate == null || this.state.order_num == null
                            || this.state.cost == null || this.state.cost < 0;
        const invalid2 = this.state.serial_number == null || this.state.model == null || this.state.inDate == null || this.state.order_num == null
                            || this.state.cost == null || this.state.outDate == null || this.state.cost < 0;

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
                        <FormGroup controlId='cost'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Cost*
                            </Col>
                            <Col sm={6}>
                                <FormControl
                                    type='number'
                                    step={'0.01'}
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
                        <FormGroup controlId='order_num'>
                            <Col componentClass={ControlLabel} sm={3}>
                                Order Number*
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
                        {this.state.archived ?
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
                                        <FontAwesomeIcon icon='check'/> Update Laptop
                                    </Button>
                                    {!this.state.archived?
                                        <ManageModal
                                            type='Retire'
                                            title='Retire laptop'
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
