import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Platform,
	StatusBar
} from 'react-native';
import { Icon, Text } from 'native-base';
import Drawer from 'react-native-drawer';

import { Actions, Scene, Router, Schema, ActionConst, Reducer } from 'react-native-router-flux';

import NavBar from './Modules/NavBar/Index';
import Home from './Modules/Home/HomeIOS';
import SideBar from './Modules/SideBar/SideBar';
import Register from './Modules/Register/Index';
import ViewSoDoGiuong from './Modules/BookGiuong/ViewSoDoGiuong';
import LichSu from './Modules/LichSu/Index';
import DanhGia from './Modules/DanhGia/Index';
import ListOrder from './Modules/ListOrder/Index';
import Checkout from './Modules/Checkout/Index';
import Payment from './Modules/Checkout/Payment';
import GopY from './Modules/GopY/Index';
import Contact from './Modules/Contact/Index';
import ListNews from './Modules/News/ListNews';
import DetailNews from './Modules/News/DetailNews';
import HuongDanSuDung from './Modules/HuongDanSuDung/Index';
import UserInfo from './Modules/Users/Index';
import Welcome from './Welcome';
import Authentication from './Modules/Authentication/Authentication';
import ResetPass from './Modules/ResetPass/ResetPass';
import ForgetPass from './Modules/ResetPass/ForgetPass';
import PointToPromotion from './Modules/Users/PointToPromotion';
import ListPromotion from './Modules/Users/ListPromotion';
import ListPoint from './Modules/Users/ListPoint';
import ListPointDown from './Modules/Users/ListPointDown';

const reducerCreate = params => {
	const defaultReducer = Reducer(params);
	return (state, action) => {
		var currentState = state;
		if (currentState) {
			while (currentState.children) {
				currentState = currentState.children[currentState.index]
			}
		}
		return defaultReducer(state, action);
	}
};

class App extends Component {

	render() {
		return (
			<Router navBar={NavBar} createReducer={reducerCreate}>
				<Scene key="root">
					<Scene key="welcome" component={Welcome} initial type="reset" />
					<Scene key="home" component={Home} title="Chọn Chuyến" type="reset" />
					<Scene key="Register" component={Register} title="Đăng Ký" />
					<Scene key="ViewSoDoGiuong" component={ViewSoDoGiuong} title="Chọn Chỗ" />
					<Scene key="LichSu" component={LichSu} title="Lịch Sử" />
					<Scene key="DanhGia" component={DanhGia} title="Đánh Giá" />
					<Scene key="ListOrder" component={ListOrder} title="Danh sách đặt vé" />
					<Scene key="Checkout" component={Checkout} title="Thanh Toán Thành Công" />
					<Scene key="gopy" component={GopY} title="Góp Ý" />
					<Scene key="Contact" component={Contact} title="Liên Hệ" />
					<Scene key="ListNews" component={ListNews} title="Danh sách tin tức" />
					<Scene key="DetailNews" component={DetailNews} title="Chi tiết tin tức" />
					<Scene key="Payment" component={Payment} title="Thanh Toán" hideNavBar={true} />
					<Scene key="HuongDanSuDung" component={HuongDanSuDung} title="Hướng đẫn sử dụng" />
					<Scene key="UserInfo" component={UserInfo} title="Thông tin tài khoản" />
					<Scene key="Authentication" component={Authentication} title="Xác thực tài khoản" />
					<Scene key="ResetPass" component={ResetPass} title="Reset mật khẩu" />
					<Scene key="ForgetPass" component={ForgetPass} title="Quên mật khẩu" />
					<Scene key="PointToPromotion" component={PointToPromotion} title="Đổi điểm lấy mã KM" />
					<Scene key="ListPromotion" component={ListPromotion} title="Danh sách mã KM" />
					<Scene key="ListPoint" component={ListPoint} title="Lịch sử tích điểm" />
					<Scene key="ListPointDown" component={ListPointDown} title="Lịch sử tiêu điểm" />
				</Scene>
			</Router>
		);
	}
}

const drawerStyles = {
	drawer: {
		shadowColor: "#000000",
		shadowOpacity: 0.8,
		shadowRadius: 0
	},
	// main: {opacity:0.5},
}

export default class Appuser extends Component {
	render() {
		return (
			<Drawer
				ref={c => this.drawer = c}
				type={'overlay'}
				content={<SideBar closeDrawer={() => { this.drawer.close(); }} />}
				styles={drawerStyles}
				tapToClose
				openDrawerOffset={0.25}
				panCloseMask={0.2}
				tweenHandler={(ratio) => ({
					main: { opacity: (2 - ratio) / 2 }
				})}
				
			>
				<StatusBar hidden={true} />
				<App />
			</Drawer>
		);
	}
}
