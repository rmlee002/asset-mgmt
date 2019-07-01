import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Axios from 'axios';
import moment from 'moment';
import Filter from '../Filter';
import ManageModal from '../ManageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Users extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.total=this.total.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.state={
            users: [],
            filtered: [],
            name: undefined,
            end: new Date(),
            emp_id: null,
            loggedIn: false,
            theight: document.documentElement.clientHeight - 310,
            archived: false
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
            console.log(err);
            alert(err.response.data)
        });

        Axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        });

        Axios.post('/software/checkArchived', {
            software_id: this.props.match.params.software_id
        })
        .then(res => {
            this.setState({
                archived: res.data[0].archived
            })
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data)
        });

        window.addEventListener('resize', this.handleResize)
    }

    filterName = memoize(
        (list, filterText) => list.filter(item => (item.first_name+' '+item.last_name).toLowerCase().includes(filterText.toLowerCase()))
    );
        
    handleFilter(options){
        this.setState({
            filtered: this.state.users.filter(item =>
                moment(item.start).isSameOrAfter(options.start) 
                && 
                (options.end? moment(item.start).isSameOrBefore(options.end) : true)
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
        .then(res => {
            window.location.reload()
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err)
        })
    }

    handleResize(){
        const h = document.documentElement.clientHeight - 310;
        this.setState({
            theight: h
        })
    }

    total(){
        let total = 0;
        const date = moment().date()===31?30:moment().date();
        this.state.filtered.forEach((user) => {
            if (moment(user.start).isBefore(moment(),'month')){
                total += (date/30)*user.cost;
            }
            else{
                let day = moment(user.start).date() === 31 ? 30 : moment(user.start).date();
                total += (((date - day)+1)/30)*user.cost;
            }            
        });
        return total.toFixed(2);
    }

    render(){
        const loggedIn = this.state.loggedIn;

        return(
            <React.Fragment>
                <h3>Current monthly cost for {this.state.name} license: ${this.total()}</h3>
                <FormGroup controlId="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter employee name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                {loggedIn && !this.state.archived &&
                    <LinkContainer to={`/software/${this.props.match.params.software_id}/users/add`}>
                        <Button bsStyle='primary' className='pull-right'> <FontAwesomeIcon icon='user-plus'/> Add User</Button>  
                    </LinkContainer>  
                }                
                <Filter handleFilter={this.handleFilter}/>
                <div className='data' id='users'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Primary Cost Center</th>
                                <th>Start</th>
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map((user) => 
                                <tr>
                                    <td>{user.first_name+' '+user.last_name}</td>
                                    <td>{user.department}</td>
                                    <td>{user.start?moment(user.start).format('YYYY-MM-DD'):''}</td>
                                    {loggedIn && 
                                        <td>
                                            <ManageModal
                                                type='Retire'
                                                title='Retire user'
                                                date={this.state.end}
                                                handleClick={()=> this.setState({emp_id: user.emp_id})}
                                                handleSubmit={this.handleSubmit}
                                                handleDate={this.handleEnd}
                                            />
                                        </td>
                                    }                                    
                                </tr>
                                )}
                        </tbody>
                    </Table>
                </div>                                              
            </React.Fragment>
        );
    }
}