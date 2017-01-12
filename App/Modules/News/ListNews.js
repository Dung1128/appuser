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
import fetchData from '../../Components/FetchData';
import * as common from '../../Config/common';
import styles from './styles';

class ListNews extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: []
		};
   }

	async _getApiNews() {
		this.setState({loading: true});
		let data = [];
		try {
			let params = {
				type: '0'
			}
			data = await fetchData('user_news', params, 'GET');
		} catch (e) {
			console.log(e);
		}
		let that = this;
      setTimeout(() => {
			that.setState({
				results: data.dataNews,
				loading: false
			});
      }, 500);

   }

	async componentWillMount() {
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
									style={{resizeMode: 'contain', flex: 1}}
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
					{this.state.loading &&
						<View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					}
					{!this.state.loading &&
						this._renderHtmlNews(this.state.results)
					}
			  </ScrollView>
			</View>
      );
   }
}

export default ListNews
