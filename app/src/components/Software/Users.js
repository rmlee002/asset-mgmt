import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Axios from 'axios';
import moment from 'moment';
import Filter from '../Filter';
import ManageModal from '../ManageModal';

export default class Users extends Component{
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.total=this.total.bind(this)
        this.filterName = this.filterName.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEnd = this.handleEnd.bind(this)

        this.state={
            users: [],
            filtered: [],
            name: undefined,
            show: false,
            end: new Date(),
            emp_id: null
        }
    }

    componentDidMount(){
        Axios.post('/licenses', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            this.setState({
                users: res.data.info,
                filtered: res.data.info,
                name: res.data.name
            })
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data.error)
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

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    handleSubmit(){
        Axios.post('/licenses/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            software_id: this.props.match.params.software_id,
            emp_id: this.state.emp_id
        })
        .catch(err => {
            alert(err.response.data.error)
            console.log(err)
        })
    }

    total(){
        var total = 0;
        this.state.filtered.forEach((user) => {
            if (moment(user.start).isBefore(moment(),'month')){
                total += user.cost
            }
            else{
                const day = moment(user.start).date()
                total += ((30-day + 1) / 30) * parseInt(user.cost)
            }            
        })
        return total.toFixed(2)
    }

    render(){
        return(
            <React.Fragment>
                <h3>Total monthly cost for {this.state.name} license: ${this.total()}</h3>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map((user) => 
                            <tr>
                                <td>{user.first_name+' '+user.last_name}</td>
                                <td>{user.department}</td>
                                <td>{user.start?moment(user.start).format('YYYY-MM-DD'):''}</td>
                                <td>
                                    <ManageModal
                                        id='Retire'
                                        title='Retire user'
                                        date={this.state.end}
                                        handleClick={()=> this.setState({emp_id: user.emp_id})}
                                        handleSubmit={this.handleSubmit}
                                        handleDate={this.handleEnd}
                                    />
                                </td>
                            </tr>
                            )}
                    </tbody>
                </Table>
            </React.Fragment>
        );
    }
}