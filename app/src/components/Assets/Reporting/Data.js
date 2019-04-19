import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';
import '../../../../node_modules/react-vis/dist/style.css';
import moment from 'moment';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryPie } from 'victory';
import Select from 'react-select';


export default class Data extends Component{
    constructor(props){
        super(props)
        this.state={
            year: {value: moment().year(), label: moment().year()}
        }

        this.getBarData = this.getBarData.bind(this)
        this.getOptions = this.getOptions.bind(this)
        this.getPieData = this.getPieData.bind(this)
    }

    getBarData(){
        var data = [
            {month: 1, total: 0},
            {month: 2, total: 0},
            {month: 3, total: 0},
            {month: 4, total: 0},
            {month: 5, total: 0},
            {month: 6, total: 0},
            {month: 7, total: 0},
            {month: 8, total: 0},
            {month: 9, total: 0},
            {month: 10, total: 0},
            {month: 11, total: 0},
            {month: 12, total: 0}
        ]

        this.props.data.filter(item => item.inDate != null && item.cost != null && moment(item.inDate).year() === this.state.year.value)
            .map(item => data[moment(item.inDate).month()].total += parseFloat(item.cost))
            
        return data;
    }

    getPieData(){
        var deptData = {}
        this.props.depts.forEach(dept => deptData[`${dept}`] = 0)
        this.props.data.filter(item => item.contract != null && item.inDate != null && item.cost != null && moment(item.inDate).year() === this.state.year.value)
            .forEach(item => item.contract.replace(/\s/, "").split(',').forEach(dept => deptData[`${dept}`] += parseFloat(item.cost)))

        return Object.keys(deptData).filter(key => deptData[`${key}`] !== 0).map(function(key){ return { x: key, y: deptData[`${key}`] } })
    }

    getOptions(){
        var options=[]
        this.props.data.filter(item => item.inDate != null).forEach(function(item){
            if (!options.includes(moment(item.inDate).year())){
                options.push(moment(item.inDate).year())
            }
        })
        return options.sort().reverse().map(function(year){ return {value:year, label:year}});
    }

    render(){
        const barData = this.getBarData();
        const pieData = this.getPieData();

        return(
          
            <Panel bsStyle='info'>
                <Panel.Heading>
                    <Panel.Title componentClass='h3'>Data</Panel.Title>
                </Panel.Heading>
                <Panel.Body> 
                    <VictoryPie
                        data={pieData}
                        colorScale={["LimeGreen","DarkGreen","LightSeaGreen","Yellow"]}
                        labels={val=>`${val.x}: $${val.y.toFixed(2)}`}
                        // labelComponent={<VictoryTooltip/>}
                    />
                    <Select
                        value={this.state.year}
                        options={this.getOptions()}
                        onChange={year => this.setState({ year })}
                    />
                    <VictoryChart 
                        domainPadding={10} 
                        theme={VictoryTheme.material}
                        width={400}
                        height={300}
                    >
                        <VictoryAxis
                            tickValues={[1,2,3,4,5,6,7,8,9,10,11,12]}
                            tickFormat={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickFormat={x => `$${x}`}
                        />
                        <VictoryBar
                            data={barData}
                            x="month"
                            y="total"
                            labels={(d) => `$${d.total.toFixed(2)}`}
                            labelComponent={<VictoryTooltip/>}
                        />
                    </VictoryChart>    
                    
                    <Table>
                        <thead>
                            <tr>
                                <th>Contract</th>
                                <th>Month</th>
                                <th>Spending</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.filter(item => moment(item.inDate).year() === this.state.year.value).map(item => 
                                <tr>
                                    <td>{item.contract}</td>
                                    <td>{moment(item.inDate).format('YYYY-MM-DD')}</td>
                                    <td>{item.cost}</td>
                                </tr>
                                )}
                        </tbody>
                    </Table>                
                </Panel.Body>
            </Panel>  
        )
    }
}