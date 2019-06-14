import React, { Component } from 'react'
import { Nav, NavItem, Row, Col, Tab } from 'react-bootstrap'
import Axios from 'axios'
import Data from './Data'
import OldestDevices from './OldestDevices'
import OOWDevices from './OOW'
import BrokenDevices from './Broken'

export default class AssetReporting extends Component{
    constructor(props){
        super(props);
        this.state={
            depts: [],
            data: []
        };
    }

    componentDidMount(){
        Axios.get('/hwReporting')
        .then(res => {
            this.setState({
                data: res.data
            });
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
            alert(err);
        })
    }

    render(){
        return(
            <Tab.Container defaultActiveKey="data">
                <Row >
                    <Col sm={2} style={{position: 'fixed'}}>
                        <Nav bsStyle='pills' stacked>
                            <NavItem eventKey="data">Data</NavItem>
                            <NavItem eventKey="broken">Broken Devices</NavItem>
                            <NavItem eventKey="oow">Out of Warranty</NavItem>
                            <NavItem eventKey="oldest">Oldest Devices</NavItem>
                        </Nav>
                    </Col>
                    <Col sm={10} style={{marginLeft: '17%'}}>
                        <Tab.Content animation>
                            <Tab.Pane eventKey="data">
                                <Data data={this.state.data}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="broken">
                                <BrokenDevices data={this.state.data.filter(item => item.broken)}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="oow">
                                <OOWDevices data={this.state.data}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="oldest">
                                <OldestDevices data={this.state.data}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}