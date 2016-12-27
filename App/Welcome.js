import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
   StyleSheet,
   AsyncStorage,
	TouchableOpacity,
	ScrollView,
	Dimensions
} from 'react-native';
import { Container, Content, InputGroup, View, Icon, Input,Text, Button, Thumbnail, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';
import {domain,cache} from './Config/common';

import * as base64 from './Components/base64/Index';

let {width, height} = Dimensions.get('window');

class Welcome extends Component {

	constructor(props) {
      super(props);
      this.state = {
         username: '',
         password: '',
			cssError: 'noError',
			selectedIndex: 0,
			error: 'false',
			messageError: []
      };
   }

	async componentWillMount() {
		try {
			this.setState({
				loading: true
			});
			let that = this;
		  	let dataUser = await AsyncStorage.getItem('infoUser');
			let jsonDataUser = JSON.parse(dataUser);
			if(jsonDataUser != null) {
				let token = base64.encodeBase64(jsonDataUser.adm_name)+'.'+base64.encodeBase64(jsonDataUser.last_login)+'.'+base64.encodeBase64(''+jsonDataUser.adm_id+'');

				let dataToken = await AsyncStorage.getItem(token);
				if(dataToken != null) {
					fetch(domain+'/api/api_user_dang_nhap.php?type=checkTokenLogin&use_id='+jsonDataUser.adm_id+'&token='+token, {
						headers: {
							'Cache-Control': cache
						}
					})
					.then((response) => response.json())
					.then((responseJson) => {
						if(responseJson.status != 404) {
							if(responseJson.status == 200) {

								that.setState({
									loading: false
								});
								Actions.home({title: 'Chọn Chuyến', data: jsonDataUser});
							}
						}else if(responseJson.status == 404) {
							that.setState({
								loading: false,
								error: 'true',
								messageError: ['Tài khoản đã được đăng nhập ở thiết bị khác.']
							});
						}
					})
					.catch((error) => {
						that.setState({
							loading: false,
							error: 'true',
							messageError: ['Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.']
						});
						Console.error(error);
					});
				}else {
					this.setState({
						loading: false
					});
				}
			}else {
				this.setState({
					loading: false
				});
			}

	  	} catch (error) {
			this.setState({
				loading: false
			});
	  	}
	}

   handleLogin() {
		let checkNullForm = false,
			mesValid = [];
		if(this.state.username.length == 0) {
			checkNullForm = true;
			mesValid.push('Vui lòng nhập tên tài khoản.');
		}
		if(this.state.password.length == 0) {
			checkNullForm = true;
			mesValid.push('Vui lòng nhập Mật Khẩu.');
		}

		if(!checkNullForm) {
	      this.setState({
	         loading: true
	      });
	      var that = this;
			let urlRequest	= domain+'/api/api_user_dang_nhap.php?type=login&username='+this.state.username+'&password='+this.state.password;
	      fetch(urlRequest, {
				headers: {
					'Cache-Control': cache
				}
			})
	      .then((response) => {
				return response.json()
			})
	      .then((responseJson) => {
	         that.setState({
	            loading: false,
					username: '',
					password: ''
	         });
	         if(responseJson.status == 200) {
	            let result = JSON.stringify(responseJson);
					let token = base64.encodeBase64(responseJson.adm_name)+'.'+base64.encodeBase64(responseJson.last_login)+'.'+base64.encodeBase64(''+responseJson.adm_id+'');
					AsyncStorage.removeItem('infoUser');
	            AsyncStorage.setItem("infoUser", result);
					AsyncStorage.setItem(token, '1');
	            Actions.home({title: 'Chọn Chuyến', data: result});
	         }else {
					that.setState({
						error: 'true',
						messageError: ['Tài khoản hoặc Mật Khẩu không đúng.']
					});
				}
	      })
	      .catch((error) => {
	         that.setState({
	            loading: false,
					error: 'true',
					messageError: ['Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.']
	         });
	      });
		}else {
			this.setState({
				error: 'true',
				messageError: mesValid
			});
		}
   }

	renderHtml() {
		let htmlContent 	= [];
		let arrValid 		= [];

		if(this.state.error == 'true') {
			this.state.cssError = 'cssError';
		}else {
			this.state.cssError = 'noError';
		}

		if(this.state.messageError.length > 0) {
			arrValid.push(<Text style={{color: 'red', marginTop: 10}} key="username_vl">{this.state.messageError[0]}</Text>);
		}
		if(this.state.messageError.length > 1) {
			arrValid.push(<Text style={{color: 'red', marginTop: 5}} key="password_vl">{this.state.messageError[1]}</Text>);
		}

		htmlContent.push(
			<View key="content_login" style={styles.paddingContent}>
				<InputGroup key="group_username">
					<Icon name='ios-call' style={styles[this.state.cssError]} />
					<Input placeholder="Số điện thoại" style={{height: 50}} keyboardType="numeric" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
				</InputGroup>
				<InputGroup key="group_password">
					<Icon name='ios-unlock' style={styles[this.state.cssError]} />
					<Input placeholder="Mật khẩu" style={{height: 50}} secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
				</InputGroup>

				{arrValid}

				<View style={{flexDirection: 'row'}}>
					<Button
						block
						success
						style={[styles.buttonLogin, {flex: 1, height: 50}]}
						onPress={this.handleLogin.bind(this)}
					>Đăng nhập</Button>
					<Button
						block
						info
						style={[styles.buttonRegister, {flex: 1, height: 50}]}
						onPress={() => Actions.Register({title: 'Đăng Ký', hideNavBar: false})}
					>Đăng ký</Button>
				</View>
			</View>
		);

		return htmlContent;
	}

   render() {
      return(
			<Grid>
				<Row size={1}></Row>
				<Row size={2}>
					<View>
						<ScrollView>
							<View style={styles.wrapViewImage}>
								<Thumbnail size={80} source={require('./Skin/Images/logo.png')} />
							</View>
							{ this.state.loading && <Spinner /> }
							{!this.state.loading && this.renderHtml()}
						</ScrollView>
					</View>
				</Row>
				<Row size={1}></Row>
			</Grid>

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
