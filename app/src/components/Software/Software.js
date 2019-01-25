import React, { Component } from 'react';
import { Table, FormGroup, ControlLabel, FormControl, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Axios from 'axios';
import Links from '../Nav';

export default class Employees extends Component {
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)

        this.state={
            software: [],
            filtered: [],
        }
    }

    componentDidMount(){
        Axios.get('/software')
        .then(res => {
            if (res.status >= 500){
                alert(res.data.error)
            }
            else{
                this.setState({
                    software: res.data,
                    filtered: res.data
                })
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.software, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.software
            })
        }
        
    }

    getData(id,cost){
        Axios.post('/licenses/getData', {
            id: id,
            cost: cost
        })
        .then(res => {
            if (res.status >= 500){
                return 'Error'
            }
            else{
                return res.data
            }
        })
    }

    render(){
        return(
            <div>
                <Links />
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter software'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <ButtonToolbar>
                    <LinkContainer to='/software/add'>
                        <Button bsStyle='primary'>Add Software</Button>
                    </LinkContainer>                    
                    <Button bsStyle='primary'>View all active licenses</Button>
                </ButtonToolbar>
                <Table>
                    <thead>
                        <tr>
                            <th>License</th>
                            <th>Monthly Cost</th> 
                            <th>Active Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filtered.map((software) => {
                            // const data = getData(software.software_id, software.cost)
                            return(
                                <tr>
                                    <td>{software.name}</td>
                                    <td>{software.cost?'$'+software.cost:''}</td>
                                    <td></td>
                                </tr>
                            )
                            })}
                    </tbody>
                </Table>
            </div>
        );
    }
}