import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';
import moment from 'moment';

export default class BrokenDevices extends Component{

    render(){
        const data = this.props.data.filter(item => item.broken)

        return(
            <Panel bsStyle='danger'>
                <Panel.Heading>
                    <Panel.Title componentClass='h3'>Broken Devices</Panel.Title>
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
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item =>
                                <tr style={{backgroundColor: getColor(item)}}>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.contract}</td>
                                    <td>{item.owner}</td>         
                                    <td>{item.warranty}</td>
                                    <td>{item.warranty_provider}</td>
                                    <td>{moment(item.inDate).utc().format('YYYY-MM-DD')}</td>
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

function getColor(item){
    if (item.warranty == null || moment().isSameOrAfter(moment(item.inDate).add(parseInt(item.warranty.replace(/\D+/, '')), 'years').subtract(3, 'months'))){
        return '#ffbebe'
    }
    return null
}