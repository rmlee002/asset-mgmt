import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import '../Styles/Login.css';

export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user : "",
			password : ""
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.id] : event.target.value
		});
	};

	handleLogin(e){
		e.preventDefault()
		axios.post("/authenticate/login", {
			user: this.state.user,
			password: this.state.password
		})
		.then(res => {
			if (this.props.location.state){
				// this.props.history.push(this.props.location.state.path)
				window.location.assign(this.props.location.state.path)
			}
			else{
				window.location.assign('/home')
			}
			// this.props.history.goBack();	
		})
		.catch(err => {
			console.log(err);
			alert(err.response.data);
		});
	};

	render() {
		return (
		<div className="Main">
			<div className="Head">
				<header className="App-header">		
					<img src="logolarge.png" className="Vid-logo" alt="logo" />
				</header>
			</div>
			<div className="Login">
				<form onSubmit = {this.handleLogin}>
					<FormGroup controlId="user" bsSize="large">
						<ControlLabel>Username</ControlLabel>
						<FormControl
							autoFocus
							type="text"
							value={this.state.user}
							onChange={this.handleChange}
							required
						/>
					</FormGroup>
					<FormGroup controlId="password" bsSize="large">
						<ControlLabel>Password</ControlLabel>
						<FormControl
							type="password"
							value = {this.state.password}
							onChange={this.handleChange}
							required
						/>
					</FormGroup>
					<Button
						block
						bsSize="large"
						type='submit'
					>
						Login
					</Button>
				</form>
			</div>
		</div>
		);		
	}
}