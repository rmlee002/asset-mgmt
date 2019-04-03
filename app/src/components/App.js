import React, { Component } from 'react';
import '../Styles/App.css';
import Routes from './Routes';
import Links from './Nav';
import { faUserPlus, faLaptopMedical, faTrash, faHistory, faEdit, faDesktop, faUsers, faCheck,
    faArchive, faUndo, faSort, faFilter, faSortUp, faSortDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faUserPlus, faLaptopMedical, faTrash, faHistory, faEdit, faDesktop, faUsers, faCheck, 
    faArchive, faUndo, faSort, faFilter, faSortUp, faSortDown, faPlus)

export default class App extends Component {
    render(){
        return (
            <div className="App">
                <div className="Header">
                    <Links />
                </div>
                <div className="Container">                    
                    <Routes />
                </div>
            </div>
        );
    }
}