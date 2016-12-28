import React, { Component, PropTypes } from 'react';
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
import {domain,cache} from '../../Config/common';
import * as base64 from '../../Components/base64/Index';
import {Button, Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
const {height, width} = Dimensions.get('window');
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
         if(results != null) {
            Actions.home({title: 'Chọn Chuyến', data: results});
         }else {
				Actions.welcome();
			}
      }).done();
	}

	async componentWillMount() {
		let admId = 0,
		admUsername = '',
		admLastLogin = '',
		token = '';

		if(this.state.infoAdm.adm_id == undefined) {
			try {
				let results = await AsyncStorage.getItem('infoUser');
				results = JSON.parse(results);
				admId = results.adm_id;
				admUsername = results.adm_name;
				admLastLogin = results.last_login;
				this.setState({
					infoAdm: results
				});
			} catch (error) {
				console.error(error);
		  	}
		}else {
			admId = this.state.infoAdm.adm_id;
			admUsername = this.state.infoAdm.adm_name;
			admLastLogin = this.state.infoAdm.last_login;
		}
		token = base64.encodeBase64(admUsername)+'.'+base64.encodeBase64(admLastLogin)+'.'+base64.encodeBase64(''+admId+'');

		this.setState({
			token: token,
			loading: true
		});

		var that = this;

      fetch(domain+'/api/api_user_get_user_info.php?token='+token+'&user_id='+admId, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			if(responseJson.status != 404) {
				if(responseJson.status == 200) {
					that.setState({
						results: responseJson.dataUser,
						loading: false
					});
				}else if(responseJson.status == 201) {
					alert('Tài khoản không tồn tại.');
					Actions.welcome({type: 'reset'});
				}
			}else if(responseJson.status == 404) {
				alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
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
		return(
			<View style={{height: height, width: width,paddingTop: 60}}>

				<ScrollView>
					{this.state.loading && <Text>Loading...</Text>}
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
