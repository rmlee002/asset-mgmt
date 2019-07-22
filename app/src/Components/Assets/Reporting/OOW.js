import React, { Component } from 'react';
import ReactTable from "react-table";
import moment from 'moment';

export default class OOWDevices extends Component{

    render(){
        const data = this.props.data.filter(item => {
            if (item.warranty){
                const length = item.warranty.replace(/\D+/, '');
                const unit = item.warranty.replace(/[\d\s]+/, '').trim() === 'yr.' ? 'years' : 'months';
                return moment().utc().isSameOrAfter(moment(item.inDate).utc().add(length, unit))
            }
            else{
                return true;
            }
        });

        const columns = [
            {
                Header: "Serial Number",
                accessor: "serial_number",
                style: { 'whiteSpace': 'unset' }
            },
            {
                Header: "Model",
                accessor: "model",
                style: { 'whiteSpace': 'unset' }
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
                style: { 'whiteSpace': 'unset' }
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
