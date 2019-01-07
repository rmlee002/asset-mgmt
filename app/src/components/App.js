import React, { Component } from 'react';
import {Route, Switch, Redirect, Link} from 'react-router-dom';
import '../Styles/App.css';
import protect from './protect';
import Login from './Login';
import Home from './Home';
import Routes from './Routes';

export default class App extends Component {

    render(){
        return (
            <div className="App">
                <Routes />
            </div>
        );
    }
}