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

	componentWillMount() {
		this.setState({
			loading: true
		});
		var that = this;

      fetch(domain+'/api/api_user_get_content.php?type=contact', {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			that.setState({
				results: responseJson.data,
				loading: false
			});
      })
      .catch((error) => {
         console.error(error);
      });
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
					{this.state.loading && <Text style={{color: '#000'}}>Loading...</Text>}
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
