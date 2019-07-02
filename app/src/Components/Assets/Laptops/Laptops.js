import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button, Checkbox } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import '../../../Styles/Assets.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';

export default class Laptops extends Component{
    constructor(props){
        super(props);
        this.state = {
            laptops: [],
            filtered: [],
            showArchived: false,
            loggedIn: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount(){
        let self = this;
        axios.get('/laptops')
        .then(function(res) {
            self.setState({
                laptops: res.data,
                filtered: res.data.filter((item)=>!item.archived)
            });
        }).catch(err => {
            console.log(err);
            alert(err.response.data);
        });

        axios.get('/checkToken')
        .then(res => {
            self.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        });

        window.addEventListener('resize', this.handleResize)
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.serial_number).toLowerCase().includes(filterText.toLowerCase()))
    );

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.laptops.filter((item) =>  !(item.archived) || this.state.showArchived), e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.laptops.filter((item) =>  !(item.archived) || this.state.showArchived)
            })
        }
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.laptops.filter((item) =>  !(item.archived) || e.target.checked)
        })
    }

    render(){     
        const loggedIn = this.state.loggedIn;

        const columns = [
            {
                Header: "Serial Number",
                accessor: "serial_number",
                style: { 'white-space': 'unset' },
                width: 140
            },
            {
                Header: "Model",
                accessor: "model",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Warranty Provider",
                accessor: "warranty_provider",
                minWidth: 100
            },
            {
                Header: "Owner",
                id: "owner",
                accessor: val => val.first_name?val.first_name + " " + val.last_name : "",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Cost",
                accessor: "cost",
                Cell: val => val.value? "$"+val.value : "",
                width: 75
            },
            {
                Header: "Vendor",
                accessor: "vendor"
            },
            {
                Header: "Order Number",
                accessor: "order_num",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Warranty",
                accessor: "warranty",
                width: 80
            },
            {
                Header: "In Date",
                accessor: "inDate",
                Cell: val => {
                    const utcStart = new Date(val.value);
                    const localStart = new Date(utcStart.getTime() + utcStart.getTimezoneOffset()*60000);
                    return moment(localStart).format('YYYY-MM-DD');
                },
                width: 90
            },
            {
                Header: "Out Date",
                accessor: "outDate",
                Cell: val => {
                    const utcEnd = val.value? new Date(val.value): null;
                    const localEnd = val.value? new Date(utcEnd.getTime() + utcEnd.getTimezoneOffset()*60000) : null;
                    return localEnd? moment(localEnd).format('YYYY-MM-DD') : null;
                },
                width: 90
            },
            {
                Header: "Broken?",
                accessor: "broken",
                Cell: val => val.value===0?"N":"Y",
                width: 70
            },
            {
                Header: "Comment",
                accessor: "comment",
                style: { 'white-space': 'unset' }
            }
        ];

        return(
            <React.Fragment>
                <div className='header'>
                    <FormGroup controlid="search">
                        <ControlLabel>Search</ControlLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter serial number'
                            onChange = {this.handleChange}
                        />
                        <FormControl.Feedback />                                     
                    </FormGroup>
                    <Checkbox inline checked={this.state.showArchived} onChange={this.handleCheck}>
                        Show retired
                    </Checkbox>   
                    {loggedIn && 
                        <LinkContainer to='/assets/laptops/add'>
                            <Button 
                                className='pull-right'
                                bsStyle='primary'
                            >
                                <FontAwesomeIcon icon="laptop-medical"/> Add laptops
                            </Button>
                        </LinkContainer>
                    }
                </div>
                <br/>
                <ReactTable
                    data={this.state.filtered}
                    columns={columns}
                    className='-striped -highlight'
                    SubComponent={row => {
                        return (
                            <div style={{margin: 'auto', padding: '20px'}}>
                                <ButtonToolbar>
                                    <LinkContainer to={`/assets/laptops/${row.original.laptop_id}/history`}>
                                        <Button bsStyle={'primary'}>History <FontAwesomeIcon icon='history'/></Button>
                                    </LinkContainer>
                                    { this.state.loggedIn && !row.original.archived &&
                                        <LinkContainer to={`/assets/laptops/${row.original.laptop_id}/editOwner`}>
                                            <Button bsStyle={'primary'}>Assign Owner</Button>
                                        </LinkContainer>
                                    }
                                    {this.state.loggedIn &&
                                        <LinkContainer to={`/assets/laptops/${row.original.laptop_id}/manage`}>
                                            <Button bsStyle={'primary'}>Edit <FontAwesomeIcon icon='edit'/></Button>
                                        </LinkContainer>
                                    }
                                </ButtonToolbar>
                            </div>
                        )
                    }}
                />
            </React.Fragment>
        );
    }
}