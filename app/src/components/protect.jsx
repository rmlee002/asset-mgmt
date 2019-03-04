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
				this.setState({loading: false});
			}).catch(err => {
				console.log(err);
				this.setState({
					loading: false,
					redirect: true
				});
			});
		}

		render() {			
			const location = this.props.location.pathname
			const { loading, redirect } = this.state;
			let view =
					<div>
						<h1>Loading...</h1>
					</div>
					
			if (!loading){
				if (redirect) {
					view =
						<Redirect
							push 
							to={{
								pathname: "/login",
								state: { path: location }
							}}
							// to='/login'
						/>
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