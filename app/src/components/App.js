import React, { Component } from 'react';
import '../Styles/App.css';
import Routes from './Routes';
import Links from './Nav';

export default class App extends Component {
    render(){
        return (
            <div className="App">
                <Links />
                <Routes />
            </div>
        );
    }
}