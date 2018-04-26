import React, { Component } from 'react';
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
import {Button, Icon, Spinner} from 'native-base';
import {Actions} from 'react-native-router-flux';
import * as common from '../../Config/common';
const {height, width} = Dimensions.get('window');
class Checkout extends Component {

   constructor(props) {
      super(props);
		this.state = {
			loading: true,
			height: height,
			width: width
		};
   }
   
	_backPayment() {
		let that = this;
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

	_onLayout = event => {
		let heightDevice = Dimensions.get('window').height;
		let widthDevice = Dimensions.get('window').width;
		this.setState({
			height: heightDevice,
			width: widthDevice
		});
	}

	render() {
		return(
			<View style={{height: this.state.height, width: this.state.width}} onLayout={this._onLayout}>
				<View style={{position: 'absolute', bottom: 0, width: width, left: 0, zIndex: 1, backgroundColor: '#ccc', height: 40, alignItems: 'flex-start', justifyContent: 'center'}}>
					<TouchableOpacity onPress={() => this._backPayment()} style={{width: width}}>
						<Icon name="md-arrow-round-back" style={{marginLeft: 20}} />
					</TouchableOpacity>
				</View>

					<WebView
						source={{uri: common.domainPayment + '/thanh-toan.html?order='+this.props.data.orderId}}
						startInLoadingState={this.state.loading}
						automaticallyAdjustContentInsets={false}
						javaScriptEnabled={true}
						style={{marginBottom: 40, width: this.state.width}}
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
