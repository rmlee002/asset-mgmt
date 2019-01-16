import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Links from '../Nav';
import Add from './Add';
import axios from 'axios';
import memoize from 'memoize-one';

export default class Assets extends Component{
    constructor(props){
        super(props);
        this.state = {
            assets: [],
            filtered: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSuccessfulAdd = this.onSuccessfulAdd.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount(){
        this.refresh();
    }

    refresh(){
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

    filter = memoize(
        (list, filterText) => list.filter(item => (item.description).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        // let currList = [];
        // let newList = [];
        // if (e.target.value !== ''){
        //     currList = this.state.assets;
        //     newList = currList.filter(item => {
        //         const lower = (item.description).toLowerCase();
        //         const filter = e.target.value.toLowerCase();
        //         return lower.includes(filter);
        //     });
        // }
        // else {
        //     newList = this.state.assets;
        // }
        // this.setState({ filtered: newList});

        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.assets, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.assets
            })
        }
        
    }    

    onSuccessfulAdd(desc){
        this.setState({
            filtered: this.filter(this.state.assets, desc)
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

                <Add refresh={this.refresh} onSuccessfulAdd={this.onSuccessfulAdd}/>

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
                            <th>Department</th>
                            <th></th>
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
                                <td>{item.department}</td>
                                <td><Link to={`/assets/history/${item.asset_id}`}>History</Link></td>
                                <td><Link to={`/assets/manage/${item.asset_id}`}>Manage</Link></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}