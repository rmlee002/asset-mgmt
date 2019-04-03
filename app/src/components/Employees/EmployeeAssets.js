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
        this.handleResize = this.handleResize.bind(this)

        this.state = {
            show: false,
            end: new Date(),
            laptop_id: null,
            assets: [],
            loggedIn: false,
            theight: document.documentElement.clientHeight - 200
        }
    }

    componentDidMount(){        
        Axios.post('/laptopHistory/employee', {
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

        window.addEventListener('resize', this.handleResize)
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    handleResize(){
        const h = document.documentElement.clientHeight - 200
        this.setState({
            theight: h
        })
    }

    handleSubmit(){
        Axios.post('/laptopHistory/retire', {
            laptop_id: this.state.laptop_id,
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
        const startHead={
            width: loggedIn?null:'336.5px'
        }
        return(
            <React.Fragment>
                {loggedIn &&
                    <LinkContainer to={`/employees/${this.props.match.params.emp_id}/assets/add`}>
                        <Button bsStyle='primary'>
                            <FontAwesomeIcon icon='laptop-medical'/> Add asset
                        </Button>
                    </LinkContainer>
                }
                
                <div className='data' id='empAssets'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Model</th>                            
                                <th>Comment</th>
                                <th style={startHead}>Start Date</th>
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight, overflowY: 'scroll'}}>
                            {this.state.assets.map(item => 
                                <tr>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>
                                    <td>{item.comment}</td>
                                    <td>{item.start?moment(item.start).format('YYYY-MM-DD'):''}</td>
                                    {loggedIn &&
                                        <td>
                                            <ManageModal
                                                type='Retire'
                                                title='Retire asset'
                                                date={this.state.end}
                                                handleClick={() => this.setState({laptop_id: item.laptop_id})}
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