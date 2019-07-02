import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel, Form } from 'react-bootstrap';
import moment from 'moment';
import Select from 'react-select';
import ReactTable from 'react-table';

export default class BrokenDevices extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getData = this.getData.bind(this);

        this.state = {
            providers: []
        }
    }
    
    handleChange(providers){
        this.setState({
            providers: providers
        })
    }

    getData(){
        if (this.state.providers.length === 0){
            return this.props.data
        }
        else{
            return this.props.data.filter(item => this.state.providers.map(val => val.value).includes(item.warranty_provider))
        }
    }

    render(){
        var providers = [];
        const data = this.getData();
        const columns = [
            {
                Header: "Serial Number",
                accessor: "serial_number",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Model",
                accessor: "model",
                style: { 'white-space': 'unset' }
            },
            {
                Header: "Contract",
                accessor: "contract",
                width: 80
            },
            {
                Header: "Owner",
                accessor: "owner"
            },
            {
                Header: "Warranty",
                accessor: "warranty",
                width: 80
            },
            {
                Header: "Warranty Provider",
                accessor: "warranty_provider"
            },
            {
                Header: "In Date",
                accessor: "inDate",
                Cell: val => moment(val.value).format('YYYY-MM-DD'),
                width: 90
            },
            {
                Header: "Warranty End",
                id: "warranty_end",
                accessor: val => val.warranty?
                    moment(val.inDate).add(parseInt(val.warranty.replace(/\D+/, '')), 'years').format('YYYY-MM-DD')
                    : "No warranty",
                Cell: row => (
                    <div style={getColor(row)}>
                        {row.value}
                    </div>
                ),
                width: 100
            },
            {
                Header: "Comment",
                accessor: "comment",
                style: { 'white-space': 'unset' }
            }
        ];

        this.props.data.forEach(function(item){
            if (item.warranty_provider != null && !providers.includes(item.warranty_provider)){
                providers.push(item.warranty_provider)
            }
        });

        return(
            <div>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>Sort by Warranty Provider: </Col>
                        <Col sm={7}>
                            <Select
                                isClearable
                                isMulti
                                options={providers.map(function(val){return {value: val, label: val}})}
                                onChange={this.handleChange}
                                value={this.state.providers}
                            />
                        </Col>
                    </FormGroup>
                </Form>
                <ReactTable
                    data={data}
                    columns={columns}
                />
            </div>
        )
    }
}

function getColor(item){
    if (item.original.warranty == null || moment().isSameOrAfter(moment(item.original.inDate).add(parseInt(item.original.warranty.replace(/\D+/, '')), 'years').subtract(3, 'months'))){
        return {'background': '#f2dede'}
    }
    return null
}