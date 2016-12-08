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
import { Icon, Spinner, CardItem, Card } from 'native-base';
import {Actions} from 'react-native-router-flux';

import {domain, cache} from '../../Config/common';
import styles from './styles';
const heightDevice = Dimensions.get('window').height;

class DetailNews extends Component {

	constructor(props) {
		super(props);
	}

	_getApiNews() {
		this.setState({loading: true});
		var that = this;
      fetch(domain+'/api/api_user_tin_lien_quan.php?idNews='+this.props.data.idNews, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			that.setState({
				results: responseJson.dataNews,
				loading: false
			});
      })
      .catch((error) => {
         console.error(error);
      });
   }

	componentWillMount() {
		this._getApiNews();
	}

	_onPressDetailNews(id) {
		Actions.DetailNews({title: 'Chi Tiết Tin Tức', data: {idNews: id}});
	}

	_renderHtmlNews(data) {
		let html = [],
			htmlItem = [];

		for(var i = 0; i < data.length; i++) {
			var item = data[i];
			htmlItem.push(
				<CardItem key={i}>
					<TouchableOpacity onPress={this._onPressDetailNews.bind(this,item.new_id)}>
						<View>
							<Text style={{fontWeight: 'bold'}}>{item.new_title}</Text>
						</View>
					</TouchableOpacity>
				</CardItem>
			);
		}
		html.push(
			<Card key="card">
				{htmlItem}
			</Card>
		);
		return html;
	}

	onNavigationStateChange(navState) {
    	this.setState({
      	height: parseInt(navState.title)
    	});
  	}

	render() {
		return(
			<View>
				<ScrollView>
					<WebView
			        source={{uri: domain+'/api/api_user_news.php?type=1&idNews='+this.props.data.idNews+'&version=0.0.13'}}
			        style={{marginTop: 59, height: this.state.height}}
					  startInLoadingState={this.state.loading}
					  scrollEnabled={false}
					  automaticallyAdjustContentInsets={false}
					  javaScriptEnabled={true}
					  onNavigationStateChange={this.onNavigationStateChange.bind(this)}
			      />

					<View style={{padding: 10, alignItems: 'center'}}>
						<Text style={{fontWeight: 'bold'}}>Tin liên quan</Text>
					</View>
					{this.state.loading? <Text>Loading...</Text> : this._renderHtmlNews(this.state.results) }
			  </ScrollView>
			</View>
		);
	}
}

export default DetailNews
