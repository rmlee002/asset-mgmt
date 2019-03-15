import React, { Component } from 'react';
import { Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Axios from 'axios';
import memoize from 'memoize-one';
import moment from 'moment';
import ManageModal from '../ManageModal';

export default class AddAsset extends Component{
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleResize = this.handleResize.bind(this);

        this.state = {
            show: false,
            asset: null,
            assets: [],
            filtered: [],
            start: new Date(),
            theight: document.documentElement.clientHeight - 230
        }
    }

    componentDidMount(){
        Axios.get('/history/employee/add', {
            emp_id: this.props.match.params.emp_id
        })
        .then(res => {
            this.setState({
                assets: res.data,
                filtered: res.data
            })
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err)
        })

        window.addEventListener('resize', this.handleResize)
    }

    filter = memoize(
        (list, filterText) => list.filter(item => (item.serial_number).toLowerCase().includes(filterText.toLowerCase()))
    )

    handleChange(e){
        if (e.target.value !== ''){
            this.setState({
                filtered: this.filter(this.state.assets, e.target.value)
            })
        }
        else{
            this.setState({
                filtered: this.state.assets
            })
        }        
    }   

    handleResize(){
        const h = document.documentElement.clientHeight - 230
        this.setState({
            theight: h
        })
    }

    handleSubmit(e){
        e.preventDefault();
        Axios.post('/history/add', {
            asset_id: this.state.asset_id,
            emp_id: this.props.match.params.emp_id,
            start: this.state.start?moment(this.state.start).format('YYYY-MM-DD'):null
        })
        .then(res => {
            this.props.history.push(`/employees/${this.props.match.params.emp_id}/assets`)
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data)
        })
    }

    handleStart(date){
        this.setState({
            start: date
        })
    }
    
    render(){
        return(
            <React.Fragment>
                <FormGroup controlid="search">
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        type='text'
                        placeholder='Enter serial number'
                        onChange = {this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <div className='data' id='addAsset'>                
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Model</th>                            
                                <th>Comment</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody style={{height: this.state.theight}}>
                            {this.state.filtered.map(item =>                             
                                <tr>
                                    <td>{item.serial_number}</td>
                                    <td>{item.model}</td>                                
                                    <td>{item.comment}</td>                          
                                    <td>
                                        <ManageModal
                                            type='Assign'
                                            title='Add asset'
                                            date={this.state.start}
                                            handleClick={()=>this.setState({ asset_id: item.asset_id })}
                                            handleSubmit={this.handleSubmit}
                                            handleDate={this.handleStart}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}