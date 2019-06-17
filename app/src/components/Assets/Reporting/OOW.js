import React, { Component } from 'react';
import ReactTable from "react-table";
import moment from 'moment';

export default class OOWDevices extends Component{

    render(){
        const data = this.props.data.filter(item =>
            item.warranty?moment(item.inDate).isBefore(moment().subtract(parseInt(item.warranty.replace(/\D+/, '')), 'years')):true);

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
                accessor: "contract"
            },
            {
                Header: "Owner",
                accessor: "owner"
            },
            {
                Header: "Warranty",
                accessor: "warranty"
            },
            {
                Header: "Warranty Provider",
                accessor: "warranty_provider"
            },
            {
                Header: "In Date",
                accessor: "inDate",
                Cell: val => moment(val.value).format('YYYY-MM-DD')
            },
            {
                Header: "Broken?",
                accessor: "broken",
                Cell: val => val.value===0?'N':'Y'
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