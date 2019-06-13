import React, { Component } from 'react';

export default class PageNotFound extends Component{
    render(){
        return(
            <div>
                <h1>Error: Page not Found</h1>
                <span>Please check your url and try again.</span>
            </div>
        );
    }
}