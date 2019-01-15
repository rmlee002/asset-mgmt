import React, { Component } from 'react';
import { Button, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
import Links from '../Nav';
import Axios from 'axios';

export default class ChangeOwner extends Component{
    constructor(props){
        super(props);

        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            employees: [],
            filtered: []
        }
    }

    componentDidMount(){
        Axios.get('/employees')
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error('Bad response from server')
            }
            this.setState({
                employees: res.data,
                filtered: res.data
            })
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    componentWillReceiveProps(next){
        this.setState({
            filtered: next.items
        })
    }

    handleChange(e){
        let currList=[];
        let newList=[];
        if (e.target.value !== ''){
            currList = this.state.employees;
            newList = currList.filter(item => {
                const lower = (item.first_name+" "+item.last_name).toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lower.includes(filter);
            });
        }
        else {
            newList = this.state.employees;
        }
        this.setState({ filtered: newList});
    }

    handleClick(id){
        Axios.post('/')
    }

    render(){
        return(
            <div>
                <Links />
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter values'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map(employee =>
                            <tr>
                                <td>{employee.first_name+' '+employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.department}</td>
                                <td>
                                    <Button bsStyle='primary' onClick={this.handleClick(employee.emp_id)}>
                                        Assign ownership
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>            
        );
    }
}