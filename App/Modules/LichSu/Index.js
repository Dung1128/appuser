import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {domain,cache} from '../../Config/common';
import * as base64 from '../../Components/base64/Index';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
const heightDevice = Dimensions.get('window').height;

class LichSu extends Component {

	constructor(props) {
      super(props);
		this.state = {
			token: '',
			loading: true,
			results: [],
			dataBen: [],
			showDropdown: false
		};
   }

	_getDanhSachLichSu(token) {
		this.setState({
			loading: true
		});
		var that = this;

      fetch(domain+'/api/api_user_lich_su_order.php?token='+token+'&notId=0&user_id='+this.props.data.adm_id, {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			that.setState({
				results: responseJson.dataLichSu,
				dataBen: responseJson.dataBen,
				loading: false
			});
      })
      .catch((error) => {
         console.error(error);
      });
   }

	componentWillMount() {
		let that = this;
		let admId = 0,
		admUsername = '',
		admLastLogin = '',
		token = '';

		if(this.props.data.adm_id == undefined) {

			AsyncStorage.getItem('infoUser').then((data) => {
	         let results = JSON.parse(data);
	         admId = results.adm_id;
				admUsername = results.adm_name;
				admLastLogin = results.last_login;
	      }).done();
		}else {
			admId = this.props.data.adm_id;
			admUsername = this.props.data.adm_name;
			admLastLogin = this.props.data.last_login;
		}
		token = base64.encodeBase64(admUsername)+'.'+base64.encodeBase64(admLastLogin)+'.'+base64.encodeBase64(''+admId+'');
		this.setState({
			token: token
		});

		this._getDanhSachLichSu(token);
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
							<Text>Thời gian xuất bến: <Text style={styles.fontBold}>{item.oder.ord_time_book}</Text></Text>
							<Text>Số ghế: <Text style={styles.fontBold}>{item.datve.gio_xuat_ben}</Text></Text>
							<Text>Tổng tiền: <Text style={styles.fontBold}>{newPrice1 + ' VNĐ'}</Text></Text>
						</View>
					</TouchableOpacity>
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

   render() {
      return(
			<View style={styles.container}>
				<ScrollView>
					{this.state.loading? <Text>Loading...</Text> : this._renderHtmlLichSu(this.state.results) }
			  </ScrollView>
			</View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59,
		height: heightDevice,
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
