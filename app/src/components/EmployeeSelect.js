import React, { Component } from 'react';
import Select from 'react-select';
import Axios from 'axios';

export default class EmployeeSelect extends Component{
    constructor(props){
        super(props);

        this.state={
            options: [],  
        }
    }

    componentDidMount(){
        Axios.get('/employees')
        .then(res => {
            if (res.status === 200){
                this.setState({
                    options: res.data.map(emp => 
                        ({value: emp.emp_id, label: emp.first_name+' '+emp.last_name}))
                })
            }
            else{
                alert(res.data.error)
            }
        })
        .catch(err => {
            alert(err)
            console.log(err)
        })
    }

    render(){
        return(
            <Select
                isClearable
                menuPlacement='auto'
                onChange={this.props.onChange}
                value={this.props.value}
                options={this.state.options}
            >
            </Select>
        );
    }
}