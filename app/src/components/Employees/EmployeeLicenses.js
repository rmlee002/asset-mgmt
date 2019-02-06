import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import ManageModal from '../ManageModal';
import moment from 'moment';

export default class EmployeeLicenses extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEnd = this.handleEnd.bind(this)

        this.state={
            licenses: [],
            show: false,
            end: new Date(),
            software_id: null
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
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleEnd(date){
        this.setState({
            end: date
        })
    }

    handleSubmit(){
        Axios.post('/licenses/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            software_id: this.state.software_id,
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            if (res.status  >= 400){
                alert(res.data.error)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    render(){
        return(
            <React.Fragment>
                <LinkContainer to={`/employees/${this.props.match.params.emp_id}/licenses/add`}>
                    <Button bsStyle='primary'>Add license</Button>
                </LinkContainer>   
                <div className='data'>             
                    <Table>
                        <thead>
                            <tr>
                                <th>License</th>
                                <th>Start</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.licenses.map((license) => 
                                <tr>
                                    <td>{license.name}</td>
                                    <td>{license.start?moment(license.start).format('YYYY-MM-DD'):''}</td>
                                    <td>
                                        <ManageModal
                                            id='Retire'
                                            title='Retire license'
                                            date={this.state.end}
                                            handleClick={() => this.setState({ software_id: license.software_id })}
                                            handleSubmit={this.handleSubmit}
                                            handleDate={this.handleEnd}
                                        />
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