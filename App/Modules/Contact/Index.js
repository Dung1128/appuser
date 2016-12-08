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
import {domain} from '../../Config/common';
import { InputGroup, Icon, Input, Button, Spinner, Card, CardItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';

class Contact extends Component {

	render() {
		return(
			<WebView
	        source={{uri: domain+'/api/api_user_lien__he.php'}}
	        style={{marginTop: 60}}
	      />
		);
	}
}

export default Contact
