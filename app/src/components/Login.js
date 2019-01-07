import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import './Login.css';

export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user : "",
			password : ""
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.id] : event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault()
		axios.post("/login", {
			user: this.state.user,
			password: this.state.password
		})
		.then(res => {
			if (res.data.code !== 200){
				alert(res.data.error);
			}
			else{
				this.props.history.push('/home');
			}
		}).catch(err => {
			console.log(err);
			alert('Error logging in. Please try again');
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
				<form onSubmit = {this.handleSubmit}>
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
						type="submit"
					>
					Login
					</Button>
				</form>
			</div>
		</div>
		);		
	}
}