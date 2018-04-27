import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Dimensions, Platform, Image, AsyncStorage, ScrollView, TouchableOpacity } from 'react-native';
import {
	Container,
	Header,
	Title,
	Content,
	Footer,
	FooterTab,
	Button,
	Text,
	View,
	Icon,
	List,
	ListItem
} from 'native-base';
import { domain, cache } from '../../Config/common';
import { Actions } from 'react-native-router-flux';
import Communications from 'react-native-communications';
import sidebarTheme from './theme-sidebar';
import styles from './style';
import DeviceInfo from 'react-native-device-info';

const logo = require('../../Skin/Images/logo.png');
const { width, height } = Dimensions.get('window');

const tempInterval = '';
class SideBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			checkLogin: false,
			dataUser: [],
			height: height,
			width: width
		};
	}

	_onPressLogout() {
		AsyncStorage.removeItem('infoUser')
			.then(() => {
				this.setState({
					checkLogin: false,
					dataUser: []
				})
				Actions.welcome({ type: 'reset' });
			});
	}

	componentDidMount() {
		let that = this;
		tempInterval = setInterval(function () {
			AsyncStorage.getItem('infoUser').then((data) => {
				let results = JSON.parse(data);
				if (results != null) {
					that.setState({
						checkLogin: true,
						dataUser: JSON.parse(data)
					});
					clearInterval(tempInterval);
				}
			}).done();
		}, 500);
	}

	componentWillUpdate() {
		let that = this;
		tempInterval = setInterval(function () {
			AsyncStorage.getItem('infoUser').then((data) => {
				let results = JSON.parse(data);
				if (results != null) {
					that.setState({
						checkLogin: true,
						dataUser: JSON.parse(data)
					});
					clearInterval(tempInterval);
				}
			}).done();
		}, 500);
	}

	_userInfo() {

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
		return (
			<View theme={sidebarTheme} style={[styles.sidebar]} onLayout={this._onLayout}>
				<Header style={styles.drawerCover}>
					<Image
						square
						style={{ resizeMode: 'contain', height: 30, marginTop: -15 }}
						source={logo}
					/>
				</Header>

				<View style={{ height: (this.state.height - 73), overflow: 'hidden' }}>
					<ScrollView style={{ marginBottom: 40, height: (this.state.height - 73) }}>
						{this.state.checkLogin &&
							<View style={{ alignItems: 'flex-start', paddingLeft: 30, paddingVertical: 20 }}>
								<TouchableOpacity onPress={() => { this.props.closeDrawer(); Actions.UserInfo({ title: 'Thông tin tài khoản' }) }}>
									{this.state.dataUser.adm_fullname != '' &&
										<Text style={{ color: '#0A0A1B' }}>Xin Chào: <Text style={{ color: '#4B1414' }}>{this.state.dataUser.adm_fullname}</Text></Text>
									}
									<Text style={{ color: '#0A0A1B' }}>SĐT: <Text style={{ color: '#4B1414' }}>{this.state.dataUser.use_phone}</Text></Text>
								</TouchableOpacity>
							</View>
						}
						<List>

							{!this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-contact" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Đăng Nhập</Text>
									</View>
								</ListItem>
							}

							<ListItem button iconLeft onPress={() => { Communications.phonecall('19006776', true); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-call" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>HOTLINE: <Text style={{ color: 'red', fontWeight: 'bold' }}>19006776</Text></Text>
								</View>
							</ListItem>

							<ListItem button iconLeft onPress={() => { Actions.welcome({ title: 'Trang Chủ', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Đặt vé</Text>
								</View>
							</ListItem>

							{/* {this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.PointToPromotion({ title: 'Đổi điểm lấy mã KM' }) }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-bookmark" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Đổi điểm lấy mã KM</Text>
									</View>
								</ListItem>
							} */}

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.ListPromotion({ title: 'Danh sách mã KM' }) }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-megaphone" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Danh sách mã khuyến mãi</Text>
									</View>
								</ListItem>
							}

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.LichSu({ title: 'Lịch sử đặt vé', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }) }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-bookmark" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Lịch sử chuyến đi</Text>
									</View>
								</ListItem>
							}

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.ListPoint({ title: 'Lịch sử tích điểm' }) }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-bookmark" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Lịch sử tích điểm</Text>
									</View>
								</ListItem>
							}

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.ListPointDown({ title: 'Lịch sử tiêu điểm' }) }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-bookmark" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Lịch sử tiêu điểm</Text>
									</View>
								</ListItem>
							}

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); Actions.DanhGia({ title: 'Lịch sử đặt vé', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }) }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-ribbon" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Đánh giá</Text>
									</View>
								</ListItem>
							}

							{/* <ListItem button iconLeft onPress={() => { Actions.ListNews({ title: 'Danh sách tin tức', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-happy" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Tin tức</Text>
								</View>
							</ListItem> */}

							{/* <ListItem button iconLeft onPress={() => { Actions.Contact({ title: 'Liên Hệ', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-contacts" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Liên hệ</Text>
								</View>
							</ListItem> */}

							<ListItem button iconLeft onPress={() => { Actions.gopy({ title: 'Góp Ý', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Góp ý</Text>
								</View>
							</ListItem>

							{/* <ListItem button iconLeft onPress={() => { Actions.HuongDanSuDung({ title: 'Hướng dẫn sử dụng', data: { adm_name: this.state.dataUser.adm_name, last_login: this.state.dataUser.last_login, adm_id: this.state.dataUser.adm_id } }); this.props.closeDrawer(); }}>
								<View style={styles.listItemContainer}>
									<View style={[styles.iconContainer]}>
										<Icon name="ios-heart" style={styles.sidebarIcon} />
									</View>
									<Text style={styles.text}>Hướng dẫn sử dụng</Text>
								</View>
							</ListItem> */}

							{this.state.checkLogin &&
								<ListItem button iconLeft onPress={() => { this.props.closeDrawer(); this._onPressLogout(); }}>
									<View style={styles.listItemContainer}>
										<View style={[styles.iconContainer]}>
											<Icon name="ios-contact" style={styles.sidebarIcon} />
										</View>
										<Text style={styles.text}>Đăng Xuất</Text>
									</View>
								</ListItem>
							}
						</List>
					</ScrollView>
					<View style={{ position: 'absolute', bottom: 0, width: (this.state.width * .8), left: 0, backgroundColor: '#f7f7f7', alignItems: 'center', padding: 10 }}>
						<Text style={[styles.text]}>{'Version: ' + DeviceInfo.getVersion()}</Text>
					</View>
				</View>
			</View>
		);
	}
}

export default SideBar
