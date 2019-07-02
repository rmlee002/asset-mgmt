import React, { Component } from 'react';
import ReactTable from "react-table";
import moment from 'moment';

export default class OOWDevices extends Component{

    render(){
        const data = this.props.data.filter(item =>
            item.warranty?moment(item.inDate).utc().isBefore(moment().utc().subtract(parseInt(item.warranty.replace(/\D+/, '')), 'years')):true);

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
                Cell: val => moment(val.value).utc().format('YYYY-MM-DD'),
                width: 90
            },
            {
                Header: "Broken?",
                accessor: "broken",
                Cell: val => val.value===0?'N':'Y',
                width: 70
            },
            {
                Header: "Comment",
                accessor: "comment",
                style: { 'white-space': 'unset' }
            }
        ];

        return(
            <React.Fragment>
                <ReactTable
                    data={data}
                    columns={columns}
                />
            </React.Fragment>
        );
    }
}