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
import { Actions } from 'react-native-router-flux';
import fetchData from '../../Components/FetchData';
import styles from './styles';
const heightDevice = Dimensions.get('window').height;

class DetailNews extends Component {

	constructor(props) {
		super(props);
		this.state = {
			webViewHeight: 0,
			loading: true,
			results: [],
			resultsLq: []
		}
	}

	async _getApiNews() {
		this.setState({ loading: true });
		let data = [];
		try {
			let params = {
				idNews: this.props.data.idNews
			}
			data = await fetchData('user_tin_lien_quan', params, 'GET');
			this.setState({
				resultsLq: data.dataNews
			});
		} catch (e) {
			console.log(e);
		}

	}

	_onPressDetailNews(id) {
		Actions.DetailNews({ title: 'Chi Tiết Tin Tức', data: { idNews: id } });
	}

	_renderHtmlNews(data) {
		let html = [],
			htmlItem = [];

		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			htmlItem.push(
				<CardItem key={i}>
					<TouchableOpacity onPress={this._onPressDetailNews.bind(this, item.new_id)}>
						<View>
							<Text style={{ fontWeight: 'bold' }}>{item.new_title}</Text>
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

	async componentWillMount() {
		this.setState({ loading: true });
		let data = [];
		try {
			let params = {
				newsId: this.props.data.idNews,
			}
			data = await fetchData('user_get_content', params, 'GET');
		} catch (e) {
			console.log(e);
		}
		this._getApiNews();
		var that = this;
		setTimeout(() => {
			that.setState({
				results: data.data,
				loading: false
			});
		}, 1000);
	}

	onNavigationStateChange(navState) {
		this.setState({
			webViewHeight: Number(navState.title)
		});
	}

	render() {
		return (
			<View style={{ marginTop: 60 }}>
				<ScrollView>
					{this.state.loading &&
						<View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					}
					{!this.state.loading &&
						<WebView
							automaticallyAdjustContentInsets={false}
							javaScriptEnabled={true}
							domStorageEnabled={true}
							scrollEnabled={false}
							startInLoadingState={true}
							onNavigationStateChange={this.onNavigationStateChange.bind(this)}
							style={{ height: this.state.webViewHeight }}
							source={{ html: '<p>' + this.state.results.new_description + '</p>' }}
							injectedJavaScript={'document.title = Math.max(window.innerHeight, document.body.offsetHeight, document.documentElement.clientHeight);'}
						/>
					}

					{!this.state.loading && this.state.resultsLq.length > 0 &&
						<View style={{ padding: 10, alignItems: 'center' }}>
							<Text style={{ fontWeight: 'bold' }}>Tin liên quan</Text>
						</View>
					}
					{!this.state.loading && this.state.resultsLq.length > 0 &&
						this._renderHtmlNews(this.state.resultsLq)
					}
				</ScrollView>
			</View>
		);
	}
}

export default DetailNews
