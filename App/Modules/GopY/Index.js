import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import { Icon, Spinner } from 'native-base';
import {Actions} from 'react-native-router-flux';

import {domain,cache} from '../../Config/common';
import styles from './styles';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

class GopY extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fullname: '',
			email: '',
			phone: '',
			content: ''
		};
	}

	_handleGopY() {
		let listError = [];
		let checkForm = true;
		if(this.state.fullname == '') {
			checkForm = false;
			listError.push(<Text key="fullname" style={styles.colorTextError}>Vui lòng nhập Họ và tên.</Text>);
		}
		if(this.state.phone == '') {
			checkForm = false;
			listError.push(<Text key="phone" style={styles.colorTextError}>Vui lòng nhập Số điện thoại.</Text>);
		}
		if(this.state.content == '') {
			checkForm = false;
			listError.push(<Text key="content" style={styles.colorTextError}>Vui lòng nhập Nội dung góp ý.</Text>);
		}
		this.setState({
			errorFullname: this._handleValidForm(this.state.fullname),
			errorPhone: this._handleValidForm(this.state.phone),
			errorContent: this._handleValidForm(this.state.content),
			listError: listError
		});

		if(checkForm) {
			let urlApi = domain+'/api/api_user_gop_y.php?'+encodeURIComponent('fullname='+this.state.fullname+'&email='+this.state.email+'&phone='+this.state.phone+'&content='+this.state.content);
			console.log(urlApi);
			fetch(urlApi, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status == 200) {
					alert('Cảm ơn bạn đã Góp Ý cho hệ thống của chúng tôi.');
					Actions.welcome({title: 'Đăng Nhập'});
				}
			}).catch((error) => {
				console.error(error);
			});
		}
	}

	_handleValidForm(string) {
		if(string == '') {
			return 'errorInput';
		}else {
			return 'noErrorInput';
		}
	}

	render() {
		return(
			<View style={[styles.container]}>
				<ScrollView>
					<View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<View style={[styles[this.state.errorFullname], styles.groupInput]}>
							<Text>Họ và Tên:</Text>
							<View style={styles.input}>
								<TextInput style={[{height: 30}]} placeholder="Nhập họ và tên" onChangeText={(text) => this.setState({fullname: text})} />
							</View>
						</View>
						<View style={[styles[this.state.errorEmail], styles.groupInput]}>
							<Text>Địa chỉ Email:</Text>
							<View style={styles.input}>
								<TextInput placeholder="Địa chỉ Email" style={{height: 30}} onChangeText={(text) => this.setState({email: text})} />
							</View>
						</View>
						<View style={[styles[this.state.errorPhone], styles.groupInput]}>
							<Text>Số điện thoại:</Text>
							<View style={styles.input}>
								<TextInput placeholder="Số điện thoại" style={{height: 30}} onChangeText={(text) => this.setState({phone: text})} />
							</View>
						</View>
						<View style={[styles[this.state.errorContent], styles.groupInput]}>
							<Text>Nội dung góp ý:</Text>
							<View style={styles.input}>
								<TextInput multiline={true} numberOfLines={5} placeholder="Nội dung góp ý" style={{height: 80, fontSize: 17}} onChangeText={(text) => this.setState({content: text})} />
							</View>
						</View>
						<View style={styles.groupInput}>
							<TouchableOpacity style={styles.button} onPress={() => this._handleGopY()}>
								<Text style={{fontSize: 15, color: '#fff'}}>Gửi Góp Ý</Text>
							</TouchableOpacity>
						</View>
						<View style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
							{this.state.listError}
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

export default GopY
