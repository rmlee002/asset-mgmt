import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Links from '../Nav';
import Axios from 'axios';

export default class EmployeeAssets extends Component{
    constructor(props){
        super(props);

        this.state = {
            assets: []
        }
    }

    componentDidMount(){
        Axios.post('/employees/history', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
                throw new Error("Bad response from server");
            }
            this.setState({
                assets: res.data
            })
        })
        .catch(err =>{
            alert(err + " sdfsdf")
            console.log(err)
        })
    }

    render(){
        return(
            <div>
                <Links />
                <LinkContainer to={`/employees/${this.props.match.params.emp_id}/addAsset`}>
                    <Button bsStyle='primary'>
                        Add asset
                    </Button>
                </LinkContainer>
                <Table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Model</th>
                            <th>Serial Number</th>
                            <th>Comment</th>
                            <th>Start Date</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </Table>
            </div>
        );
    }
}