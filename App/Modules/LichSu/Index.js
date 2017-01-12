import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import {domain,cache} from '../../Config/common';
import StorageHelper from '../../Components/StorageHelper';
import fetchData from '../../Components/FetchData';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;

class LichSu extends Component {

	constructor(props) {
      super(props);
		this.state = {
			height: heightDevice,
			width: widthDevice,
			token: '',
			loading: true,
			results: [],
			dataBen: [],
			showDropdown: false,
			infoAdm: []
		};
   }

	async _getDanhSachLichSu(token, admId) {
		let data = [];
		try {
			let params = {
				token: token,
				notId: '0',
				user_id: admId,
			}
			data = await fetchData('user_lich_su_order', params, 'GET');
		} catch (e) {
			console.log(e);
		}

		let that = this;
		setTimeout(() => {
			if(data.status != 404) {
				that.setState({
					results: data.dataLichSu,
					dataBen: data.dataBen,
					loading: false
				});
			}else if(data.status == 404) {
				alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
				Actions.welcome({type: 'reset'});
			}
		}, 500);
   }

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		this.setState({
			infoAdm: results,
			token: token,
			loading: true
		});

		this._getDanhSachLichSu(token, admId);
	}

	_handleDropdown() {
		if(this.state.showDropdown) {
			this.setState({
				showDropdown: false
			});
		}else {
			this.setState({
				showDropdown: true
			});
		}
	}

	_renderHtmlLichSu(data) {
		let html = [],
			htmlItem = [];

		if(data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var item = data[i];
				var price1 = parseInt(item.datve.price);
				var price2 = parseInt(item.datve.dav_price);
				var newPrice1 = price1.toFixed(0).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
				});
				var newPrice2 = price2.toFixed(0).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
				});
				htmlItem.push(
					<CardItem key={item.datve.dav_did_id+i}>
						<TouchableOpacity>
								<View style={{flex: 5}}>
								<Text>Mã Đơn Hàng: <Text style={styles.fontBold}>{item.oder.ord_ma}</Text></Text>
								<Text>Thời gian đặt vé: <Text style={styles.fontBold}>{item.oder.ord_time_book}</Text></Text>
								<Text>Họ tên: <Text style={styles.fontBold}>{item.oder.ord_ten_khach_hang}</Text></Text>
								<Text>Số điện thoại: {item.oder.ord_phone}</Text>
								<Text>Tuyến đi: {this.state.dataBen[item.datve.tuy_ben_a]} -> {this.state.dataBen[item.datve.tuy_ben_b]}</Text>
								<Text>Nơi đi & Nơi đến: {this.state.dataBen[item.datve.dav_diem_a]} -> {this.state.dataBen[item.datve.dav_diem_b]}</Text>
								<Text>Thời gian xuất bến: <Text style={styles.fontBold}>{item.datve.gio_xuat_ben}</Text></Text>
								<Text>Số ghế: <Text style={styles.fontBold}>{item.datve.number_ghe}</Text></Text>
								<Text>Tổng tiền: <Text style={styles.fontBold}>{newPrice1 + ' VNĐ'}</Text></Text>
							</View>
						</TouchableOpacity>
					</CardItem>
				);
			}
		}else {
			htmlItem.push(
				<CardItem key="null">
					<View style={{flex: 5, alignItems: 'center'}}>
						<Text style={{color: 'red'}}>Bạn chưa có đơn hàng đặt vé nào!</Text>
					</View>
				</CardItem>
			);
		}
		html.push(
			<Card key="card">
				{htmlItem}
			</Card>
		);
		return html;
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
      return(
			<View style={[styles.container, {height: this.state.height}]} onLayout={this._onLayout}>
				<ScrollView>
					{this.state.loading &&
						<View style={{alignItems: 'center'}}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					}
					{!this.state.loading &&
						this._renderHtmlLichSu(this.state.results)
					}
			  </ScrollView>
			</View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59,
	},
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   },
	opacityBg: {
		flexDirection: 'row',
	},
	styleTabbars: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7'
	},
	countDanhSachCho: {
		position: 'absolute',
		right: 25,
		top: 0
	},
	fontBold: {
		fontWeight: 'bold'
	}
});

export default LichSu
