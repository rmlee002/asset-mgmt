import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

export default class Data extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }

    componentDidMount(){

    }

    render(){
        return(
            <Panel bsStyle='info'>
                <Panel.Heading>
                    <Panel.Title componentClass='h3'>Data</Panel.Title>
                </Panel.Heading>
            </Panel>  
        )
    }
}