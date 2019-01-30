import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import moment from 'moment';

export default class EmployeeLicenses extends Component{
    constructor(props){
        super(props)

        this.state={
            licenses: []
        }
    }

    componentDidMount(){
        Axios.post('/licenses/getUserData', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.setState({
                    licenses: res.data
                })
            }
        })
    }

    render(){
        return(
            <div>
                <LinkContainer to={`/employees/${this.props.match.params.emp_id}/licenses/add`}>
                    <Button bsStyle='primary'>Add license</Button>
                </LinkContainer>
                
                <Table>
                    <thead>
                        <tr>
                            <th>License</th>
                            <th>Start</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.licenses.map((license) => 
                            <tr>
                                <td>{license.name}</td>
                                <td>{license.start?moment(license.start).format('YYYY-MM-DD'):''}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}