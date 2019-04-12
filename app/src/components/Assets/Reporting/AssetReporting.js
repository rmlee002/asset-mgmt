import React, { Component } from 'react'
import { Nav, NavItem, Row, Col, Tabs, Tab } from 'react-bootstrap'
// import { Switch, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Axios from 'axios'
import Data from './Data'
import OldestDevices from './OldestDevices'
import OOWDevices from './OOW'
import BrokenDevices from './Broken'

export default class AssetReporting extends Component{
    constructor(props){
        super(props)
        this.state={
            depts: [],
            data: [],
            filtered: []
        }

        this.handleSelect = this.handleSelect.bind(this)
    }

    componentDidMount(){
        Axios.get('/departments')
        .then(res => {
            this.setState({
                depts: res.data
            })
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })

        Axios.get('/hwReporting')
        .then(res => {
            if (this.props.match.params.contract === 'all'){
                this.setState({
                    data: res.data,
                    filtered: res.data
                })
            }
            else{
                this.setState({
                    data: res.data,
                    filtered: res.data.filter(item => item.contract?item.contract.toLowerCase().split(',').includes(this.props.match.params.contract):false)
                })
            }
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    handleSelect(key){
        if (key === 'all'){
            this.setState({
                filtered: this.state.data
            })
        }
        else{
            this.setState({
                filtered: this.state.data.filter(item => item.contract?item.contract.split(',').includes(key):false)
            })
        }
    }

    render(){
        return(
            <Row className='clearfix'>
                <Col sm={2}>
                    <Nav bsStyle='pills' stacked activeKey={this.props.match.params.contract} onSelect={this.handleSelect}>
                        <LinkContainer to='/assets/reporting/all'>
                            <NavItem eventKey="all">All</NavItem>
                        </LinkContainer>
                        {this.state.depts.map(dept => 
                            <LinkContainer to={`/assets/reporting/${dept.value}`}>
                                <NavItem eventKey={dept.value}>{dept.label}</NavItem>
                            </LinkContainer>)}
                    </Nav>
                </Col>
                <Col sm={10}>
                    <Tabs>
                        <Tab eventKey="data" title="Data">
                            <Data />
                        </Tab>
                        <Tab eventKey="broken" title="Broken Devices">
                            <BrokenDevices data={this.state.filtered.filter(item => item.broken)}/>
                        </Tab>
                        <Tab eventKey="oow" title="Out of Warranty Devices">
                            <OOWDevices data={this.state.filtered}/>
                        </Tab>
                        <Tab eventKey="oldest" title="Oldest Devices">
                            <OldestDevices data={this.state.filtered}/>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        );
    }
}