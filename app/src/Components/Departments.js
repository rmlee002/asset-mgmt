import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import Axios from 'axios';

export default class Departments extends Component{
    constructor(props){
        super(props)

        this.onCreateOption = this.onCreateOption.bind(this)

        this.state={
            options: []
        }
    }

    componentDidMount(){
        Axios.get('/departments')
        .then(res => {
            this.setState({
                options: res.data
            })
        })
        .catch(err => {
            alert(err.response.data)
        })
    }

    onCreateOption(option){
        const options = this.state.options
        Axios.post('/departments', {
            value: option,
            label: option
        })
        .then(res => {
            this.setState({
                options: [...options, {value: option, label: option}]
            });
            this.props.createDept(option)
        })
        .catch(err => {
            alert(err.response.data)
            console.log(err)
        })
    }

    render(){
        return(
            <CreatableSelect 
                isClearable 
                isMulti 
                options={this.state.options} 
                onChange={this.props.handleChange}
                onCreateOption={this.onCreateOption}
                value={this.props.depts}
            >
            </CreatableSelect>
        );
    }
}