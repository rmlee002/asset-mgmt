import React, { Component } from 'react';
import { Panel, Table, FormGroup, Col, ControlLabel, Form } from 'react-bootstrap';
import moment from 'moment';
import CreatableSelect from 'react-select/lib/Creatable';

export default class BrokenDevices extends Component{
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)

        this.state = {
            providers: [],
            data: [],
            filtered: []
        }
    }

    componentDidMount(){
        this.setState({
            filtered: this.state.data 
        })
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.data.length !== prevState.data.length){
            return {data: nextProps.data.filter(item => item.broken), filtered: nextProps.data.filter(item=>item.broken)}
        }
        return null;
    }
    
    handleChange(providers){
        this.setState({
            providers: providers,
            filtered: this.state.data.filter(item => providers.map(val => val.value).includes(item.warranty_provider))
        })
    }

    render(){
        var providers = []

        this.state.data.forEach(function(item){
            if (item.warranty_provider != null && !providers.includes(item.warranty_provider)){
                providers.push(item.warranty_provider)
            }
        })

        return(
            <Panel bsStyle='danger'>
                <Panel.Heading>
                    <Panel.Title componentClass='h3'>Broken Devices</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Form>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>Sort by Warranty Provider: </Col>
                            <Col sm={6}>
                                <CreatableSelect
                                    isClearable
                                    isMulti
                                    options={providers.map(function(val){return {value: val, label: val}})}
                                    onChange={this.handleChange}
                                    value={this.state.providers}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
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
                                <th>Warranty End</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.filtered.map(item =>
                                <tr>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.contract}</td>
                                    <td>{item.owner}</td>         
                                    <td>{item.warranty}</td>
                                    <td>{item.warranty_provider}</td>
                                    <td>{moment(item.inDate).utc().format('YYYY-MM-DD')}</td>
                                    <td style={{backgroundColor: getColor(item)}}>
                                        {moment(item.inDate).add(parseInt(item.warranty.replace(/\D+/, '')), 'years').format('YYYY-MM-DD')}
                                    </td>
                                    <td>{item.comment}</td>
                                    <td>{this.state.prop}</td>
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
        return '#f2dede'
    }
    return null
}