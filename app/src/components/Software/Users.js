import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Links from '../Nav';
import Axios from 'axios';
import moment from 'moment';

export default class Users extends Component{
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.total=this.total.bind(this)

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

    filter = memoize(
        (list, filterText) => list.filter(item => (item.first_name+' '+item.last_name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.users, e.target.value)
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
        this.state.users.forEach((user) => {
            const month = moment(user.start).get('month')
            const day = moment(user.start).date()
            total += ((30-day + 1) / 30) * this.props.location.state.cost
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