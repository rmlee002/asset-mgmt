import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button } from 'react-bootstrap';

import Links from '../Nav';

export default class Users extends Component{

    render(){
        return(
            <div>
                <Links />
                <h3>Total cost: </h3>
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter employee name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <Button bsStyle='primary'>Add User</Button>                    
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Primary Cost Center</th>
                            <th>Start</th>
                        </tr>
                    </thead>
                </Table>
            </div>
        );
    }
}