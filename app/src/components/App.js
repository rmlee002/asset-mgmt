import React, { Component } from 'react';
import '../Styles/App.css';
import Routes from './Routes';
import Links from './Nav';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


export default class App extends Component {
    render(){
        return (
            <div className="App">
            <Links />
                <div className="Container">                    
                    <Routes />
                </div>
            </div>
        );
    }
}