import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
	Dimensions,
   Text,
   View
} from 'react-native';
import { Button, Grid, Row, Icon, InputGroup, Input, Thumbnail } from 'native-base';
import {Actions} from 'react-native-router-flux';
const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

const domain = 'http://hai-van.local';
class Register extends Component {

	constructor(props) {
      super(props);
      this.state = {
         fullName: '',
         email: '',
			phone: '',
         password: '',
			rePassword: '',
			cssError: [],
			selectedIndex: 0,
			messageError: [],
			loading: false
      };
   }

	handleRegister() {
		let mesValid = [];
		this.state.cssError = [];
		let checkValid = true;
		if(this.state.fullName == '') {
			checkValid = false;
			this.state.cssError.cssErrorFullname = 'cssError';
			mesValid.push(
				<Text key="fullname" style={styles.textErrors}>Bạn vui lòng nhập Họ và Tên.</Text>
			);
		}

		if(this.state.email == '') {
			checkValid = false;
			this.state.cssError.cssErrorEmail = 'cssError';
			mesValid.push(
				<Text key="email" style={styles.textErrors}>Bạn vui lòng nhập Email.</Text>
			);
		}

		if(this.state.phone == '') {
			checkValid = false;
			this.state.cssError.cssErrorPhone = 'cssError';
			mesValid.push(
				<Text key="phone" style={styles.textErrors}>Bạn vui lòng nhập Số Điện Thoại.</Text>
			);
		}

		if(this.state.password == '') {
			checkValid = false;
			this.state.cssError.cssErrorPassword = 'cssError';
			mesValid.push(
				<Text key="password" style={styles.textErrors}>Bạn vui lòng nhập Mật Khẩu.</Text>
			);
		}else {
			if(this.state.rePassword != this.state.password) {
				checkValid = false;
				this.state.cssError.cssErrorRepassword = 'cssError';
				mesValid.push(
					<Text key="password" style={styles.textErrors}>Mật khẩu không giống nhau.</Text>
				);
			}
		}

		this.setState({
			messageError: mesValid
		});

		if(checkValid) {
			this.setState({
	         loading: true
	      });
	      var that = this;
			let urlRequest	= domain+'/api/api_user_dang_ky.php?fullName='+this.state.fullName+'&email='+this.state.email+'&phone='+this.state.phone+'&password='+this.state.password;
	      fetch(urlRequest, {
				method: 'GET'
			})
			.then((response) => response.json())
        	.then((responseData) => {
            if(responseData.status == 200) {
					that.setState({
		            loading: false,
						fullName: '',
			         email: '',
						phone: '',
			         password: '',
						rePassword: ''
		         });
				   Actions.welcome({title: 'Đăng Nhập'});
				}else if(responseData.status == 201) {
					mesValid.push(
						<Text key="error_api" style={styles.textErrors}>Số điện thoại không hợp lệ.</Text>
					);
					this.setState({
						messageError: mesValid,
						loading: false
					});
				}else {
					mesValid.push(
						<Text key="error_api" style={styles.textErrors}>Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.</Text>
					);
					that.setState({
		            loading: false,
						messageError: mesValid
		         });
				}
        	})
			.catch((error) => {
				mesValid.push(
					<Text key="error_api" style={styles.textErrors}>Lỗi hệ thống. Vui lòng liên hệ với bộ phận Kỹ Thuật.</Text>
				);
				that.setState({
	            loading: false,
					messageError: mesValid
	         });
	      }).done();
		}
	}

   render() {
      return(
			<Grid>
				<Row size={1}></Row>
				<Row size={2}>
					<View>
						<View style={styles.wrapViewImage}>
							<Thumbnail size={80} source={require('../../Skin/Images/logo.png')} />
						</View>
						<View key="content_login" style={styles.paddingContent}>
							<InputGroup key="group_full_name">
								<Icon name='ios-person' style={styles[this.state.cssError.cssErrorFullname]} />
								<Input placeholder="Họ Và Tên" onChange={(event) => this.setState({fullName: event.nativeEvent.text})} />
							</InputGroup>

							<InputGroup key="group_email">
								<Icon name='ios-mail' style={styles[this.state.cssError.cssErrorEmail]} />
								<Input placeholder="Địa Chỉ Email" onChange={(event) => this.setState({email: event.nativeEvent.text})} />
							</InputGroup>

							<InputGroup key="group_phone">
								<Icon name='ios-call' style={styles[this.state.cssError.cssErrorPhone]} />
								<Input placeholder="Số điện thoại" onChange={(event) => this.setState({phone: event.nativeEvent.text})} />
							</InputGroup>

							<InputGroup key="group_password">
								<Icon name='ios-unlock' style={styles[this.state.cssError.cssErrorPassword]} />
								<Input placeholder="Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({password: event.nativeEvent.text})} />
							</InputGroup>

							<InputGroup key="group_repassword">
								<Icon name='ios-unlock' style={styles[this.state.cssError.cssErrorRepassword]} />
								<Input placeholder="Nhập Lại Mật khẩu" secureTextEntry={true} onChange={(event) => this.setState({rePassword: event.nativeEvent.text})} />
							</InputGroup>

							<Button
								block
								success
								style={styles.buttonRegister}
								onPress={() => this.handleRegister()}
							>Đăng ký</Button>
							<Text style={{fontWeight: 'bold', marginTop: 10}}>Chú ý: Số Điện Thoại là tài khoản đăng nhập</Text>

							{this.state.messageError}
						</View>
					</View>
				</Row>
				<Row size={1}></Row>
			</Grid>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 60,
		height: heightDevice,
		paddingBottom: 50
	},
	cssError: {
		color: 'red'
	},
	textErrors: {
		color: 'red',
		marginTop: 5
	},
	buttonRegister: {
		marginTop: 10
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

export default Register
