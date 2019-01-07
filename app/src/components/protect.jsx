import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default function protect(Comp) {
	return class extends Component {
		constructor() {
			super();
			this.state = {
				loading: true,
				redirect: false
			};
		}

		componentDidMount(){
			axios.get('/checkToken')
				.then(res => {
					if (res.status === 200){
						this.setState({loading: false});
					}
					else{
						const error = new Error(res.error);
						throw error;
					}
				}).catch(err => {
					console.error(err);
					this.setState({
						loading: false,
						redirect: true
					});
				});
		}

		render() {			
			const { loading, redirect } = this.state;
			let view = <h1>Loading...</h1>;
			if (!loading){
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