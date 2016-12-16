import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  WebView,
  Dimensions
} from 'react-native';
import {Button, Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
const {height, width} = Dimensions.get('window');
class Checkout extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true
		};
   }

	_backPayment() {
		AsyncStorage.getItem('infoUser').then((data) => {
         let results = JSON.parse(data);
         if(results != null) {
            Actions.home({title: 'Chọn Chuyến', data: results});
         }else {
				that.setState({
					loading: false
				});
			}
      }).done();
	}

	render() {
		alert('http://hasonhaivan.com/thanh-toan.html?order='+this.props.data.orderId);
		return(
			<View style={{height: height, width: width}}>
				<View style={{position: 'absolute', top: 0, left: 0, zIndex: 1, backgroundColor: 'transparent', padding: 15}}>
					<TouchableOpacity onPress={() => this._backPayment()}>
						<Icon name="md-arrow-round-back" />
					</TouchableOpacity>
				</View>

				<WebView
					source={{uri: 'http://hasonhaivan.com/thanh-toan.html?order='+this.props.data.orderId}}
					startInLoadingState={this.state.loading}
					automaticallyAdjustContentInsets={false}
					javaScriptEnabled={true}
				/>
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

export default Checkout
