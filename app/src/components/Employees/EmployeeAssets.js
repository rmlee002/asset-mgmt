import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import moment from 'moment';
import ManageModal from '../ManageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class EmployeeAssets extends Component{
    constructor(props){
        super(props);

        this.handleEnd = this.handleEnd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            show: false,
            end: new Date(),
            asset_id: null,
            assets: [],
            loggedIn: false
        }
    }

    componentDidMount(){        
        Axios.post('/history/employee', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            this.setState({
                assets: res.data
            })
        })
        .catch(err =>{
            alert(err.response.data)
            console.log(err)
        })

        Axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    handleSubmit(){
        Axios.post('/history/retire', {
            asset_id: this.state.asset_id,
            emp_id: this.props.match.params.emp_id,
            end: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    render(){
        const loggedIn = this.state.loggedIn

        return(
            <React.Fragment>
                {loggedIn && 
                    <LinkContainer to={`/employees/${this.props.match.params.emp_id}/assets/add`}>
                        <Button bsStyle='primary'>
                            <FontAwesomeIcon icon='laptop-medical'/> Add asset
                        </Button>
                    </LinkContainer>
                }
                
                <div className='data empAssets'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Model</th>                            
                                <th>Comment</th>
                                <th>Start Date</th>
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.assets.map(item => 
                                <tr>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.comment}</td>
                                    <td>{item.start?moment(item.start).format('YYYY-MM-DD'):''}</td>
                                    <td>
                                        {loggedIn && 
                                            <ManageModal
                                                type='Retire'
                                                title='Retire asset'
                                                date={this.state.end}
                                                handleClick={() => this.setState({asset_id: item.asset_id})}
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