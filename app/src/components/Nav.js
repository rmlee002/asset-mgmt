import React, { Component } from 'react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

export default class Links extends Component{
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
                            <LinkContainer to='/hardware'>
                                <NavItem>Hardware</NavItem>
                            </LinkContainer>
                            <LinkContainer to='/software'>
                                <NavItem>Software</NavItem>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}