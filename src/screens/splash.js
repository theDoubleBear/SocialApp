import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import {
	View
} from 'react-native';
import { connect } from "react-redux";
import { NavigationActions } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay';

import { firebaseApp } from '../firebase'
import { getFullName } from '../actions'

const resetLogin = NavigationActions.reset({
	index: 0,
	actions: [
	  NavigationActions.navigate({ routeName: 'login'})
	]
})

const resetHome = NavigationActions.reset({
	index: 0,
	actions: [
	  NavigationActions.navigate({ routeName: 'home'})
	]
})
class Splash extends Component {
	
	constructor(props) {
	super(props);
		this.state = {
			isLoading: true,	
		}
	}

	static navigationOptions = {
		header: null
	};

	componentDidMount() {
		firebaseApp.auth().onAuthStateChanged((user) => {
			if (user) {
				var userId = firebaseApp.auth().currentUser.uid;
				firebaseApp.database().ref('/users/').child(userId).child('FullName').once('value')
				.then((snapshot) => {
					this.setState({
						isLoading: false,
					})
					this.props.dispatch(getFullName(snapshot.val()));
					this.props.navigation.dispatch(resetHome);
				})
				.catch((error) => {
					this.setState({
						isLoading: false,
					})
					console.log(error);
				})
			} else {
				this.setState({
					isLoading: false,
				})
        		this.props.navigation.dispatch(resetLogin);
			}
		});
	}

	render() {
		return (
			<View>
				<Spinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
			</View>
		);
	}
}

export default connect()(Splash)