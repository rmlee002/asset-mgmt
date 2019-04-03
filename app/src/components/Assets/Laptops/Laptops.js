import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import '../../../Styles/Assets.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Laptops extends Component{
    constructor(props){
        super(props);
        this.state = {
            laptops: [],
            filtered: [],
            showArchived: false,
            loggedIn: false,
            theight: document.documentElement.clientHeight - 270,
            serialIcon: 'sort',
            costIcon: 'sort',
            inIcon: 'sort',
            outIcon: 'sort'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleSerialAscend = this.handleSerialAscend.bind(this);
        this.handleSerialDescend = this.handleSerialDescend.bind(this);
        this.handleCostAscend = this.handleCostAscend.bind(this);
        this.handleCostDescend = this.handleCostDescend.bind(this);
        this.handleInAscend = this.handleInAscend.bind(this);
        this.handleInDescend = this.handleInDescend.bind(this);
        this.handleOutAscend = this.handleOutAscend.bind(this);
        this.handleOutDescend = this.handleOutDescend.bind(this);
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
        })

        axios.get('/checkToken')
        .then(res => {
            self.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        })

        window.addEventListener('resize', this.handleResize)
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.serial_number).toLowerCase().includes(filterText.toLowerCase()))
    )

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

    handleResize(){
        const h = document.documentElement.clientHeight - 270
        this.setState({
            theight: h
        })
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.laptops.filter((item) =>  !(item.archived) || e.target.checked)
        })
    }

    handleSerialAscend(){
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
    }

    render(){     
        const loggedIn = this.state.loggedIn
        const historyHead = {
            width: loggedIn?'50px':'67px'
        }

        const serialIcon = this.state.serialIcon
        const costIcon = this.state.costIcon
        const inIcon = this.state.inIcon
        // const outIcon = this.state.outIcon

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
                <div className='data' id='laptops'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th 
                                    className='sort-head' 
                                    onClick={(serialIcon === 'sort' ||serialIcon==='sort-down')?this.handleSerialAscend:this.handleSerialDescend}
                                >
                                    Serial Number <FontAwesomeIcon icon={serialIcon}/>
                                </th>
                                <th>Model</th>
                                <th>Warranty Provider</th>
                                <th>Owner</th>
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
                                <th 
                                    // className='sort-head'
                                    // onClick={(outIcon==='sort'||outIcon==='sort-down')?this.handleOutAscend:this.handleOutDescend}
                                >
                                    Out Date 
                                    {/* <FontAwesomeIcon icon={outIcon}/> */}
                                </th>
                                <th>Broken</th>
                                <th>Comment</th>
                                <th style={historyHead}></th>
                                {loggedIn && <th></th>}
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map(item =>
                                <tr key={item.laptop_id}>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.warranty_provider}</td>
                                    <td>{item.first_name?item.first_name + " " + item.last_name:''}</td>
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
                                    <td><Link to={`/assets/laptops/${item.laptop_id}/history`}><FontAwesomeIcon icon='history'/></Link></td>
                                    {loggedIn &&
                                        <td>
                                            {!item.archived &&
                                                <Link to={`/assets/laptops/${item.laptop_id}/editOwner`}>Assign owner</Link>
                                            }
                                        </td>
                                    }                                    
                                    {loggedIn &&
                                        <td>
                                            <Link to={`/assets/laptops/${item.laptop_id}/manage`}><FontAwesomeIcon icon='edit'/></Link>
                                        </td>
                                    }  
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}