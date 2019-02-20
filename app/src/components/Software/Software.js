import React, { Component } from 'react';
import { Table, FormGroup, ControlLabel, FormControl, Button, ButtonToolbar, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Axios from 'axios';
import '../../Styles/Software.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Employees extends Component {
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleCheck = this.handleCheck.bind(this)

        this.state={
            showArchived: false,
            software: [],
            filtered: []
        }
    }

    componentDidMount(){
        Axios.get('/software')
        .then(res => {
            this.setState({
                software: res.data,
                filtered: res.data.filter((item)=> !item.archived)
            })
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err)
        })
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.name).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.software.filter((software)=>!software.archived || this.state.showArchived), e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.software.filter((software)=> !software.archived || this.state.showArchived)
            })
        }        
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.software.filter((software) => !software.archived || e.target.checked)
        })
    }

    render(){
        return(
            <React.Fragment>
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
                        <Button bsStyle='primary'> <FontAwesomeIcon icon='desktop'/> Add Software</Button>
                    </LinkContainer>                    
                    <LinkContainer to='/software/overview'>
                        <Button>View all active licenses</Button>
                    </LinkContainer>                    
                </ButtonToolbar>
                <Checkbox checked={this.state.showArchived} onChange={this.handleCheck}>
                    Show retired
                </Checkbox>
                <div className='data software'>
                    <Table>
                        <thead>
                            <tr>
                                <th>License</th>
                                <th>Monthly Cost</th> 
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.filtered.map((software) =>
                                <tr>
                                    <td>{software.name}</td>
                                    <td>{software.cost?'$'+software.cost:''}</td>
                                    <td>
                                        <Link to={`/software/${software.software_id}/users`}>
                                            <FontAwesomeIcon icon='users'/> Users
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`software/${software.software_id}/manage`}>
                                            <FontAwesomeIcon icon='edit'/> Manage
                                        </Link>
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