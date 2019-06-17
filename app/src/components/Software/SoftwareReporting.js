import React, { Component } from 'react';
import Axios from 'axios';
import moment from 'moment';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import { Tab, Row, Col, Nav, NavItem, Form, ControlLabel, FormGroup, Radio } from 'react-bootstrap';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie } from 'victory';
import Select from 'react-select';
import '../../Styles/Software.css';

export default class SoftwareReporting extends Component { 
    constructor(props){
        super(props);

        this.state = {
            data: [],
            contracts: [],
            contract: [],
            yearly: false,
            year: {value: moment().year(), label: moment().year()},
            month: {value: moment().month(), label: moment().month(moment().month().toString(),'MM').format('MMMM')}
        };

        this.handleChange = this.handleChange.bind(this);
        SoftwareReporting.getYears = SoftwareReporting.getYears.bind(this);
        this.handleYear = this.handleYear.bind(this);
        this.handleMonth = this.handleMonth.bind(this);
        this.getTotalHighest = this.getTotalHighest.bind(this);
        this.getBarData = this.getBarData.bind(this);
        this.getPieData = this.getPieData.bind(this);
        this.getYearlyCost = this.getYearlyCost.bind(this);
        this.getMonthlyCost = this.getMonthlyCost.bind(this);
        this.getCurrent = this.getCurrent.bind(this);
    }

    componentDidMount(){
        Axios.get('/software/reporting')
        .then(res => {
            this.setState({
                data: res.data
            })
        })
        .catch(err => {
            console.log(err);
            alert(err);
        });

        Axios.get('/departments')
        .then(res => {
            this.setState({
                contracts: res.data
            })
        })
        .catch(err => {
            console.log(err);
            alert(err);
        })
    }

    getTotalHighest(values, rows){
        let total = 0;
        const curr = moment().date() === 31 ? 30 : moment().date();

        values.forEach((cost, index) => {
            if (moment(rows[index].start).isBefore(moment(), 'month')){
                total += cost;
            }
            else{
                let day = moment(rows[index].start).date()===31? 30 : moment(rows[index].start).date();
                total += (((curr-day)+1)/30)*cost;
            }
        });

        return total
    }

    handleChange(e){
        if (e.target.value==="monthly"){
            this.setState({
                yearly: false
            })
        }
        else{
            this.setState({
                yearly: true
            })
        }        
    }

    handleYear(year){
        this.setState({
            year: year
        })
    }

    handleMonth(month){
        this.setState({
            month: month
        })
    }

    static getYears(){
        let index = 0;
        let years = [];
        for (let i = moment().year(); i >= 2012; i--){
            years[index] = {value: i, label: i.toString()};
            index++;
        }
        return years;
    }

    getYearlyCost(value){
        const cost = value.cost;
        const curr = moment().date() === 31 ? 30 : moment().date();

        let start = moment(value.start).date() === 31? 30 : moment(value.start).date();
        if (moment(value.end) != null && moment(value.end).year() === this.state.year.value){
            let end = moment(value.end).date()===31 ? 30 : moment(value.end).date();
            if (moment(value.start).year() < this.state.year.value){
                return cost * moment(value.end).month() + (end/30 * cost);
            }
            else{
                if (moment(value.start).month() === moment(value.end).month()){
                    return (((end-start)+1)/30)*cost;
                }
                else {
                    return (((30-start)+1)/30)*cost + (moment(value.end).month()-moment(value.start).month()-1)*cost + (end/30)*cost
                }
            }
        }
        else{
            if (moment(value.start).year() < this.state.year.value){
                return moment().month()*value.cost + (curr/30)*value.cost;
            }
            else{
                if (moment().year() === this.state.year.value) {
                    return (((30-start)+1)/30)*cost + (moment().month()-moment(value.start).month()-1)*cost + (curr/30)*cost
                }
                else{
                    return (((30-start)+1)/30)*cost + (11-moment(value.start).month())*cost
                }
            }
        }
    }

    getMonthlyCost(value){
        const cost = value.cost;
        const curr = moment().date() === 31 ? 30 : moment().date();

        if (moment(value.start).isBefore(`${this.state.year.value}-${this.state.month.value + 1}-01`,'month')){
            if (value.end == null || moment(value.end).isAfter(`${this.state.year.value}-${this.state.month.value + 1}-01`, 'month')){
                if (this.state.year.value === moment().year() && moment().month() === this.state.month.value){
                    return (curr/30)*cost;
                }
                return cost;
            }
            else{
                let end = moment(value.end).date() === 31 ? 30 : moment(value.end).date();
                return (end/30) * cost;
            }
        }
        else{
            let start = moment(value.start).date() === 31 ? 30 : moment(value.start).date();
            if (value.end == null ||  moment(value.end).isAfter(`${this.state.year.value}-${this.state.month.value + 1}-01`, 'month')){
                if (moment(value.start).month() === moment().month()){
                    return (((curr-start)+1)/30)*cost;
                }
                return ((30-start) + 1)/30 * cost;
            }
            else{
                let end = moment(value.end).date() === 31 ? 30 : moment(value.end).date();
                return ((end-start)+1)/30 * cost;
            }
        }
    }

    getCurrent(value){
        const start = moment(value.start).date() === 31 ? 30 : moment(value.start).date();
        const firstMonth = (((30-start)+1)/30)*value.cost;
        const end = moment().date() === 31? 30: moment().date();
        const curr = (end/30)*value.cost;

        const yearsBetween = moment().year()-moment(value.start).year()-1;

        //Started this year
        if (yearsBetween < 0){
            const monthsBetween = moment().month() - moment(value.start).month();
            if (monthsBetween === 0){
                return (((end-start)+1)/30)*value.cost;
            }
            return firstMonth + (monthsBetween-1)*value.cost + curr;
        }
        //Started before this year
        else{
            return firstMonth + (11-moment(value.start).month())*value.cost + (yearsBetween*12*value.cost) + moment().month()*value.cost + curr;
        }
    }

    getTotal(values){
        let total = 0;
        values.forEach(num => total += num);
        return total;
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

        const curr = moment().date() === 31 ? 30 : moment().date();

        this.state.data
            .filter(item => moment(item.start).year() <= this.state.year.value
                && (item.end == null || moment(item.end).year() >= this.state.year.value)
                && (this.state.contract.length === 0 || item.department.split(', ')
                    .some(dept => this.state.contract.map(val => val.value).includes(dept)))
            )
            .forEach(item => {
                const start = moment(item.start).date()===31?30:moment(item.start).date();
                if(item.end == null || moment(item.end).year() > this.state.year.value){
                    if (moment(item.start).year() < this.state.year.value){
                        if (this.state.year.value === moment().year()){
                            for (let i = 0; i < moment().month(); i++){
                                data[i].total += item.cost;
                            }
                            data[moment().month()].total += (curr/30) * item.cost;
                        }
                        else{
                            for (let i = 0; i < 12; i++){
                                data[i].total += item.cost;
                            }
                        }
                    }
                    else{
                        if (this.state.year.value === moment().year()){
                            if (moment(item.start).month() === moment().month()){
                                data[moment().month()].total += (((curr-start)+1)/30)*item.cost
                            }
                            else{
                                data[moment(item.start).month()].total += (((30-start)+1)/30)*item.cost;
                                for (let i = moment(item.start).month()+1; i < moment().month(); i++){
                                    data[i].total += item.cost;
                                }
                                data[moment().month()].total += (curr/30)*item.cost;
                            }
                        }
                        else{
                            for (let i = moment(item.start).month()+1; i < 12; i++){
                                data[i].total += item.cost;
                            }
                            data[moment(item.start).month()].total += (((30-start)+1)/30) * item.cost;
                        }
                    }
                }
                else{
                    const end = moment(item.end).date()===31?30:moment(item.end).date();
                    if (moment(item.start).year() < this.state.year.value){
                        data[moment(item.end).month()].total += (end/30)*item.cost;
                        for (let i = moment(item.end).month()-1; i >= 0; i--){
                            data[i].total += item.cost;
                        }
                    }
                    else{
                        if (moment(item.start).month() === moment(item.end).month()){
                            data[moment(item.start).month()].total += (((end-start)+1)/30) * item.cost;
                        }
                        else{
                            data[moment(item.start).month()].total += (((30-start)+1)/30) * item.cost;
                            for (let i = moment(item.start).month()+1; i < moment(item.end).month(); i++){
                                data[i].total += item.cost;
                            }
                            data[moment(item.end).month()].total += (end/30) * item.cost;
                        }
                    }
                }
            });

        return data;
    }

    getPieData(){
        let deptData = {};
        this.state.contracts.forEach(dept => deptData[`${dept.value}`] = 0);
        let self = this;
        const curr = moment().date() === 31 ? 30 : moment().date();
        self.state.data
            .filter(item => moment(item.start).year() <= self.state.year.value
                && (item.end == null || moment(item.end).year() >= self.state.year.value))
            .forEach(function(item){
                const cost = item.cost;
                if (item.end != null && moment(item.end).year() === self.state.year.value){
                    const end = moment(item.end).date() === 31 ? 30 : moment(item.end).date();
                    if (moment(item.start).year() < self.state.year.value) {
                        deptData[`${item.department.split(', ')[0]}`] += (end / 30) * cost + (moment(item.end).month()) * cost
                    }
                    else{
                        const start = moment(item.start).date() === 31 ? 30 : moment(item.start).date();
                        if (moment(item.start).month() === moment(item.end).month()){
                            deptData[`${item.department.split(', ')[0]}`] += (((end-start)+1)/30)*cost
                        }
                        else {
                            deptData[`${item.department.split(', ')[0]}`] += (((30 - start) + 1) / 30) * cost + (moment(item.end).month() - (moment(item.start).month() + 1)) * cost + (end / 30) * cost
                        }
                    }
                }
                else{
                    if (moment(item.start).year() < self.state.year.value){
                        deptData[`${item.department.split(', ')[0]}`] += moment().month()*cost + (curr/30)*cost
                    }
                    else{
                        const start = moment(item.start).date() === 31 ? 30 : moment(item.start).date();
                        if (self.state.year.value === moment().year()){
                            if (moment(item.start).month() === moment().month()){
                                deptData[`${item.department.split(', ')[0]}`] += (((curr-start)+1)/30)*cost
                            }
                            else{
                                deptData[`${item.department.split(', ')[0]}`] += (((30-start)+1)/30)*cost + (moment().month()-(moment(item.start).month()+1))*cost + (curr/30)*cost
                            }
                        }
                        else{
                            deptData[`${item.department.split(', ')[0]}`] += (((30-start)+1)/30)*cost + (11-moment(item.start).month())*cost
                        }
                    }
                }
            });

        return Object.keys(deptData).filter(key => deptData[`${key}`] !== 0).map(function(key){ return { x: key, y: deptData[`${key}`] } });
    }

    render(){
        const columns1 = [
            {
                Header: "Name",
                accessor: 'name',
                Aggregated: row => null
            },
            {
                Header: "Contract",
                accessor: "department",
                Aggregated: row => null
            },
            {
                Header: "Software",
                accessor: "software",
                Aggregated: row => null
            },
            {
                id: 'totalCost',
                Header: !this.state.yearly?`Cost in ${this.state.month.label} ${this.state.year.value}`:`Cost in ${this.state.year.value}`,
                accessor: val => this.state.yearly? this.getYearlyCost(val) : this.getMonthlyCost(val),
                Cell: val => `$${val.value.toFixed(2)}`,
                aggregate: (values,rows) => this.getTotal(values),
                Aggregated: row => {return <h5>${row.value.toFixed(2)}</h5>}
            },
            {
                Header:"Subscription Fee",
                accessor: "cost",
                Cell: val => `$${val.value.toFixed(2)}`,
                Aggregated: row => null
            },
            {
                Header: "Start Date",
                accessor: "start",
                Cell: val => moment(val.value).format('YYYY-MM-DD'),
                Aggregated: row => null
            },
            {
                Header: "End Date",
                accessor: "end",
                Cell: val => val.value != null ? moment(val.value).format('YYYY-MM-DD') : null,
                Aggregated: row => null
            }
        ];

        const columns2 = [
            {
                Header: "Name",
                accessor: 'name',
                Aggregated: row => null
            },
            {
                Header: "Contract",
                accessor: "department",
                Aggregated: row => null
            },
            {
                Header: "Software",
                accessor: "software",
                Aggregated: row => null
            },
            {
                Header: 'Monthly Cost',
                accessor: 'cost',
                Cell: val => `$${val.value}`,
                Aggregated: row => null
            },
            {
                id: 'totalCost',
                Header: 'Total Cost',
                accessor: val => this.getCurrent(val),
                Cell: val => `$${val.value.toFixed(2)}`,
                aggregate: (values,rows) => this.getTotal(values),
                Aggregated: row => {return <h5>${row.value.toFixed(2)}</h5>}
            },
            {
                Header: "Start Date",
                accessor: "start",
                Cell: val => moment(val.value).format('YYYY-MM-DD'),
                Aggregated: row => null
            }
        ];

        const columns3 = [
            {
                Header: "Name",
                accessor: 'name'
            },
            {
                Header: "Contract",
                accessor: "department"
            },
            {
                Header: "Software",
                accessor: "software",
                Aggregated: row => null
            },
            {
                Header: "Monthly Cost",
                accessor: "cost",
                Cell: val => `$${val.value}`,
                Aggregated: row => null
            },
            {
                Header: "Start Date",
                accessor: "start",
                Cell: val => moment(val.value).format('YYYY-MM-DD'),
                Aggregated: row => null
            }
        ];

        let data = [];

        if (this.state.yearly){
            data = this.state.data.filter(item =>
                moment(item.start).year() <= this.state.year.value && (item.end == null || moment(item.end).year() >= this.state.year.value ))
        }
        else{
            data = this.state.data.filter(item =>
                moment(item.start).isSameOrBefore(`${this.state.year.value}-${this.state.month.value + 1}-01`, 'month')
                &&
                (item.end == null || moment(item.end).isSameOrAfter(`${this.state.year.value}-${this.state.month.value + 1}-01`, 'month'))
            )
        }

        return(
            <React.Fragment>
                <Tab.Container defaultActiveKey="data">
                    <Row>
                        <Col sm={2} style={{position:'fixed'}}>
                            <Nav bsStyle="pills" stacked>
                                <NavItem eventKey="data">Data</NavItem>
                                <NavItem eventKey="highest">Top 10 highest total costs</NavItem>
                                <NavItem eventKey="longest">Longest license holders</NavItem>
                            </Nav>
                        </Col>
                        <Col sm={10} id='tab-content'>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="data">
                                    <Form horizontal>
                                        <FormGroup>
                                            <Col componentClass={ControlLabel} sm={1}>
                                                Group by:
                                            </Col>
                                            <Col sm={3}>
                                                <Radio
                                                    name="radioGroup"
                                                    inline
                                                    value="monthly"
                                                    checked={!this.state.yearly}
                                                    onChange={this.handleChange}
                                                >
                                                    Monthly
                                                </Radio>{' '}
                                                <Radio
                                                    name="radioGroup"
                                                    inline
                                                    value="yearly"
                                                    checked={this.state.yearly}
                                                    onChange={this.handleChange}
                                                >
                                                    Yearly
                                                </Radio>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup>
                                            <Col componentClass={ControlLabel} sm={1}>
                                                Year:
                                            </Col>
                                            <Col sm={3}>
                                                <Select
                                                    value={this.state.year}
                                                    options={SoftwareReporting.getYears()}
                                                    onChange={this.handleYear}
                                                />
                                            </Col>
                                        </FormGroup>
                                        {!this.state.yearly && <FormGroup>
                                            <Col componentClass={ControlLabel} sm={1}>
                                                Month:
                                            </Col>
                                            <Col sm={3}>
                                                <Select
                                                    value={this.state.month}
                                                    options={[
                                                        {value: 0, label:"January"},
                                                        {value: 1, label:"February"},
                                                        {value: 2, label:"March"},
                                                        {value: 3, label:"April"},
                                                        {value: 4, label:"May"},
                                                        {value: 5, label:"June"},
                                                        {value: 6, label:"July"},
                                                        {value: 7, label:"August"},
                                                        {value: 8, label:"September"},
                                                        {value: 9, label:"October"},
                                                        {value: 10, label:"November"},
                                                        {value: 11, label:"December"},
                                                    ]}
                                                    onChange={this.handleMonth}
                                                />
                                            </Col>
                                        </FormGroup>}
                                    </Form>

                                    <ReactTable
                                        data={data}
                                        pivotBy={["department","name"]}
                                        columns={columns1}
                                        className="-striped -highlight"
                                    />
                                    <Form>
                                        <FormGroup>
                                            <Col componentClass={ControlLabel} sm={1}>
                                                Contract:
                                            </Col>
                                            <Col sm={5}>
                                                <Select
                                                    isMulti
                                                    options={this.state.contracts}
                                                    value={this.state.contract}
                                                    onChange={contract => this.setState({contract})}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Form>

                                    <div className="graphics">
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
                                                data={this.getBarData()}
                                                x="month"
                                                y="total"
                                                labels={(d) => d.total===0?null:`$${d.total.toFixed(2)}`}
                                                style={{ labels: { fontSize: 6 } }}
                                            />
                                        </VictoryChart>
                                        <VictoryPie
                                            data={this.getPieData()}
                                            colorScale={["LimeGreen","DarkGreen","LightSeaGreen","Yellow"]}
                                            labels={val=>`${val.x}: \n$${val.y.toFixed(2)}`}
                                        />
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="highest">
                                    <ReactTable
                                        data={this.state.data.filter(item => !item.end)}
                                        pivotBy={["name"]}
                                        columns={columns2}
                                        defaultSorted={[
                                            {
                                                id: 'totalCost',
                                                desc: true
                                            }
                                        ]}
                                        className="-striped -highlight"
                                        defaultPageSize={10}
                                        showPagination={false}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="longest">
                                    <ReactTable
                                        data={
                                            this.state.data.filter(item =>
                                                item.end == null && moment(item.start).isSameOrBefore(moment().subtract(1, 'years')))
                                        }
                                        pivotBy={["software"]}
                                        columns={columns3}
                                        className="-striped -highlight"
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>               
            </React.Fragment>
        )
    }
}