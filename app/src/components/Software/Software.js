import React, { Component } from 'react';
import { Table, FormGroup, ControlLabel, FormControl, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Links from '../Nav';

export default class Employees extends Component {
    render(){
        return(
            <div>
                <Links />
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter software'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <ButtonToolbar>
                    <LinkContainer to='/software/add'>
                        <Button bsStyle='primary'>Add Software</Button>
                    </LinkContainer>                    
                    <Button bsStyle='primary'>View all active licenses</Button>
                </ButtonToolbar>
                <Table>
                    <thead>
                        <tr>
                            <th>License</th>
                            <th>Subscription Cost</th>                            
                            <th>Total Monthly Cost</th>
                            <th>Active Users</th>
                            <th>Expected Annual Cost</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sample License</td>
                            <td>$20/mo</td>                            
                            <td>$2000</td>
                            <td><Link to='/software/1/users'>100</Link></td>
                            <td>$24,000</td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }
}