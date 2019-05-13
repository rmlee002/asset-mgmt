import React, { Component } from 'react'
import { Nav, NavItem, Row, Col, Tab, Form, FormGroup, ControlLabel } from 'react-bootstrap'
import Axios from 'axios'
import Data from './Data'
import OldestDevices from './OldestDevices'
import OOWDevices from './OOW'
import BrokenDevices from './Broken'
import Select from 'react-select'

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
            // if (this.props.match.params.contract === 'overview'){
                this.setState({
                    data: res.data,
                    filtered: res.data
                })
            // }
            // else{
            //     this.setState({
            //         data: res.data,
            //         filtered: res.data.filter(item => item.contract?item.contract.toLowerCase().split(',').includes(this.props.match.params.contract):false)
            //     })
            // }
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    handleSelect(keys){
        const contracts = keys.map(key => key.value)
        if (contracts.length === 0){
            this.setState({
                filtered: this.state.data
            })
        }
        else{
            this.setState({
                filtered: this.state.data.filter(item => 
                    item.contract?item.contract.replace(/\s/,'').split(',').some(contract => contracts.includes(contract)):false)
            })
        }
    }

    render(){
        return(
            <React.Fragment>
                <div id="contract-select">
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Select contract:
                            </Col>
                            <Col sm = {10}>
                                <Select
                                    options={this.state.depts}
                                    onChange={this.handleSelect}
                                    isClearable
                                    isMulti
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </div>

                <Tab.Container defaultActiveKey="data">
                    <Row className='clearfix'>
                        <Col sm={2} style={{position: 'fixed'}}>
                            <Nav bsStyle='pills' stacked>
                                {/* <LinkContainer to='/assets/reporting/overview'>
                                    <NavItem eventKey="overview">Overview</NavItem>
                                </LinkContainer>
                                {this.state.depts.map(dept => 
                                    <LinkContainer to={`/assets/reporting/${dept.value}`}>
                                        <NavItem eventKey={dept.value}>{dept.label}</NavItem>
                                    </LinkContainer>)} */}
                                <NavItem eventKey="data">Data</NavItem>
                                <NavItem eventKey="broken">Broken Devices</NavItem>
                                <NavItem eventKey="oow">Out of Warranty</NavItem>
                                <NavItem eventKey="oldest">Oldest Devices</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={10} style={{marginLeft: '250px'}}>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="data">
                                    <Data data={this.state.filtered} depts={this.state.depts.map(dept => dept.value)}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="broken">
                                    <BrokenDevices data={this.state.filtered.filter(item => item.broken)}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="oow">
                                    <OOWDevices data={this.state.filtered}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="oldest">
                                    <OldestDevices data={this.state.filtered}/>
                                </Tab.Pane>
                            </Tab.Content>

                            {/* <Tabs>
                                <Tab eventKey="data" title="Data">
                                    <Data data={this.state.filtered} depts={this.state.depts.map(dept => dept.value)}/>
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
                            </Tabs> */}
                        </Col>
                    </Row>
                </Tab.Container>;
            </React.Fragment>
        );
    }
}