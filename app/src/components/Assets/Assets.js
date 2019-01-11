import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import moment from 'moment';
import Links from '../Nav';
import axios from 'axios';

export default class Assets extends Component{
    constructor(props){
        super(props);
        this.state = {
            assets: [],
            filtered: []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        let self = this;
        axios.get('/assets')
        .then(function(res) {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error("Bad response from server");
            }
            self.setState({assets: res.data, filtered: res.data});
        }).catch(err => {
            console.log(err);
            alert(err);
        })
    }

    handleChange(e){
        let currList = [];
        let newList = [];
        if (e.target.value !== ''){
            currList = this.state.assets;
            newList = currList.filter(item => {
                const lower = (item.description).toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lower.includes(filter);
            });
        }
        else {
            newList = this.state.assets;
        }
        this.setState({ filtered: newList});
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            filtered: nextProps.items
        })
    }

    render(){
        return(
            <div>
                <Links />
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter values'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <Table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Model</th>
                            <th>Serial Number</th>
                            <th>Warranty Provider</th>
                            <th>Owner</th>
                            <th>Cost</th>
                            <th>Comment</th>
                            <th>Vendor</th>
                            <th>Order Number</th>
                            <th>Warranty</th>
                            <th>In Date</th>
                            <th>Out Date</th>
                            <th>Contract</th>
                            <th>Asset History</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map(item =>
                            <tr key={item.asset_id}>
                                <td>{item.description}</td>
                                <td>{item.model}</td>
                                <td>{item.serial_number}</td>
                                <td>{item.warranty_provider}</td>
                                <td>{item.owner}</td>
                                <td>{item.cost?'$'+item.cost.toFixed(2):''}</td>
                                <td>{item.comment}</td>
                                <td>{item.vendor}</td>
                                <td>{item.order_number}</td>
                                <td>{item.warranty}</td>
                                <td>
                                    {item.in?
                                        moment(item.in).utc().format('YYYY-MM-DD'):''}
                                </td>
                                <td>
                                    {item.out?
                                        moment(item.out).utc().format('YYYY-MM-DD'):''}
                                </td>
                                <td>{item.contract}</td>
                                <td><a>History</a></td>
                                <td><a>Manage</a></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}