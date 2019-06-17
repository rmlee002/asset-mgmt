import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button, ButtonToolbar, Checkbox } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import memoize from 'memoize-one';
import Axios from 'axios';
import '../../Styles/Software.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTable from 'react-table';

export default class Employees extends Component {
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);

        this.state={
            showArchived: false,
            software: [],
            filtered: [],
            loggedIn: false,
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
            alert(err.response.data);
            console.log(err)
        });

        Axios.get('/checkToken')
        .then(res => {
            this.setState({
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err)
        });

        window.addEventListener('resize', this.handleResize)
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.name).toLowerCase().includes(filterText.toLowerCase()))
    );

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
        const loggedIn = this.state.loggedIn;

        const columns1 = [
            {
                Header: "License",
                accessor: "name"
            },
            {
                Header: "Monthly Cost",
                accessor: "cost",
                Cell: val => "$"+val.value
            }
        ];

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
                            <Button bsStyle='primary'><FontAwesomeIcon icon='desktop'/> Add Software</Button>
                        </LinkContainer>   
                    }
                </ButtonToolbar>
                <br/>
                <br/>
                <ReactTable
                    data={this.state.filtered}
                    columns={columns1}
                    className='-striped -highlight'
                    SubComponent={row => {
                        return (
                            <div style={{margin: 'auto', padding: '20px'}}>
                                <ButtonToolbar>
                                    <LinkContainer to={`/software/${row.original.software_id}/users`}>
                                        <Button bsStyle={'primary'}>Users <FontAwesomeIcon icon='users'/></Button>
                                    </LinkContainer>
                                    {this.state.loggedIn &&
                                        <LinkContainer to={`/software/${row.original.software_id}/manage`}>
                                            <Button bsStyle={'primary'}>Edit <FontAwesomeIcon icon='edit'/></Button>
                                        </LinkContainer>
                                    }
                                </ButtonToolbar>
                            </div>
                        )
                    }}
                />
            </React.Fragment>
        );
    }
}