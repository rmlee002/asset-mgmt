import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import moment from 'moment';
import ManageModal from '../ManageModal';

export default class EmployeeAssets extends Component{
    constructor(props){
        super(props);

        this.handleEnd = this.handleEnd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            show: false,
            end: new Date(),
            asset_id: null,
            assets: []
        }
    }

    componentDidMount(){        
        Axios.post('/history/employee', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error);
            }
            this.setState({
                assets: res.data
            })
        })
        .catch(err =>{
            alert(err)
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
            history_id: this.state.id,
            end: this.state.end?moment(this.state.end).format('YYYY-MM-DD'):null
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    render(){
        return(
            <div>
                <LinkContainer to={`/employees/${this.props.match.params.emp_id}/addAsset`}>
                    <Button bsStyle='primary'>
                        Add asset
                    </Button>
                </LinkContainer>
                <Table>
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Model</th>                            
                            <th>Comment</th>
                            <th>Start Date</th>
                            <th></th>
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
                                    <ManageModal
                                        id='Retire'
                                        title='Retire asset'
                                        date={this.state.end}
                                        handleClick={() => this.setState({id: item.history_id})}
                                        handleSubmit={this.handleSubmit}
                                        handleDate={this.handleEnd}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}