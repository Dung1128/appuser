import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	AsyncStorage,
	View,
	Text,
	TouchableOpacity,
	WebView,
	Dimensions,
	ScrollView
} from 'react-native';
import { Thumbnail } from 'native-base'
import { domain, cache } from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import { Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');

class UserInfo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			webViewHeight: 0,
			infoAdm: [],
			token: ''
		};
	}

	_backPayment() {
		AsyncStorage.getItem('infoUser').then((data) => {
			let results = JSON.parse(data);
			if (results != null) {
				Actions.home({ title: 'Chọn Chuyến', data: results });
			} else {
				Actions.welcome();
			}
		}).done();
	}

	async componentWillMount() {

		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		this.setState({
			infoAdm: results,
			token: token
		});

		var that = this;

		fetch(domain+'/api/api_user_get_user_info.php?token='+token+'&user_id='+admId, {
			headers: {
				'Cache-Control': cache
			}
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.status == 200) {
				that.setState({
					results: responseJson.dataUser,
					loading: false
				});
			}else {
				alert(responseJson.mes);
				Actions.welcome({type: 'reset'});
			}
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
		return (
			<View style={{ height: height, width: width, paddingTop: 60 }}>

				<ScrollView>
					{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
					{!this.state.loading &&
						<View>
							<View style={{ alignItems: 'center', marginTop: 20 }}>
								<Thumbnail size={150} square source={{uri: this.state.results.avatar_txt}} />
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ margin: 20, }}>
									<Text>Họ tên: </Text>
									<Text>SDT: </Text>
									<Text>Email: </Text>
								</View>
								<View style={{ margin: 20, }}>
									<Text>{this.state.results.use_full_name}</Text>
									<Text>{this.state.results.use_phone}</Text>
									<Text>{this.state.results.use_gmail}</Text>
								</View>
							</View>
						</View>
					}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 64,
		position: 'relative',
		alignItems: 'center',
		padding: 30
	},
	styleText: {
		marginBottom: 10
	},
	styleButton: {

	}
});

export default UserInfo
