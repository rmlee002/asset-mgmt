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
        this.handleResize = this.handleResize.bind(this)
        this.handleNameAscend = this.handleNameAscend.bind(this)
        this.handleNameDescend = this.handleNameDescend.bind(this)
        this.handleCostAscend = this.handleCostAscend.bind(this)
        this.handleCostDescend = this.handleCostDescend.bind(this)

        this.state={
            showArchived: false,
            software: [],
            filtered: [],
            loggedIn: false,
            theight: document.documentElement.clientHeight - 250,
            nameIcon: 'sort',
            costIcon: 'sort'
        }
    }

    componentDidMount(){
        Axios.get('/softwares')
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

    handleResize(){
        const h = document.documentElement.clientHeight - 250
        this.setState({
            theight: h
        })
    }

    handleCheck(e){
        this.setState({
            showArchived: e.target.checked,
            filtered: this.state.software.filter((software) => !software.archived || e.target.checked)
        })
    }

    handleNameAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return a.name.localeCompare(b.name) }),
            nameIcon: 'sort-up',
            costIcon: 'sort'
        })
    }

    handleNameDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return b.name.localeCompare(a.name) }),
            nameIcon: 'sort-down',
            costIcon: 'sort'
        })
    }

    handleCostAscend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return a.cost - b.cost }),
            costIcon: 'sort-up',
            nameIcon: 'sort'
        })
    }

    handleCostDescend(){
        this.setState({
            filtered: this.state.filtered.sort(function(a,b){ return b.cost - a.cost }),
            costIcon: 'sort-down',
            nameIcon: 'sort'
        })
    }

    render(){
        const loggedIn = this.state.loggedIn
        const userHead ={
            width: loggedIn?'150px':'166.5px'
        }

        const nameIcon = this.state.nameIcon
        const costIcon = this.state.costIcon

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
                <Checkbox inline checked={this.state.showArchived} onChange={this.handleCheck}>
                    Show retired
                </Checkbox>
                <ButtonToolbar className='pull-right'>
                    {loggedIn &&
                        <LinkContainer to='/software/add'>
                            <Button bsStyle='primary'> <FontAwesomeIcon icon='desktop'/> Add Software</Button>
                        </LinkContainer>   
                    }                                     
                    <LinkContainer to='/software/overview'>
                        <Button>View all active licenses</Button>
                    </LinkContainer>                    
                </ButtonToolbar>
                <div className='data' id='software'>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th 
                                    className='sort-head'
                                    onClick={(nameIcon==='sort'||nameIcon==='sort-down')?this.handleNameAscend:this.handleNameDescend}    
                                >
                                    License <FontAwesomeIcon icon={nameIcon}/>
                                </th>
                                <th 
                                    className='sort-head'
                                    onClick={(costIcon==='sort'||costIcon==='sort-down')?this.handleCostAscend:this.handleCostDescend}    
                                >
                                    Monthly Cost <FontAwesomeIcon icon={costIcon}/>
                                </th> 
                                <th style={userHead}></th>
                                {loggedIn && <th></th>}
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map((software) =>
                                <tr>
                                    <td>{software.name}</td>
                                    <td>{software.cost?'$'+software.cost:''}</td>
                                    <td>
                                        <Link to={`/software/${software.software_id}/users`}>
                                            <FontAwesomeIcon icon='users'/> Users
                                        </Link>
                                    </td>
                                    {loggedIn &&
                                        <td>
                                            <Link to={`software/${software.software_id}/manage`}>
                                                <FontAwesomeIcon icon='edit'/> Manage
                                            </Link>
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