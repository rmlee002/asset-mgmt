import React, { Component } from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
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
                        <LinkContainer to='/employees'>
                            <NavItem>Employees</NavItem>
                        </LinkContainer>
                        <LinkContainer to='/assets'>
                            <NavItem>Hardware</NavItem>
                        </LinkContainer>
                        <LinkContainer to='/software'>
                            <NavItem>Software</NavItem>
                        </LinkContainer>
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