import React, { Component } from 'react';
import moment from 'moment';
import ReactTable from 'react-table';

export default class OldestDevices extends Component{

    render(){
        const data = this.props.data.filter(item => moment().diff(moment(item.inDate), 'years') >= 3);
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
                accessor: "accessor",
                width: 80
            },
            {
                Header: "Owner",
                accessor: "owner"
            },
            {
                Header: "In Date",
                accessor: "inDate",
                Cell: val => moment(val.value).utc().format("YYYY-MM-DD"),
                width: 90
            },
            {
                Header: "Broken",
                accessor: "broken",
                Cell: val => val.value === 0 ? "N":"Y",
                width: 70
            },
            {
                Header: "Comment",
                accessor: "comment",
                style: { 'white-space': 'unset' }
            }
        ];

        return(
            <ReactTable
                data={data}
                columns={columns}
            />
        )
    }
}