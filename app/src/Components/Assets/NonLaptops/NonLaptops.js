import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Checkbox } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';

export default class NonLaptops extends Component{
    constructor(props){
        super(props);
        this.state = {
            assets: [],
            filtered: [],
            showArchived: false,
            loggedIn: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount(){
        let self = this;
        axios.get('/nonlaptops')
        .then(function(res) {
            self.setState({
                assets: res.data,
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
                filtered: this.filter(this.state.assets.filter((item) =>  !(item.archived) || this.state.showArchived), e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.assets.filter((item) =>  !(item.archived) || this.state.showArchived)
            })
        }
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.assets.filter((item) =>  !(item.archived) || e.target.checked)
        })
    }

    render(){     
        const loggedIn = this.state.loggedIn;

        const columns = [
            {
                Header: "Serial Number",
                accessor: "serial_number",
                style: { 'whiteSpace': 'unset' },
                width: 140
            },
            {
                Header: "Model",
                accessor: "model",
                style: { 'whiteSpace': 'unset' }
            },
            {
                Header: "Description",
                accessor: "description",
                style: { 'whiteSpace': 'unset' }
            },
            {
                Header: "Warranty Provider",
                accessor: "warranty_provider",
                width: 130
            },
            {
                Header: "Owner",
                accessor: "owner",
                width: 80
            },
            {
                Header: "Contract",
                accessor: "contract",
                width: 80
            },
            {
                Header: "Cost",
                accessor: "cost",
                Cell: val => val.value? "$"+val.value.toFixed(2) : "",
                width: 70
            },
            {
                Header: "Vendor",
                accessor: "vendor"
            },
            {
                Header: "Order Number",
                accessor: "order_number",
                style: { 'whiteSpace': 'unset' }
            },
            {
                Header: "Warranty",
                accessor: "warranty",
                width: 80
            },
            {
                Header: "In Date",
                accessor: "inDate",
                Cell: val => moment(val.value).utc().format('YYYY-MM-DD'),
                width: 90
            },
            {
                Header: "Out Date",
                accessor: "outDate",
                Cell: val => val.value?moment(val.value).utc().format('YYYY-MM-DD'):null,
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
                style: { 'whiteSpace': 'unset' }
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
                        <LinkContainer to='/assets/nonlaptops/add'>
                            <Button 
                                className='pull-right'
                                bsStyle='primary'
                            >
                                <FontAwesomeIcon icon="plus"/> Add hardware
                            </Button>
                        </LinkContainer>
                    }
                </div>
                <br/>
                {
                    loggedIn?
                        <ReactTable
                            data={this.state.filtered}
                            columns={columns}
                            className="-striped -highlight"
                            SubComponent={row => {
                                return (
                                    <div style={{margin: 'auto', padding:'20px'}}>
                                        <LinkContainer to={`/assets/nonlaptops/${row.original.hardware_id}/manage`}>
                                            <Button bsStyle={'primary'}>Edit <FontAwesomeIcon icon='edit'/></Button>
                                        </LinkContainer>
                                    </div>
                                )
                            }}
                        />
                    :
                        <ReactTable
                            data={this.state.filtered}
                            columns={columns}
                            className="-striped -highlight"
                        />
                }
            </React.Fragment>
        );
    }
}