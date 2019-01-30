import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import axios from 'axios';
import memoize from 'memoize-one';

export default class Assets extends Component{
    constructor(props){
        super(props);
        this.state = {
            assets: [],
            filtered: [],
            showArchived: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentDidMount(){
        let self = this;
        axios.get('/assets')
        .then(function(res) {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error("Bad response from server");
            }
            self.setState({
                assets: res.data, 
                filtered: res.data.filter((item)=>!item.archived)
            });
        }).catch(err => {
            console.log(err);
            alert(err);
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
        return(
            <div>
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter serial number'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <LinkContainer to='/assets/add'>
                    <Button bsStyle='primary'>Add assets</Button>
                </LinkContainer>
                <Checkbox checked={this.state.showArchived} onChange={this.handleCheck}>
                    Show retired
                </Checkbox>
                <Table>
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Model</th>                            
                            <th>Warranty Provider</th>
                            <th>Owner</th>
                            <th>Cost</th>
                            <th>Comment</th>
                            <th>Vendor</th>
                            <th>Order Number</th>
                            <th>Warranty</th>
                            <th>In Date</th>
                            <th>Out Date</th>
                            <th></th>
                            <th></th>
                            <th></th>
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
                                <td><Link to={`/assets/${item.asset_id}/history`}>History</Link></td>
                                <td><Link to={`/assets/manage/${item.asset_id}`}>Manage</Link></td>
                                <td><Link to={`/assets/editOwner/${item.asset_id}`}>Assign owner</Link></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}