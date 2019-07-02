import React, { Component } from 'react';
import moment from 'moment';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie } from 'victory';
import Select from 'react-select';
import {Col, ControlLabel, Form, FormGroup} from "react-bootstrap";
import Axios from 'axios';

export default class Data extends Component{
    constructor(props){
        super(props);
        this.state={
            year: {value: moment().year(), label: moment().year()},
            depts: [],
            filter: []
        };

        this.getBarData = this.getBarData.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getPieData = this.getPieData.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        Axios.get('/departments')
        .then(res => {
            this.setState({
                depts: res.data
            })
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data)
        });
    }

    getBarData(){
        let data = [
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
        ];

        if (this.state.filter.length !== 0) {
            this.props.data
                .filter(item =>
                    (item.contract?item.contract.replace(/\s/, '').split(',').some(dept => this.state.filter.includes(dept)):false)
                    && item.inDate != null && item.cost != null && moment(item.inDate).utc().year() === this.state.year.value)
                .map(item => data[moment(item.inDate).utc().month()].total += parseFloat(item.cost));
        }
        else{
            this.props.data
                .filter(item => item.inDate != null && item.cost != null && moment(item.inDate).utc().year() === this.state.year.value)
                .map(item => data[moment(item.inDate).utc().month()].total += parseFloat(item.cost));
        }
        return data;
    }

    getPieData(){
        let deptData = {};
        this.state.depts.map(dept => dept.value).forEach(dept => deptData[`${dept}`] = 0);

        this.props.data
            .filter(item => item.contract != null && item.inDate != null && item.cost != null
                && moment(item.inDate).utc().year() === this.state.year.value)
            .forEach(item => deptData[`${item.contract.replace(/\s/, "").split(',')[0]}`] += item.cost);

        return Object.keys(deptData).filter(key => deptData[`${key}`] !== 0).map(function(key){ return {x: key, y: deptData[`${key}`]} });
    }

    getOptions(){
        let options=[];
        this.props.data.filter(item => item.inDate != null).forEach(function(item){
            if (!options.includes(moment(item.inDate).utc().year())){
                options.push(moment(item.inDate).utc().year());
            }
        });
        return options.sort().reverse().map(function(year){ return {value:year, label:year}});
    }

    handleSelect(keys){
        this.setState({
            filter: keys.map(key => key.value)
        })
    }

    render(){
        const barData = this.getBarData();
        const pieData = this.getPieData();

        return(
            <div>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={1}>
                            Year:
                        </Col>
                        <Col sm={10}>
                            <Select
                                value={this.state.year}
                                options={this.getOptions()}
                                onChange={year => this.setState({ year })}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={1}>
                            Contract:
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

                <div style={{width: '90%', height: '700px', 'textAlign': 'center'}}>
                    <h2>{`Cost distribution for ${this.state.year.value}`}</h2>
                    {barData.some(item => item.total !== 0)?
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
                                labels={(d) => d.total !== 0 ? `$${d.total.toFixed(2)}` : null}
                                style={{ labels: { fontSize: 8 } }}
                            />
                        </VictoryChart>
                        :
                        <p>No bar graph data available</p>
                    }
                    {pieData.length !== 0?
                        <VictoryPie
                            data={pieData}
                            colorScale={["LimeGreen","DarkGreen","LightSeaGreen","Yellow"]}
                            labels={val=>`${val.x}: \n$${val.y.toFixed(2)}`}
                        />
                        :
                        <p>No pie chart data available</p>
                    }
                </div>
            </div>
        )
    }
}