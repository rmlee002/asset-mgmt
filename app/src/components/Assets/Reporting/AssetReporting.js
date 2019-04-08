import React, { Component } from 'react';
import { Tabs, Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import Axios from 'axios';
import Data from './Data';
import OldestDevices from './OldestDevices';
import OOWDevices from './OOW';
import BrokenDevices from './Broken';

export default class Reporting extends Component{
    constructor(props){
        super(props)

        this.state = {
            key: 'all',
            departments: [],
            data: [],
            all: []
        }

        this.handleSelect = this.handleSelect.bind(this)
    }

    componentDidMount(){
        Axios.get('/departments')
        .then(res => {
            this.setState({
                departments: res.data
            })
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })

        Axios.get('/hwReporting')
        .then(res => {
            this.setState({
                data: res.data,
                all: res.data
            })
        })
        .catch(err =>{
            if (err){
                console.log(err)
                alert(err.response.data)
            }
        })

        this.setState({
            key: this.props.match.params.contract
        })
    }

    handleSelect(key){
        if (key === 'all'){
            this.setState({
                key: key,
                data: this.state.all
            })
        }
        else{
            this.setState({
                key: key,
                data: this.state.all.filter(item => item.contract?item.contract.toLowerCase().split(',').includes(key):false)
            })
        }        
    }

    render(){
        return(
            <React.Fragment>
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect}>
                    <Tab eventKey="all" title="All"></Tab>
                    {
                        this.state.departments.map(option =>
                            <Tab eventKey={option.label.toLowerCase()} title={option.label}></Tab>
                        )
                    }
                </Tabs>

                <Tab.Container defaultActiveKey='1'>
                    <Row className="clearfix">
                        <Col sm={2}>
                            <Nav bsStyle="pills" stacked>
                                <NavItem eventKey="1">Data</NavItem>
                                <NavItem eventKey="2">Broken Devices</NavItem>
                                <NavItem eventKey="3">Out of Warranty Devices</NavItem>
                                <NavItem eventKey="4">Oldest Devices</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={10}>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="1">
                                    <Data/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="2">
                                    <BrokenDevices data={this.state.data} />    
                                </Tab.Pane>
                                <Tab.Pane eventKey="3">
                                    <OOWDevices data={this.state.data} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="4">
                                    <OldestDevices data={this.state.data} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </React.Fragment>
        )
    }
}