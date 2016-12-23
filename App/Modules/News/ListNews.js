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
  Image
} from 'react-native';
import { Icon, Spinner, CardItem, Card } from 'native-base';
import {Actions} from 'react-native-router-flux';

import {domain, cache} from '../../Config/common';
import styles from './styles';

class ListNews extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: []
		};
   }

	_getApiNews() {
		this.setState({loading: true});
		var that = this;
		console.log(domain+'/api/api_user_news.php?type=0');
      fetch(domain+'/api/api_user_news.php?type=0', {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			console.log(responseJson);
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
						<View style={{flexDirection: 'row'}}>
							<View style={{flex: 1, marginRight: 5}}>
								<Image
									square
									style={{resizeMode: 'contain', height: 50}}
									source={{uri: item.new_avatar}}
								/>
							</View>
							<View style={{flex: 4}}>
								<Text style={{fontWeight: 'bold'}}>{item.new_title}</Text>
								<Text>{item.new_intro}</Text>
							</View>
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

   render() {
      return(
			<View style={styles.container}>
				<ScrollView>
					{this.state.loading? <Text>Loading...</Text> : this._renderHtmlNews(this.state.results) }
			  </ScrollView>
			</View>
      );
   }
}

export default ListNews
