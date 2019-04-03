import React, { Component } from 'react';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';
import image from '../Images/logolarge.png'

class Links extends Component{
    constructor(props){
        super(props)

        this.handleLogout = this.handleLogout.bind(this)

        this.state={
            loggedIn: false
        }
    }

    componentDidMount(){
        Axios.get('/checkToken')
        .then(res => {
           this.setState({loggedIn: true});       
        })
    }

    handleLogout(){
        Axios.get('/authenticate/logout')
        .then(res => {
            window.location.reload()
        })
        .catch(err => {
            alert(err)
        })
    }

    render(){
        const loggedIn = this.state.loggedIn;
        let link;
        if (loggedIn){
            link = <NavItem onClick={this.handleLogout}>Logout</NavItem>
        }
        else{
            link = 
                <LinkContainer 
                    to={{
                        pathname: '/login',
                        state: {path: this.props.location.pathname}
                    }}
                >
                    <NavItem>Login</NavItem>
                </LinkContainer> 
        }
        return (
            <Navbar fixedTop fluid collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <img src={image} alt='vid-logo'/>
                    </Navbar.Brand>
                </Navbar.Header>                    
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown title='Employees'>
                            <LinkContainer exact to='/employees'>
                                <MenuItem>View Employees</MenuItem>
                            </LinkContainer>
                            <LinkContainer to='/employees/add'>
                                <MenuItem>Add Employee</MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                        <NavDropdown title='Hardware'>
                            <LinkContainer exact to='/assets/laptops'>
                                <MenuItem>Laptops</MenuItem>
                            </LinkContainer>
                            {/* <LinkContainer to='/assets/laptops/add'>
                                <MenuItem>Add Laptop</MenuItem>
                            </LinkContainer> */}
                            <LinkContainer exact to='/assets/nonlaptops'>
                                <MenuItem>Non-Laptops</MenuItem>   
                            </LinkContainer> 
                            {/* <LinkContainer to='/assets/nonlaptops/add'>
                                <MenuItem>Add non-laptop</MenuItem> 
                            </LinkContainer>                              */}
                            <LinkContainer to='/assets/reporting'>
                                <MenuItem>Hardware Reporting</MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                        <NavDropdown title='Software'>
                            <LinkContainer exact to='/software'>
                                <MenuItem>View software</MenuItem>
                            </LinkContainer>
                            <LinkContainer to='/software/add'>
                                <MenuItem>Add software</MenuItem>
                            </LinkContainer>
                            <MenuItem>Software Reporting</MenuItem>
                        </NavDropdown>                        
                    </Nav>
                    <Nav pullRight>
                        {link}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Links);