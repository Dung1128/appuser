import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  WebView
} from 'react-native';
import {domain, cache} from '../../Config/common';
import fetchData from '../../Components/FetchData';
import { InputGroup, Icon, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';

class Contact extends Component {

	constructor(props) {
		super(props);
		this.state = {
			webViewHeight: 0,
			loading: true
		}
	}

	async componentWillMount() {
		this.setState({
			loading: true
		});
		let data = [];
		try {
			let params = {
				type: 'contact'
			}
			data = await fetchData('user_get_content', params, 'GET');
		} catch (e) {
			console.log(e);
			this.setState({
				loading: false
			});
		}
		var that = this;

		setTimeout(() => {
			that.setState({
				results: data.data,
				loading: false
			});
		}, 500);
	}

	onNavigationStateChange(navState) {
		this.setState({
		  webViewHeight: Number(navState.title)
		});
  	}

	render() {
		return(
			<View style={{paddingTop: 60}}>
				<ScrollView>
					{this.state.loading &&
						<View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					}
					{!this.state.loading &&
						<WebView
						  automaticallyAdjustContentInsets={false}
						  javaScriptEnabled={true}
						  domStorageEnabled={true}
						  scrollEnabled={false}
						  startInLoadingState={true}
						  onNavigationStateChange={this.onNavigationStateChange.bind(this)}
						  style={{height: this.state.webViewHeight}}
						  source={{html: '<html><body>'+this.state.results+'</body></html>'}}
						  injectedJavaScript={'document.title = Math.max(window.innerHeight, document.body.offsetHeight, document.documentElement.clientHeight);'}
				      />
					}
				</ScrollView>
			</View>
		);
	}
}

export default Contact
