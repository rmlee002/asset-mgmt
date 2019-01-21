import React, { Component } from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Axios from 'axios';

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
            this.setState({
                loggedIn: true
            })        
        })
    }

    handleLogout(){
        Axios.get('/authenticate/logout')
        .catch(err => {
            alert(err)
        })
    }

    render(){
        return (
            <div className='Navbar'>
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/home">Home</Link>
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
                            {this.state.loggedIn?
                            // <LinkContainer to='/home'>
                                <NavItem onClick={this.handleLogout} href='/home'>Logout</NavItem>
                            // </LinkContainer>                            
                            :
                            <LinkContainer to='/login'>
                                <NavItem>Login</NavItem>
                            </LinkContainer> 
                            }        
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default withRouter(Links);