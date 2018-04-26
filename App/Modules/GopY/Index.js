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
	KeyboardAvoidingView
} from 'react-native';
import PropTypes from 'prop-types';
import { Icon, Spinner, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { domain, cache } from '../../Config/common';
import fetchData from '../../Components/FetchData';

const height = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

class GopY extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fullname: '',
			title: '',
			email: '',
			phone: '',
			content: '',
			height: height,
			width: widthDevice,
			errorFullname: '',
			errorPhone: '',
			errorContent: '',
			listError: []
		};
	}

	async _handleGopY() {
		let listError = [];
		let checkForm = true;
		if (this.state.fullname == '') {
			checkForm = false;
			listError.push(<Text key="fullname" style={styles.colorTextError}>Vui lòng nhập Họ và tên.</Text>);
		}
		if (this.state.phone == '') {
			checkForm = false;
			listError.push(<Text key="phone" style={styles.colorTextError}>Vui lòng nhập Số điện thoại.</Text>);
		}
		if (this.state.content == '') {
			checkForm = false;
			listError.push(<Text key="content" style={styles.colorTextError}>Vui lòng nhập Nội dung góp ý.</Text>);
		}
		this.setState({
			errorFullname: this._handleValidForm(this.state.fullname),
			errorPhone: this._handleValidForm(this.state.phone),
			errorContent: this._handleValidForm(this.state.content),
			listError: listError
		});

		if (checkForm) {
			try {
				let params = {
					fullname: this.state.fullname,
					title: this.state.title,
					email: this.state.email,
					phone: this.state.phone,
					content: this.state.content,
				}
				let data = await fetchData('user_gop_y', params, 'GET');
				if (data.status == 200) {
					alert(data.mes);
					Actions.welcome({ title: 'Đăng Nhập' });
				}
			} catch (e) {
				console.log(e);
			}

		}
	}

	_handleValidForm(string) {
		if (string == '') {
			return 'errorInput';
		} else {
			return 'noErrorInput';
		}
	}

	_onLayout = event => {
		let widthDevice = Dimensions.get('window').width;
		let height = Dimensions.get('window').height;
		let twoColumn = (widthDevice >= 600) ? 'row' : 'column';

		this.setState({
			twoColumn: twoColumn,
			height: height,
			width: widthDevice
		});
	}

	render() {
		return (
			<View
				style={[styles.container, { width: this.state.width, height: this.state.height, justifyContent: 'center', alignItems: 'center' }]}
				onLayout={this._onLayout}
			>
				<ScrollView keyboardShouldPersistTaps="never">
					<KeyboardAvoidingView
						behavior="padding"
						style={{ paddingTop: 50 }}
					>
						<View style={[styles.groupInput, { width: (this.state.width - 40) }]}>
							<Text>Họ và Tên:</Text>
							<View style={[styles.input, styles[this.state.errorFullname]]}>
								<Input style={[{ height: 50 }]} onChangeText={(text) => this.setState({ fullname: text })} />
							</View>
						</View>
						<View style={[styles.groupInput, { width: (this.state.width - 40) }]}>
							<Text>Địa chỉ Email:</Text>
							<View style={[styles.input]}>
								<Input style={{ height: 50 }} onChangeText={(text) => this.setState({ email: text })} />
							</View>
						</View>
						<View style={[styles.groupInput, { width: (this.state.width - 40) }]}>
							<Text>Số điện thoại:</Text>
							<View style={[styles.input, styles[this.state.errorPhone]]}>
								<Input style={{ height: 50 }} onChangeText={(text) => this.setState({ phone: text })} />
							</View>
						</View>
						<View style={[styles.groupInput, { width: (this.state.width - 40) }]}>
							<Text>Tiêu đề:</Text>
							<View style={styles.input}>
								<Input style={[{ height: 50 }]} onChangeText={(text) => this.setState({ title: text })} />
							</View>
						</View>
						<View style={[styles.groupInput, { width: (this.state.width - 40) }]}>
							<Text>Nội dung góp ý:</Text>
							<View style={[styles.input, styles[this.state.errorContent]]}>
								<Input multiline={true} numberOfLines={5} style={{ height: 80, fontSize: 17 }} onChangeText={(text) => this.setState({ content: text })} />
							</View>
						</View>
						<View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', width: (this.state.width - 40), marginBottom: 10 }}>
							{this.state.listError}
						</View>
						<View style={[styles.groupInput, { width: (this.state.width - 40) }]}>
							<TouchableOpacity style={styles.button} onPress={() => this._handleGopY()}>
								<Text style={{ fontSize: 15, color: '#fff' }}>Gửi Góp Ý</Text>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 62,
		flex: 1
	},
	groupInput: {
		marginBottom: 20
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		marginTop: 5
	},
	errorInput: {
		borderWidth: 1,
		borderColor: 'red',
		marginTop: 5
	},
	noErrorInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		marginTop: 5
	},
	button: {
		backgroundColor: '#6495ed',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15
	},
	colorTextError: {
		color: 'red'
	}
})

export default GopY
