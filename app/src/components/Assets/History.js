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
            owners: []
        }
    }

    componentDidMount(){
        axios.post('/history/asset', {
            asset_id: this.props.match.params.asset_id
        })
        .then(res =>{
            if (res.status >= 400){
                alert(res.data.error);
            }
            else{
                this.setState({
                    owners: res.data
                })
            }            
        })
        .catch(err => {
            alert(err)
            console.log(err);
        })
    }

    handleSubmit(e){
        axios.post('/history/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            history_id: this.state.id
        })
        .then(res => {
            if (res.status >= 400) {
                alert(res.data.error)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    render(){
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
                <Table>
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
                                        <ManageModal 
                                            id='Retire'
                                            title='Retire owner'
                                            date={this.state.end}
                                            handleClick={() => this.setState({ id: owner.history_id})}
                                            handleSubmit={this.handleSubmit}
                                            handleDate={this.handleEnd}
                                        />
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </React.Fragment>
        );
    }
}