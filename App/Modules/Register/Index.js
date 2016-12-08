import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
	Dimensions,
   Text,
   View,
	ScrollView
} from 'react-native';
import {domain,cache} from '../../Config/common';
import { Button, Grid, Row, Icon, InputGroup, Input, Thumbnail } from 'native-base';
import {Actions} from 'react-native-router-flux';
const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

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
			let urlRequest	= domain+'/api/api_user_dang_ky.php?'+encodeURIComponent('fullName='+this.state.fullName+'&email='+this.state.email+'&phone='+this.state.phone+'&password='+this.state.password);
	      fetch(urlRequest, {
				method: 'GET',
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
        	.then((responseData) => {
				console.log(responseData);
            if(responseData.status == 200) {
					that.setState({
		            loading: false,
						fullName: '',
			         email: '',
						phone: '',
			         password: '',
						rePassword: ''
		         });
					alert('Đăng ký thành công.');
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
						<Text key="error_api" style={styles.textErrors}>Số điện thoại đã tồn tại trên hệ thống.</Text>
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
			<ScrollView>
				<View style={{marginTop: 100}}>
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

						<Text style={{fontWeight: 'bold', marginTop: 10, marginBottom: 5}}>Chú ý: Số Điện Thoại là tài khoản đăng nhập</Text>

						<Button
							block
							success
							style={styles.buttonRegister}
							onPress={() => this.handleRegister()}
						>Đăng ký</Button>


						{this.state.messageError}
					</View>
				</View>
			</ScrollView>
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
