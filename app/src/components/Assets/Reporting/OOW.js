import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';
import moment from 'moment';

export default class OOWDevices extends Component{

    render(){
        const data = this.props.data.filter(item => 
            item.warranty?moment(item.inDate).isBefore(moment().subtract(parseInt(item.warranty.replace(/\D+/, '')), 'years')):true)

        return(
            <Panel bsStyle='danger'>
                <Panel.Heading>
                    <Panel.Title componentClass='h3'>Out of Warranty Devices</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Model</th>
                                <th>Contract</th>
                                <th>Owner</th>
                                <th>Warranty</th>
                                <th>Warranty Provider</th>
                                <th>In Date</th>
                                <th>Broken</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item =>
                                <tr>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.contract}</td>
                                    <td>{item.owner}</td>         
                                    <td>{item.warranty}</td>
                                    <td>{item.warranty_provider}</td>
                                    <td>{moment(item.inDate).utc().format('YYYY-MM-DD')}</td>
                                    <td>{item.broken?'Y':'N'}</td>
                                    <td>{item.comment}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Panel.Body>
            </Panel>
        )
    }
}