import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
   StyleSheet,
   AsyncStorage,
	TouchableOpacity
} from 'react-native';
import { Container, Content, InputGroup, View, Icon, Input,Text, Button, Thumbnail, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import {Actions} from 'react-native-router-flux';

const domain = 'http://hai-van.local';
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

	componentWillMount() {
		this.setState({
			loading: true
		});
		var that = this;
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
			let urlRequest	= domain+'/api/api_user_dang_nhap.php?username='+this.state.username+'&password='+this.state.password;
	      fetch(urlRequest)
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
	            AsyncStorage.setItem("infoUser", result);
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
					<Icon name='ios-person' style={styles[this.state.cssError]} />
					<Input placeholder="Số điện thoại" onChange={(event) => this.setState({username: event.nativeEvent.text})} />
				</InputGroup>
				<InputGroup key="group_password">
					<Icon name='ios-unlock' style={styles[this.state.cssError]} />
					<Input placeholder="Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
				</InputGroup>

				{arrValid}

				<View style={{flexDirection: 'row'}}>
					<Button
						block
						success
						style={[styles.buttonLogin, {flex: 1}]}
						onPress={this.handleLogin.bind(this)}
					>Đăng nhập</Button>
					<Button
						block
						info
						style={[styles.buttonRegister, {flex: 1}]}
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
						<View style={styles.wrapViewImage}>
							<Thumbnail size={80} source={require('./Skin/Images/logo.png')} />
						</View>
						{ this.state.loading && <Spinner /> }
						{!this.state.loading && this.renderHtml()}
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
      padding: 30
   },
	wrapViewImage: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: -30
	},

});

export default Welcome
