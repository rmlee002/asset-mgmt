import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
// import '../../../Styles/Assets.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';

export default class NonLaptops extends Component{
    constructor(props){
        super(props);
        this.state = {
            assets: [],
            filtered: [],
            showArchived: false,
            loggedIn: false,
            /*theight: document.documentElement.clientHeight - 270,
            serialIcon: 'sort',
            costIcon: 'sort',
            inIcon: 'sort',
            outIcon: 'sort'*/
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        /*this.handleResize = this.handleResize.bind(this);
        this.handleSerialAscend = this.handleSerialAscend.bind(this);
        this.handleSerialDescend = this.handleSerialDescend.bind(this);
        this.handleCostAscend = this.handleCostAscend.bind(this);
        this.handleCostDescend = this.handleCostDescend.bind(this);
        this.handleInAscend = this.handleInAscend.bind(this);
        this.handleInDescend = this.handleInDescend.bind(this);
        this.handleOutAscend = this.handleOutAscend.bind(this);
        this.handleOutDescend = this.handleOutDescend.bind(this);*/
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
            alert(err);
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

   /* handleResize(){
        const h = document.documentElement.clientHeight - 270
        this.setState({
            theight: h
        })
    }*/

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.assets.filter((item) =>  !(item.archived) || e.target.checked)
        })
    }

    /*handleSerialAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return a.serial_number.localeCompare(b.serial_number) }),
            serialIcon: 'sort-up',
            costIcon: 'sort',
            inIcon: 'sort',
            outIcon: 'sort'
        })
    }

    handleSerialDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return b.serial_number.localeCompare(a.serial_number) }),
            serialIcon: 'sort-down',
            costIcon: 'sort',
            inIcon: 'sort',
            outIcon: 'sort'
        })
    }

    handleCostAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return a.cost - b.cost }),
            costIcon: 'sort-up',
            serialIcon: 'sort',
            inIcon: 'sort',
            outIcon: 'sort'
        })
    }

    handleCostDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return b.cost - a.cost }),
            costIcon: 'sort-down',
            serialIcon: 'sort',
            inIcon: 'sort',
            outIcon: 'sort'
        })
    }

    handleInAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return(moment(a.inDate) - moment(b.inDate))}),
            inIcon: 'sort-up',
            serialIcon: 'sort',
            costIcon: 'sort',
            outIcon: 'sort'
        })
    }

    handleInDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return(moment(b.inDate) - moment(a.inDate))}),
            inIcon: 'sort-down',
            serialIcon: 'sort',
            costIcon: 'sort',
            outIcon: 'sort'
        })
    }

    handleOutAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return a==null?-1:(moment(a.outDate) - moment(b.outDate))}),
            outIcon: 'sort-up',
            serialIcon: 'sort',
            costIcon: 'sort',
            inIcon: 'sort'
        })
    }

    handleOutDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){return b==null?-1:(moment(b.outDate) - moment(a.outDate))}),
            outIcon: 'sort-down',
            serialIcon: 'sort',
            costIcon: 'sort',
            inIcon: 'sort'
        })
    }*/

    render(){     
        const loggedIn = this.state.loggedIn;
        /*const historyHead = {
            width: loggedIn?'50px':'67px'
        };

        const serialIcon = this.state.serialIcon;
        const costIcon = this.state.costIcon;
        const inIcon = this.state.inIcon;
        // const outIcon = this.state.outIcon*/

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
                Header: "Description",
                accessor: "description",
                style: { 'white-space': 'unset' }
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
                Cell: val => val.value? "$"+val.value : "",
                width: 70
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
                Cell: val => moment(val.value).format('YYYY-MM-DD'),
                width: 90
            },
            {
                Header: "Out Date",
                accessor: "outDate",
                Cell: val => val.value?moment(val.value).format('YYYY-MM-DD'):null,
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
            /*{
                id: "edit",
                accessor: val => val,
                Cell: val => <div style={{textAlign: "center"}}><Link to={`/assets/nonlaptops/${val.value.hardware_id}/manage`}><FontAwesomeIcon icon='edit'/></Link></div>

            }*/
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

                {/* <div className='data' id='hardware'> */}
                    {/*<Table striped hover>
                        <thead>
                            <tr>
                                <th 
                                    className='sort-head' 
                                    onClick={(serialIcon === 'sort' ||serialIcon==='sort-down')?this.handleSerialAscend:this.handleSerialDescend}
                                >
                                    Serial Number <FontAwesomeIcon icon={serialIcon}/>
                                </th>
                                <th>Model</th>
                                <th>Description</th>
                                <th>Warranty Provider</th>
                                <th>Owner</th>
                                <th>Contract</th>
                                <th 
                                    className='sort-head'
                                    onClick={(costIcon==='sort'||costIcon==='sort-down')?this.handleCostAscend:this.handleCostDescend}
                                >
                                    Cost <FontAwesomeIcon icon={costIcon}/>
                                </th>
                                <th>Vendor</th>
                                <th>Order Number</th>
                                <th>Warranty</th>
                                <th 
                                    className='sort-head'
                                    onClick={(inIcon === 'sort' || inIcon === 'sort-down')?this.handleInAscend:this.handleInDescend}    
                                >
                                    In Date <FontAwesomeIcon icon={inIcon}/>
                                </th>
                                <th>Out Date</th>
                                <th>Broken</th>
                                <th>Comment</th>
                                 <th style={historyHead}></th>
                                 {loggedIn && <th></th>}
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map(item =>
                                <tr key={item.hardware_id}>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.description}</td>
                                    <td>{item.warranty_provider}</td>
                                    <td>{item.owner}</td>
                                    <td>{item.contract}</td>
                                    <td>{item.cost?'$'+item.cost.toFixed(2):''}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.order_num}</td>
                                    <td>{item.warranty}</td>
                                    <td>
                                        {item.inDate?
                                            moment(item.inDate).utc().format('YYYY-MM-DD'):''}
                                    </td>
                                    <td>
                                        {item.outDate?
                                            moment(item.outDate).utc().format('YYYY-MM-DD'):''}
                                    </td>
                                    <td style={{textAlign: 'center'}}>{item.broken?'Y':'N'}</td>
                                    <td>{item.comment}</td>
                                     <td><Link to={`/assets/nonlaptops/${item.hardware_id}/history`}><FontAwesomeIcon icon='history'/></Link></td>
                                     {loggedIn &&
                                        <td>
                                            {!item.archived &&
                                                <Link to={`/assets/nonlaptops/${item.hardware_id}/editOwner`}>Assign owner</Link>
                                            }
                                        </td>
                                    }
                                    {loggedIn &&
                                        <td>
                                            <Link to={`/assets/nonlaptops/${item.hardware_id}/manage`}><FontAwesomeIcon icon='edit'/></Link>
                                        </td>
                                    }  
                                </tr>
                            )}
                        </tbody>
                    </Table>*/}
                {/* </div> */}
            </React.Fragment>
        );
    }
}