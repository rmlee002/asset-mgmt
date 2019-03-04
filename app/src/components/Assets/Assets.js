import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';
import '../../Styles/Assets.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Assets extends Component{
    constructor(props){
        super(props);
        this.state = {
            assets: [],
            filtered: [],
            showArchived: false,
            loggedIn: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentDidMount(){
        let self = this;
        axios.get('/assets')
        .then(function(res) {
            self.setState({
                assets: res.data,
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
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.serial_number).toLowerCase().includes(filterText.toLowerCase()))
    )

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
        const loggedIn = this.state.loggedIn

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
                        <LinkContainer to='/assets/add'>
                            <Button className='pull-right' bsStyle='primary'><FontAwesomeIcon icon="laptop-medical"/> Add assets</Button>
                        </LinkContainer>
                    }
                    
                </div>
                <div className='data assets'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Model</th>
                                <th>Warranty Provider</th>
                                <th>Owner</th>
                                <th>Cost</th>
                                <th>Vendor</th>
                                <th>Order Number</th>
                                <th>Warranty</th>
                                <th>In Date</th>
                                <th>Out Date</th>
                                <th>Comment</th>
                                {loggedIn && <th></th>}
                                <th></th>
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.filtered.map(item =>
                                <tr key={item.asset_id}>
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
                                    <td>{item.comment}</td>
                                    {loggedIn &&
                                        <td>
                                            {!item.archived &&
                                                <Link to={`/assets/editOwner/${item.asset_id}`}>Assign owner</Link>
                                            }
                                        </td>
                                    }
                                    
                                    <td><Link to={`/assets/${item.asset_id}/history`}><FontAwesomeIcon icon='history'/></Link></td>
                                    {loggedIn &&
                                        <td>
                                            <Link to={`/assets/manage/${item.asset_id}`}><FontAwesomeIcon icon='edit'/></Link>
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