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
			results: [],
			page: 1,
			total: 0
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
				page: data.page,
				total: data.total,
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

	async handlePage(page) {
		let newPage = page+1;
		let data = [];
		try {
			let params = {
				type: '0',
				page: newPage
			}
			data = await fetchData('user_news', params, 'GET');
		} catch (e) {
			console.log(e);
		}
		this.setState({
			results: data.dataNews,
			page: data.page,
			total: data.total
		});
	}

	_renderHtmlNews(data) {
		let html = [];
		let htmlItem = [];
		let totalData = Object.keys(data).length;

		if(totalData > 0) {
			for(var key in data) {
				for(var i = 0; i < data[key].length; i++) {
					var item = data[key][i];
					htmlItem.push(
						<CardItem key={i+item.new_id}>
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
			}
			if(this.state.total > 0) {
				htmlItem.push(
					<CardItem key="xemthem" style={{backgroundColor: '#ccc', padding: 0}}>
						<TouchableOpacity onPress={() => this.handlePage(this.state.page)} style={{padding: 10, flex: 5, alignItems: 'center', justifyContent: 'center'}}>
							<Text style={{fontWeight: 'bold'}}>Xem thêm</Text>
						</TouchableOpacity>
					</CardItem>
				);
			}
		}else {
			htmlItem.push(
				<CardItem key="null">
					<View style={{flex: 5, alignItems: 'center'}}>
						<Text style={{color: 'red'}}>Tin tức đang được cập nhật. Bạn vui lòng quay lại sau!</Text>
					</View>
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
