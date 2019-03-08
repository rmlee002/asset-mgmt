import React, { Component } from 'react';
import { Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import ManageModal from '../ManageModal';

export default class History extends Component{
    constructor(props){
        super(props);

        this.handleEnd = this.handleEnd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            show: false,
            end: new Date(),
            owners: [],
            loggedIn: false
        }
    }

    componentDidMount(){
        axios.post('/history/asset', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res =>{
            this.setState({
                owners: res.data
            })    
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err);
        })

        axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleSubmit(id){
        axios.post('/history/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            asset_id: this.props.match.params.asset_id,
            emp_id: id
        })
        .then(res => {
            this.props.history.push(`/assets/${this.props.match.params.asset_id}/history`)
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err)
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    render(){       
        const loggedIn = this.state.loggedIn

        return(
            <React.Fragment>
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter a name'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <div id="history">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.owners.map(owner => 
                                <tr>
                                    <td>{owner.first_name+' '+owner.last_name}</td>
                                    <td>
                                        {owner.start?
                                            moment(owner.start).utc().format('YYYY-MM-DD'):''}
                                    </td>
                                    <td>
                                        {owner.end?
                                            moment(owner.end).utc().format('YYYY-MM-DD')
                                            :
                                            loggedIn &&
                                            <ManageModal 
                                                type='Retire'
                                                title='Retire owner'
                                                date={this.state.end}
                                                handleClick={() => this.setState({ emp_id: owner.emp_id})}
                                                handleSubmit={this.handleSubmit}
                                                handleDate={this.handleEnd}
                                            />
                                        }
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