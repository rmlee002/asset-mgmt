import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class SoftwareReporting extends Component { 
    constructor(props){
        super(props)

        this.state = {
            status: 'all'
        }
    }

    componentDidMount(){
        this.setState({
            status: this.props.match.params.contract?this.props.match.params.contract:"bad"
        })
    }

    render(){
        return(
            <React.Fragment>
                <LinkContainer to="/software/reporting/cqa">
                    <Button onClick={() => this.setState({status: 'cqa'})}>Change url</Button>
                </LinkContainer>
                <LinkContainer to="/software/reporting/all">
                    <Button>Change all</Button>
                </LinkContainer>
                <h1>{this.state.status}</h1>
            </React.Fragment>            
        )
    }
}