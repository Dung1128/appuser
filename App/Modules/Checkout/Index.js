import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import {Button} from 'native-base';
import {Actions} from 'react-native-router-flux';

class Checkout extends Component {

   constructor(props) {
      super(props);
   }

	render() {
		return(
			<View style={styles.container}>
				<Text style={[styles.styleText, {color: '#00bfff'}]}>Bạn đã Thanh Toán thành công.</Text>
				<Text style={styles.styleText}>Chúng tôi sẽ liên hệ với bạn sớm nhất.</Text>
				<Text style={styles.styleText}>Cảm ơn bạn đã đặt vé ở hệ thống của chúng tôi.</Text>
				<Button block success onPress={() => Actions.home({title: 'Chọn Chuyến', data: {adm_id: this.props.data.adm_id}})}>
					<Text style={{color: '#fff'}}>Quay về Trang Chủ</Text>
				</Button>
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
