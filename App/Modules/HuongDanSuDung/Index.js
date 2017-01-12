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
import fetchData from '../../Components/FetchData';
import {Button, Icon, Spinner} from 'native-base';
import {Actions} from 'react-native-router-flux';
const {height, width} = Dimensions.get('window');
class HuongDanSuDung extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true,
			webViewHeight: 0
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
		this.setState({
			loading: true
		});
		let data = [];
		try {
			let params = {
				type: 'huongdanuser'
			}
			data = await fetchData('user_get_content', params, 'GET');
		} catch (e) {
			console.log(e);
		}
		var that = this;

		setTimeout(() => {

			let des = '';
			that.setState({
				results: (data.data.length > 0) ? data.data : 'Hiện tại chưa có bài hướng dẫn. Bạn vui lòng quay lại sau!',
				loading: false
			});

		}, 500);
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
							source={{html: '<html><body>'+this.state.results+'</body></html>'}}
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

export default HuongDanSuDung
