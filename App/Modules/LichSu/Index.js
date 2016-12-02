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
			results: [],
			dataBen: [],
			showDropdown: false
		};
   }

	_getDanhSachLichSu() {
		this.setState({
			loading: true
		});
		var that = this;

      return fetch(domain+'/api/api_user_lich_su_order.php?notId=0&day='+this.props.data.day+'&user_id='+this.props.data.adm_id)
	      .then((response) => response.json())
	      .then((responseJson) => {
				that.setState({
					results: responseJson.dataLichSu,
					dataBen: responseJson.dataBen,
					loading: false
				});
	         return responseJson.dataLichSu;
	      })
	      .catch((error) => {
	         console.error(error);
	      });
   }

	componentWillMount() {
		this._getDanhSachLichSu();
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

   render() {
      return(
			<View style={styles.container}>
				<ScrollView>
					{this.state.loading? <Text>Loading...</Text> : this._renderHtmlLichSu(this.state.results) }
			  </ScrollView>

			  <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
			  		{this.props.data.notId > 0 &&
				 <TouchableOpacity onPress={() => Actions.ViewSoDoGiuong({title: 'Chọn chỗ', data: {adm_id:this.props.data.adm_id,gio_xuat_ben: this.props.data.gio_xuat_ben, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId, benA: this.props.data.benA, benB: this.props.data.benB}}) } style={[styles.styleTabbars, {flex: 4}]}>
					 <Text>Chọn Chỗ</Text>
				 </TouchableOpacity>}
				 {!this.props.data.notId &&
			  <TouchableOpacity onPress={() => Actions.home({title: 'Chọn Chuyến', data: {adm_id: this.props.data.adm_id, day:this.state.fullDate}}) } style={[styles.styleTabbars, {flex: 4}]}>
				  <Text>Chọn Chuyến</Text>
			  </TouchableOpacity>}
				 <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]}>
					 <Text style={{color: 'red'}}>Lịch Sử</Text>
				 </TouchableOpacity>
				 <TouchableOpacity onPress={() => Actions.DanhGia({title: 'Đánh giá', data: {day:this.props.data.day, adm_id: this.props.data.adm_id, gio_xuat_ben: this.props.data.gio_xuat_ben, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId, benA: this.props.data.benA, benB: this.props.data.benB}})} style={[styles.styleTabbars, {flex: 4}]}>
					 <Text>Đánh Giá</Text>
				 </TouchableOpacity>
				 <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
					 <Icon name="ios-more" />
					 {this.state.showDropdown && <View style={{position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
						 <View style={{flexDirection: 'row', margin: 10}}>
							 <Text onPress={() => [this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Lịch Sử</Text>
							 <TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
						 </View>
					 </View>}
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
