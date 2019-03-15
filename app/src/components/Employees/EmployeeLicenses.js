import React, { Component } from 'react'
import { Table, Button, Checkbox } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import ManageModal from '../ManageModal';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class EmployeeLicenses extends Component{
    constructor(props){
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEnd = this.handleEnd.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleResize = this.handleResize.bind(this)

        this.state={
            licenses: [],
            filtered: [],
            showHistory: false,
            end: new Date(),
            software_id: null,
            loggedIn: false,
            theight: document.documentElement.clientHeight - 220
        }
    }

    componentDidMount(){
        Axios.post('/licenses/getUserData', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            this.setState({
                licenses: res.data,
                filtered: res.data.filter((license)=>license.end == null)
            })
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
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
        const h = document.documentElement.clientHeight - 220
        this.setState({
            theight: h
        })
    }

    handleCheck(e){
        this.setState({
            showHistory: e.target.checked,
            filtered: this.state.licenses.filter((license)=>license.end == null || e.target.checked)
        })
    }

    handleSubmit(){
        Axios.post('/licenses/retire', {
            end: moment(this.state.end).format('YYYY-MM-DD'),
            software_id: this.state.software_id,
            emp_id: this.props.match.params.emp_id
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err)
        })
    }

    render(){
        const loggedIn = this.state.loggedIn
        
        return(
            <React.Fragment>
                {loggedIn && 
                    <LinkContainer to={`/employees/${this.props.match.params.emp_id}/licenses/add`}>
                        <Button bsStyle='primary'> <FontAwesomeIcon icon='desktop'/> Add license</Button>
                    </LinkContainer>   
                }
                
                <Checkbox checked={this.state.showHistory} onChange={this.handleCheck}>
                    Show previous licenses
                </Checkbox>
                <div className='data' id='empLicenses'>             
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>License</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight, overflowY: 'auto'}}>
                            {this.state.filtered.map((license) => 
                                <tr>
                                    <td>{license.name}</td>
                                    <td>{license.start?moment(license.start).format('YYYY-MM-DD'):''}</td>
                                    <td>
                                        {license.end?moment(license.end).format('YYYY-MM-DD'):
                                            loggedIn &&
                                            <ManageModal
                                                type='Retire'
                                                title='Retire license'
                                                date={this.state.end}
                                                handleClick={() => this.setState({ software_id: license.software_id })}
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