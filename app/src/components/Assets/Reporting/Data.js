import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { XYPlot } from 'react-vis';

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
                <Panel.Body>
                    <XYPlot height='300' width = '300'/>
                </Panel.Body>
            </Panel>  
        )
    }
}