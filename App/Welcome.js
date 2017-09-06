import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	AsyncStorage,
	TouchableOpacity,
	ScrollView,
	Dimensions
} from 'react-native';
import { Container, Content, InputGroup, View, Icon, Input, Text, Button, Thumbnail, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Actions } from 'react-native-router-flux';
import * as common from './Config/common';
import StorageHelper from './Components/StorageHelper';
import fetchData from './Components/FetchData';
import Communications from 'react-native-communications';
let { width, height } = Dimensions.get('window');

class Welcome extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			cssError: 'noError',
			selectedIndex: 0,
			error: 'false',
			messageError: [],
			token: '',
			infoUser: []
		};
	}

	async componentWillMount() {
		let dataUser = await StorageHelper.getStore('infoUser');
		let jsonDataUser = JSON.parse(dataUser);

		if (jsonDataUser != null) {

			this.setState({ loading: true });

			try {
				let params = {
					type: 'checkTokenLogin',
					use_id: jsonDataUser.adm_id,
					token: jsonDataUser.token,
				}
				let data = await fetchData('login', params, 'GET');
				if (data.status != 404) {
					if (data.status == 200) {
						Actions.home({ title: 'Chọn Chuyến', data: jsonDataUser });
					}
				} else if (data.status == 404) {
					this.setState({
						error: 'true',
						loading: false,
						messageError: [data.mes]
					});
				}
			} catch (e) {
				this.setState({
					loading: false,
					error: 'true',
					messageError: ['Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.']
				});
				console.log(e);
			}
		}
	}

	async handleLogin() {
		let checkNullForm = false,
			mesValid = [];
		if (this.state.username.length == 0) {
			checkNullForm = true;
			mesValid.push('Vui lòng nhập tên tài khoản.');
		}
		if (this.state.password.length == 0) {
			checkNullForm = true;
			mesValid.push('Vui lòng nhập Mật Khẩu.');
		}

		if (!checkNullForm) {
			this.setState({
				loading: true
			});

			try {
				let params = {
					type: 'login',
					username: this.state.username,
					password: this.state.password,
				}
				let data = await fetchData('login', params, 'GET');
				if (data.status == 200) {
					let result = JSON.stringify(data);
					AsyncStorage.removeItem('infoUser');
					AsyncStorage.setItem("infoUser", result);
					Actions.home({ title: 'Chọn Chuyến', data: result });
				} else {
					if (data.status == 401) {
						let body = {
							phone: this.state.username,
						}

						fetchData('api_get_code_auth', body, 'GET');
						Actions.Authentication({ title: 'Xác thực tài khoản', data: { phone: this.state.username, password: this.state.password, type: 'login' } });
					} else {
						this.setState({
							error: 'true',
							loading: false,
							messageError: [data.mes]
						});
					}
				}
			} catch (e) {
				this.setState({
					error: 'true',
					loading: false,
					messageError: [common.errorHttp]
				});
				console.log(e);
			}
		} else {
			this.setState({
				error: 'true',
				messageError: mesValid
			});
		}
	}

	renderHtml() {
		let htmlContent = [];
		let arrValid = [];

		if (this.state.error == 'true') {
			this.state.cssError = 'cssError';
		} else {
			this.state.cssError = 'noError';
		}

		if (this.state.messageError.length > 0) {
			arrValid.push(<Text style={{ color: 'red', marginTop: 10 }} key="username_vl">{this.state.messageError[0]}</Text>);
		}
		if (this.state.messageError.length > 1) {
			arrValid.push(<Text style={{ color: 'red', marginTop: 5 }} key="password_vl">{this.state.messageError[1]}</Text>);
		}

		htmlContent.push(
			<View key="content_login" style={styles.paddingContent}>
				<InputGroup key="group_username">
					<Icon name='ios-call' style={styles[this.state.cssError]} />
					<Input placeholder="Số điện thoại" style={{ height: 50 }} keyboardType="numeric" onChange={(event) => this.setState({ username: event.nativeEvent.text })} />
				</InputGroup>
				<InputGroup key="group_password">
					<Icon name='ios-unlock' style={styles[this.state.cssError]} />
					<Input placeholder="Mật khẩu" style={{ height: 50 }} secureTextEntry={true} onChange={(event) => this.setState({ password: event.nativeEvent.text })} />
				</InputGroup>

				{arrValid}

				<View style={{ flexDirection: 'row' }}>
					<Button
						block
						success
						style={[styles.buttonLogin, { flex: 1, height: 50 }]}
						onPress={this.handleLogin.bind(this)}
					>Đăng nhập</Button>
					<Button
						block
						info
						style={[styles.buttonRegister, { flex: 1, height: 50 }]}
						onPress={() => Actions.Register({ title: 'Đăng Ký', hideNavBar: false })}
					>Đăng ký</Button>
				</View>
				<TouchableOpacity onPress={() => Actions.ForgetPass({ title: 'Quên mật khẩu' })} style={{ marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
					{/* <Text style={{ color: 'red' }}>Quên mật khẩu gọi <Text style={{ color: '#365DB5', fontWeight: 'bold' }}>19006776</Text></Text> */}
					<Text style={{ color: 'red' }}>Quên mật khẩu</Text>
				</TouchableOpacity>

			</View>
		);

		return htmlContent;
	}

	render() {
		return (

			<View style={{ flex: 1, flexDirection: 'column' }}>
				<View style={{ height: height }}>
					<Grid>
						<Row size={1}></Row>
						<Row size={5}>
							<View>
								<ScrollView>
									{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
									{!this.state.loading && this.renderHtml()}
								</ScrollView>
							</View>
						</Row>
						<Row size={1}></Row>
					</Grid>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonLogin: {
		marginTop: 10,
		marginRight: 10
	},
	buttonRegister: {
		marginTop: 10,
		marginLeft: 10
	},
	cssError: {
		color: 'red'
	},
	paddingContent: {
		paddingRight: 30,
		paddingLeft: 30
	},
	wrapViewImage: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

});

export default Welcome
