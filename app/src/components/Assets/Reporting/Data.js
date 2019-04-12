import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import '../../../../node_modules/react-vis/dist/style.css';
import {
    XYPlot,
    LineSeries,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines
  } from 'react-vis';
  import moment from 'moment';

export default class Data extends Component{
    constructor(props){
        super(props)
        this.state={
            year: moment().year()
        }

        this.getData = this.getData.bind(this)
    }

    getData(){
        var data = new Array(12).fill(0)

        this.props.data.filter(item => moment(item.start).year() === this.state.year)
            .map(item => data[moment(item.start).month()] += parseFloat(item.cost))
            
        return data;
    }

    render(){
        const data = [
            {x: 0, y: 8},
            {x: 1, y: 5},
            {x: 2, y: 4},
            {x: 3, y: 9},
            {x: 4, y: 1},
            {x: 5, y: 7},
            {x: 6, y: 6},
            {x: 7, y: 3},
            {x: 8, y: 2},
            {x: 9, y: 0}
          ];

        return(
            <Panel bsStyle='info'>
                <Panel.Heading>
                    <Panel.Title componentClass='h3'>Data</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <XYPlot height={300} width= {300}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />
                        <LineSeries data={data} />
                    </XYPlot>
                </Panel.Body>
            </Panel>  
        )
    }
}