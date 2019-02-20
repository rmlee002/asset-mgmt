import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl, Table} from 'react-bootstrap';
import Axios from 'axios';
import moment from 'moment';
import memoize from 'memoize-one';
import ManageModal from '../ManageModal';

export default class AddUser extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        // this.handleEmployee = this.handleEmployee.bind(this)
        this.handleStart = this.handleStart.bind(this)
        // this.handleEnd = this.handleEnd.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            employees: [],
            filtered: [],
            emp_id: null,
            start: new Date()
        }
    }

    componentDidMount(){
        Axios.post('/licenses/getEmployees', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            this.setState({
                employees: res.data,
                filtered: res.data
            })
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/licenses/add', {
            emp_id: this.state.emp_id,
            software_id: this.props.match.params.software_id,
            start: moment(this.state.start).format('YYYY-MM-DD')
        })
        .then(res => {
            this.props.history.push(`/software/${this.props.match.params.software_id}/users`)
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    handleStart(date){
        this.setState({
            start: date
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.first_name+' '+item.last_name).toLowerCase().includes(filterText.toLowerCase()))
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

    render(){
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
                <div className='data addUser'>
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
                                            type='Assign'
                                            title='Add license'
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
                </div>                
            </React.Fragment>
        );
    }
}