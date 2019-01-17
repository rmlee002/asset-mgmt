import React, { Component } from 'react';
import { Table, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Axios from 'axios';
import memoize from 'memoize-one';
import moment from 'moment';
import Links from '../Nav';

export default class AddAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)

        this.state = {
            assets: [],
            filtered: []
        }
    }

    componentDidMount(){
        Axios.post('/employees/addAsset', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error("Bad response from server")
            }
            this.setState({
                assets: res.data,
                filtered: res.data
            })
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.description).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
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

    handleClick(id){
        const startDate = new Date();
        Axios.post('/assets/addHistory',{
            asset_id: id,
            emp_id: this.props.match.params.emp_id,
            start: moment(startDate).format('YYYY-MM-DD')
        })
        .then(res => {
            if (res.status === 200){
                this.props.history.push(`/employees/${this.props.match.params.emp_id}/assets`);
            }
            else{
                alert(res.statusText)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
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
                        placeholder='Type a name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <Table>
                    <thead>
                        <tr>
                            <th>Asset ID</th>
                            <th>Description</th>
                            <th>Model</th>
                            <th>Serial Number</th>
                            <th>Comment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map(item =>                             
                            <tr>
                                <td>{item.asset_id}</td>
                                <td>{item.description}</td>
                                <td>{item.model}</td>
                                <td>{item.serial_number}</td>
                                <td>{item.comment}</td>                          
                                <td>
                                    <Button bsStyle='success' bsSize='small' onClick={() => this.handleClick(item.asset_id)}>
                                        Add
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}