import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Axios from 'axios';


const getSuggestionValue = suggestion => suggestion.first_name+' '+suggestion.last_name

const renderSuggestion = suggestion => (
    <div>
      {suggestion.first_name+' '+suggestion.last_name}
    </div>
);

export default class EditOwner extends Component{

    constructor(props){
        super(props)

        this.getSuggestions = this.getSuggestions.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)

        this.state = {
            value: '',
            employees: [],
            filtered: []
        }
    }

    componentDidMount(){
        Axios.get('/employees')
        .then(res => {
            if (res.status >= 400){
                alert(res.statusText);
            }
            this.setState({
                employees: res.data
            })
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    getSuggestions(value){
        const input = value.trim().toLowerCase();
        const length = input.length;
        return length === 0 ? [] : this.state.employees.filter(employee => 
            (employee.first_name+' '+employee.last_name).toLowerCase().slice(0, length) === input
        );
    }       
   
    onChange = (event, { newValue, method }) => {
        this.setState({
          value: newValue
        });

        if(newValue === ''){
            this.props.handleOwnerNull();
        }
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            filtered: this.getSuggestions(value)
        })
    }

    onSuggestionsClearRequested() {
        this.setState({
            filtered: []
        });
    }

    render(){
        const {value, employees, filtered} = this.state
        const inputProps = {
            placeholder: 'Type a name',
            value,
            onChange: this.onChange,
            onBlur: this.props.onBlur
        }
        return(
            <Autosuggest
                suggestions={filtered}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.props.handleOwner}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}