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
		this.state = {
			webViewHeight: 0,
			loading: true
		}
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

	componentWillMount() {
		this.setState({
			loading: true
		});
		var that = this;
		setTimeout(() => {
	      fetch(domain+'/api/api_user_get_content.php?newsId='+this.props.data.idNews, {
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
		}, 1000);
	}

	onNavigationStateChange(navState) {
		this.setState({
		  webViewHeight: Number(navState.title)
		});
  	}

	render() {
		return(
			<View style={{marginTop: 60}}>
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
						  source={{html: '<html><body>'+this.state.results.new_description+'</body></html>'}}
						  injectedJavaScript={'document.title = Math.max(window.innerHeight, document.body.offsetHeight, document.documentElement.clientHeight);'}
				      />
					}

					{!this.state.loading &&
						<View style={{padding: 10, alignItems: 'center'}}>
							<Text style={{fontWeight: 'bold'}}>Tin liên quan</Text>
						</View>
					}
					{!this.state.loading && this._renderHtmlNews(this.state.results) }
			  </ScrollView>
			</View>
		);
	}
}

export default DetailNews
