import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Links from '../Nav';
import Axios from 'axios';
import moment from 'moment';
import Filter from '../Filter';

export default class Users extends Component{
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.total=this.total.bind(this)
        this.filterName = this.filterName.bind(this)
        this.handleFilter = this.handleFilter.bind(this)

        this.state={
            users: [],
            filtered: []
        }
    }

    componentDidMount(){
        Axios.post('/licenses', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            if(res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.setState({
                    users: res.data,
                    filtered: res.data
                })
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    filterName = memoize(
        (list, filterText) => list.filter(item => (item.first_name+' '+item.last_name).toLowerCase().includes(filterText.toLowerCase()))
    )
        
    handleFilter(options){
        this.setState({
            filtered: this.state.users.filter(item =>
                moment(item.start).isSameOrAfter(options.start) 
                && 
                moment(item.start).isSameOrBefore(options.end)
                &&
                (options.depts.length > 0 ? options.depts.map(dept => dept.value).some(dept => item.department.split(', ').includes(dept)): true)
            )
        })
    }

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filterName(this.state.users, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.users
            })
        }
        
    }

    total(){
        var total = 0;
        this.state.filtered.forEach((user) => {
            const day = moment(user.start).date()
            total += ((30-day + 1) / 30) * parseInt(user.cost)
        })
        return total.toFixed(2)
    }

    render(){
        return(
            <div>
                <Links />
                <h3>Total monthly cost: ${this.total()}</h3>
                <FormGroup controlId="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter employee name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <Filter handleFilter={this.handleFilter}/>
                <LinkContainer to={`/software/${this.props.match.params.software_id}/users/add`}>
                    <Button bsStyle='primary'>Add User</Button>  
                </LinkContainer>                                  
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Primary Cost Center</th>
                            <th>Start</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map((user) => 
                            <tr>
                                <td>{user.first_name+' '+user.last_name}</td>
                                <td>{user.department}</td>
                                <td>{user.start?moment(user.start).format('YYYY-MM-DD'):''}</td>
                            </tr>
                            )}
                    </tbody>
                </Table>
            </div>
        );
    }
}