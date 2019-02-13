import React, { Component } from 'react';
import { Table, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Axios from 'axios';
import memoize from 'memoize-one';
import ManageModal from '../ManageModal';
import moment from 'moment';
import ReactTable from 'react-table';

export default class EditOwner extends Component{
    constructor(props){
        super(props)

        this.handleStart = this.handleStart.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            emp_id: null,
            start: new Date(),
            employees: [],
            filtered: []
        }
    }

    componentDidMount(){
        Axios.post('/history/asset/add', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res => {
            this.setState({employees: res.data, filtered: res.data});
        }).catch(err => {
            console.log(err);
            alert(err.response.data);
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.employees, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.employees
            })
        }
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/history/add', {
            asset_id: this.props.match.params.asset_id,
            emp_id: this.state.emp_id,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null
        })
        .then(res => {
            this.props.history.push(`/assets/${this.props.match.params.asset_id}/history`)
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err)
        })
    }

    handleStart(date){
        this.setState({
            start: date
        })
    }

    render(){
        const columns=[
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Affiliation',
                accessor: 'affiliation'
            },
            {
                Header: 'Department',
                accessor: 'department'
            },
            {
                Header: 'Notes',
                accessor: 'notes'
            },
            {
                accessor: 'emp_id',
                Cell: val =>
                <ManageModal
                    id='Assign'
                    title='Add owner'
                    date={this.state.start}
                    handleClick={() => this.setState({emp_id: 0})}
                    handleSubmit={this.handleSubmit}
                    handleDate={this.handleStart}
                />
            }
        ];

        return(
            <React.Fragment>
                <div className='header'>
                    <FormGroup controlid="search">
                        <ControlLabel>Search</ControlLabel>
                        <FormControl
                            type='text'
                            placeholder='Enter name'
                            onChange = {this.handleChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                </div>
                <ReactTable
                    data={this.state.filtered}
                    columns={columns}
                />
                {/* <div className='data'>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Affiliation</th>
                                <th>Department</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.filtered.map(employee => 
                                <tr>
                                    <td>{employee.first_name+" "+employee.last_name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.affiliation}</td>
                                    <td>{employee.department}</td>
                                    <td>
                                        <ManageModal
                                            id='Assign'
                                            title='Add owner'
                                            date={this.state.start}
                                            handleClick={() => this.setState({emp_id: employee.emp_id})}
                                            handleSubmit={this.handleSubmit}
                                            handleDate={this.handleStart}
                                        />
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </Table>
                </div>                 */}
            </React.Fragment>
        ); 
    }
}