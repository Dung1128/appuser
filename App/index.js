import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Platform
} from 'react-native';
import {Icon, Text} from 'native-base';
import Drawer from 'react-native-drawer';

import {Actions, Scene, Router, Schema, ActionConst, Reducer} from 'react-native-router-flux';

import NavBar from './Modules/NavBar/Index';
import Home from './Modules/Home/HomeIOS';
import Login from './Modules/Login/Login';
import SideBar from './Modules/SideBar/SideBar';
import Register from './Modules/Register/Register';
import Errors from './Modules/Errors/Errors';
import ViewSoDoGiuong from './Modules/BookGiuong/ViewSoDoGiuong';
import LichSu from './Modules/LichSu/Index';
import DanhGia from './Modules/DanhGia/Index';
import ListOrder from './Modules/ListOrder/Index';
import Welcome from './Welcome';

const reducerCreate = params => {
 	const defaultReducer = Reducer(params);
 	return (state, action)=>{
		var currentState = state;
        if(currentState){
          while (currentState.children){
            currentState = currentState.children[currentState.index]
          }
        }
	  	return defaultReducer(state, action);
 	}
};

class App extends Component {
	render() {
		return(
			<Router navBar={NavBar} createReducer={reducerCreate}>
  	       	<Scene key="root">

  			 		<Scene key="welcome" component={Welcome} hideNavBar initial />
  	         	<Scene key="home" component={Home} title="Chọn Chuyến" type="reset" />
					<Scene key="register" component={Register} title="Đăng Ký" />
					<Scene key="login" component={Login} title="Đăng Nhập" />
					<Scene key="ViewSoDoGiuong" component={ViewSoDoGiuong} title="Chọn Chỗ" />
					<Scene key="LichSu" component={LichSu} title="Lịch Sử" />
					<Scene key="DanhGia" component={DanhGia} title="Đánh Giá" />
					<Scene key="ListOrder" component={ListOrder} title="Danh sách đặt vé" />
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
  }
}
export default class appuser extends Component {

	render() {
		return (
			<Drawer
				ref={c => this.drawer = c}
				type={'overlay'}
				content={<SideBar closeDrawer={() => { this.drawer.close(); }} />}
				styles={drawerStyles}
				tapToClose
				openDrawerOffset={0.2}
				panCloseMask={0.2}>
			  		<App />
			</Drawer>
		);
	}
}
