import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import Axios from 'axios';

export default class Departments extends Component{
    constructor(props){
        super(props)

        this.onCreateOption = this.onCreateOption.bind(this)
        this.refresh = this.refresh.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)

        this.state={
            options: [],
            value: [],
            inputValue: ''
        }
    }

    componentDidMount(){
        this.refresh();
    }

    refresh(){
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

    handleChange(value, actionMeta){
        this.setState({value})
    }

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };

    onCreateOption(option){
        Axios.post('/departments', {
            value: option,
            label: option
        })
        .then(res => {
            if (res.status >= 400){
                alert(res.data.error)
            }
            else{
                this.refresh();
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
                inputValue={this.state.inputValue}
                options={this.state.options} 
                onInputChange={this.handleInputChange}
                onChange={this.handleChange}
                onCreateOption={this.onCreateOption}
                value={this.state.value}
            >
            </CreatableSelect>
        );
    }
}