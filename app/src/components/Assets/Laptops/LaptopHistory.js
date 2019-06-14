import React, { Component } from 'react';
import { Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import ManageModal from '../../ManageModal';

export default class LaptopHistory extends Component{
    constructor(props){
        super(props);

        this.handleEnd = this.handleEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.state = {
            show: false,
            end: new Date(),
            owners: [],
            loggedIn: false,
            theight: document.documentElement.clientHeight - 220
        }
    }

    componentDidMount(){
        axios.post('/laptopHistory/laptop', {
            laptop_id: this.props.match.params.laptop_id
        })
        .then(res =>{
            this.setState({
                owners: res.data
            })    
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err);
        });

        axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        });

        window.addEventListener('resize', this.handleResize)
    }

    handleSubmit(id){
        axios.post('/laptopHistory/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            laptop_id: this.props.match.params.laptop_id,
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
        const h = document.documentElement.clientHeight - 220;
        this.setState({
            theight: h
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    render(){       
        const loggedIn = this.state.loggedIn;

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
                <div className='data' id="history">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight, overflowY: 'auto'}}>
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