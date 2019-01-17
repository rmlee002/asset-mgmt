import React, { Component } from 'react';
import { Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Links from '../Nav';
import axios from 'axios';

export default class History extends Component{
    constructor(props){
        super(props);

        this.state = {
            owners: []
        }
    }

    componentDidMount(){
        axios.post('/assets/history', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res =>{
            if (res.status >= 400){
                alert(res.data.error);
            }
            this.setState({
                owners: res.data
            })
        })
        .catch(err => {
            alert(err)
            console.log(err);
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
                            <th>Name</th>
                            <th>Start</th>
                            <th>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.owners.map(owner => 
                            <tr>
                                <td>{owner.first_name+' '+owner.last_name}</td>
                                {/* <td>
                                    {owner.start?
                                        moment(owner.start).utc().format('YYYY-MM-DD'):''}
                                </td>
                                <td>
                                    {owner.end?
                                        moment(owner.end).utc().format('YYYY-MM-DD'):''}
                                </td> */}
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}