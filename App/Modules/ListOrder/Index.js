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
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
const heightDevice = Dimensions.get('window').height;

const domain = 'http://haivanexpress.com';
class LichSu extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: ''
		};
		console.log(this.props.data);
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
							<Text>Họ tên: <Text style={styles.fontBold}>{item.oder.ord_ten_khach_hang}</Text></Text>
							<Text>Số điện thoại: {item.oder.ord_phone}</Text>
							<Text>Tuyến đi: {this.state.dataBen[item.datve.tuy_ben_a]} -> {this.state.dataBen[item.datve.tuy_ben_b]}</Text>
							<Text>Nơi đi & Nơi đến: {this.state.dataBen[item.datve.dav_diem_a]} -> {this.state.dataBen[item.datve.dav_diem_b]}</Text>
							<Text>Số ghế: <Text style={styles.fontBold}>{item.datve.number_ghe}</Text></Text>
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

	_handleSaveOrder() {
		let dataGiuong = this.state.arrVeNumber[this.state.nameGiuong];
		let dataBook = JSON.stringify(this.state.dataBook);
		let that = this;
		let params = 'type=insert&bvv_bvn_id='+this.props.data.bvv_bvn_id+'&user_id='+this.props.data.user_id+'&gio_xuat_ben='+this.props.data.gio_xuat_ben+'&dataBook='+this.props.data.dataBook;
		fetch(domain+'/api/api_user_save_order.php?'+params)
		.then((response) => response.json())
		.then((responseJson) => {
			that.setState({
				isOpen: false,
				nameDiemDi: '',
				keyDiemDi: '',
				nameDiemDen: '',
				keyDiemDen: '',
				priceTotal: 0,
				totalPriceInt: 0,
				checkout: false
			});
			alert('Success!');
		})
		.catch((error) => {
			console.error(error);
		});
	}

	renderOrder(data) {
		// let dataJson = JSON.parse(data);
		console.log(data);
		// for(var i = 0; i < dataJson.length; i++) {
		// 	console.log(dataJson[i]);
		// }
	}

	componentWillUpdate(nextProps, nextState) {
		this.setState({
			results: nextProps.data.dataBook
		});
		console.log('x');
	}

   render() {
		console.log('c');
      return(
			<View style={styles.container}>
				<ScrollView>
					<Card>
						<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
							<Text style={{fontSize: 20}}>Đơn hàng</Text>
						</CardItem>

						<CardItem>
							<Text>Họ tên: <Text style={styles.fontBold}>{this.props.data.data_user.use_gmail}</Text></Text>
							<Text>Số điện thoại: {this.props.data.data_user.use_phone}</Text>
							<Text>Giờ xuất bến: <Text style={styles.fontBold}>{this.props.data.gio_xuat_ben}</Text></Text>
						</CardItem>

						<CardItem>
							<View style={{flexDirection: 'row'}}>
								<View style={{flex: 1}}>
									<Text>Nđi & Nđến</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>DS ghế</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>Tghế</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>Đgiá</Text>
								</View>
							</View>
							<View style={{flexDirection: 'row'}}>
								<View style={{flex: 1}}>
									<Text>Nđi & Nđến</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>DS ghế</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>Tghế</Text>
								</View>
								<View style={{flex: 1}}>
									<Text>Đgiá</Text>
								</View>
							</View>
						</CardItem>
					</Card>
				</ScrollView>

			  <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>

				 <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]}>
					 <Text style={{color: 'red'}}>Thanh Toán</Text>
				 </TouchableOpacity>

			 </View>
			</View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 64,
		height: heightDevice,
		paddingBottom: 50
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
	styleTabbars: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7'
	},
	fontBold: {
		fontWeight: 'bold'
	}
});

export default LichSu
