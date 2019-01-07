import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default function protect(Comp) {
	return class extends Component {
		constructor() {
			super();
			this.state = {
				pass: false,
				redirect: false
			};
		}

		componentDidMount(){
			axios.get('/checkToken')
				.then(res => {
					if (res.status === 200){
						this.setState({pass: true});
					}
					else{
						const error = new Error(res.error);
						throw error;
					}
				}).catch(err => {
					console.error(err);
					this.setState({
						pass: true,
						redirect: true
					});
				});
		}

		render() {			
			const { pass, redirect } = this.state;
			let view;
			if (pass){
				if (redirect) {
					view = <Redirect to="/login" />
				}
				else{
					view = <Comp {...this.props} />
				}
			}
			return(
				<React.Fragment>
					{view}
				</React.Fragment>
			);
		}
	}
}