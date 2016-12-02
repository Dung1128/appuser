import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions
} from 'react-native';
import { Container, Content, InputGroup, Icon, Text, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';

const heightDevice = Dimensions.get('window').height;

class ViewDanhSachXuongXe extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: [],
			tenGiuong: []
		};
   }

	_getDanhSachCho() {
		this.setState({
			loading: true
		});
		var that = this;
      return fetch('http://hai-van.local/api/api_adm_get_danh_sach.php?type=xuongxe&not_id='+this.props.data.notId+'&day='+this.props.data.day)
	      .then((response) => response.json())
	      .then((responseJson) => {
				that.setState({
					results: responseJson.arrDanhSach,
					tenGiuong: responseJson.ten_giuong,
					loading: false
				});
	         return responseJson;
	      })
	      .catch((error) => {
	         console.error(error);
	      });
   }

	componentWillMount() {
		this._getDanhSachCho();
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

	render() {
		let dataDanhSach = this.state.results;
		return (
			<View style={styles.container}>
				<ScrollView>
					{this.state.loading? <Spinner /> : <Card dataArray={dataDanhSach}
						  renderRow={(dataDanhSach) =>
						 	<CardItem>
								<TouchableOpacity>
									<View style={{flex: 5}}>
										<Text>Họ tên: {dataDanhSach.info.bvv_ten_khach_hang}</Text>
										<Text>Số điện thoại: {dataDanhSach.info.bvv_phone}</Text>
										<Text>Giường đã đặt: {this.state.tenGiuong[dataDanhSach.info.bvv_number].sdgct_label_full}</Text>
										<Text>Điểm đi - Điểm đến: {dataDanhSach.ben_a + ' -> ' + dataDanhSach.ben_b}</Text>
										<Text>Giá: {dataDanhSach.info.bvv_price + ' VNĐ'}</Text>
									</View>
								</TouchableOpacity>
					 		</CardItem>
						}>
				  </Card>}
			  </ScrollView>

			  <View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]} onPress={() => Actions.ViewSoDoGiuong({title: 'Trên Xe', data: {chuyenVaoCho: false, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId}})}>
					  <Text>Trên Xe</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.ViewDanhSachGoi({title: 'Danh sách Gọi', data: {notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId}}) } style={[styles.styleTabbars, {flex: 4}]}>
					  <Text>Gọi</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => Actions.DanhSachCho({title: 'Đang Chờ', data: {notifiCountDanhSachCho: this.state.notifiCountDanhSachCho, notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId}})} style={[styles.styleTabbars, {flex: 4}]}>
					  <Text>Đang Chờ</Text>
					  {this.state.notifiCountDanhSachCho > 0 && <Badge style={styles.countDanhSachCho}>{this.state.notifiCountDanhSachCho}</Badge>}
				  </TouchableOpacity>
				  <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
					  <Icon name="ios-more" />
					  {this.state.showDropdown && <View style={{position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
						  <View style={{flexDirection: 'row', margin: 10}}>
							  <Text onPress={() => [Actions.ViewDanhSachHuy({title: 'Danh sách hủy vé', data: {notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId}}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Danh sách Hủy Vé</Text>
							  <TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
						  </View>
						  <View style={{flexDirection: 'row', margin: 10}}>
							  <Text onPress={() => [Actions.ViewDanhSachDaXuongXe({title: 'Danh sách xuống xe', data: {notId:this.props.data.notId, day:this.props.data.day, notTuyenId: this.props.data.notTuyenId}}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6, color: 'red'}}>Danh sách Xuống Xe</Text>
							  <TouchableOpacity style={{flex: 1,backgroundColor: '#00bfff', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
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
		height: heightDevice
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
	}
});

export default ViewDanhSachXuongXe
