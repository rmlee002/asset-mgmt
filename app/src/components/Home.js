import React, { Component } from 'react';
import Links from './Nav';

export default class Home extends Component{
	render(){
		return (	
			<div>
				<Links />
				<h1>Home</h1>
			</div>
		);
	}
}