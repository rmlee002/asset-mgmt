import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import Axios from 'axios';

export default class Departments extends Component{
    constructor(props){
        super(props)

        this.onCreateOption = this.onCreateOption.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.state={
            options: [],
            value: [],
        }
    }

    componentDidMount(){
        Axios.get('/departments')
        .then(res => {
            if (res.status===200){  
                this.setState({
                    options: res.data
                })        
            }
            else{
                alert(res.data.error)
            }
        })
        .catch(err => {
            alert(err)
        })
    }

    handleChange(value){
        this.setState({value})
    }


    onCreateOption(option){
        const { options, value } = this.state
        Axios.post('/departments', {
            value: option,
            label: option
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.setState({
                    options: [...options, {value: option, label: option}]
                });
                this.props.createDept(option)
            }
        })
        .catch(err => {
            alert(err)
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
                value={this.props.value}
            >
            </CreatableSelect>
        );
    }
}