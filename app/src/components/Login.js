import React, { Component } from 'react';
import axios from 'axios';
import './Login.css';

export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user : '',
			password : ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange = (event) => {
		const { value, name } = event.target
		this.setState({
			[name] : value
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
			  		<p>Login:</p>
				</header>
			</div>
			<div className="Login-form">
				<form onSubmit = {this.handleSubmit}>
					<label>
						<input 
							type="text" 
							name="user" 
							placeholder="Username"
							value= {this.state.user}
							onChange = {this.handleChange} 
							required/>
					</label>
					<br/>
					<label>
						<input 
							type="password" 
							name="password" 
							placeholder="Password"
							value= {this.state.password}
							onChange = {this.handleChange} 
							required />
					</label>
					<br />
					<input type="submit" value="Login"/>
				</form>
			</div>
		</div>
		);
	}
}