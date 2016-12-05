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
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge, CheckBox, List, ListItem } from 'native-base';
import {Actions, ActionConst} from 'react-native-router-flux';
const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
const domain = 'http://hai-van.local';
class LichSu extends Component {

	constructor(props) {
      super(props);
		this.state = {
			loading: true,
			results: '',
			loadingOrder: false,
			trungChuyen: false,
			address: '',
			trungChuyen: false,
			selectCheckbox: 'borderCheckbox'
		};
   }

	_renderOrder() {
		let dBook = this.props.data.dataBook;
		let html = [];
		let totalHtml = [];
		let total = 0;
		for(var i = 0; i < dBook.length; i++) {
			total += dBook[i].bvv_price;
			let newPrice = dBook[i].bvv_price.toFixed(0).replace(/./g, function(c, i, a) {
				return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			});
			html.push(
				<CardItem key={i}>
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 4, alignItems: 'flex-start'}}>
							<Text>{this.props.data.dataBen[dBook[i].bvv_bex_id_a]} -> {this.props.data.dataBen[dBook[i].bvv_bex_id_b]}</Text>
							<Text>Số Ghế: {dBook[i].numberGiuong}</Text>
							<Text>Số Lượng: 1</Text>
						</View>
						<View style={{flex: 3, alignItems: 'flex-end'}}>
							<Text style={{fontWeight: 'bold'}}>{newPrice} VNĐ</Text>
						</View>
					</View>
				</CardItem>
			);
		}

		let newTotalPrice = total.toFixed(0).replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
		totalHtml.push(
			<CardItem key="totalprice">
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Text></Text>
					</View>
					<View style={{flex: 1}}>
						<Text></Text>
					</View>
					<View style={{flex: 2}}>
						<Text>Tổng Tiền</Text>
					</View>
					<View style={{flex: 4, alignItems: 'flex-end'}}>
						<Text style={{fontWeight: 'bold', color: 'red'}}>{newTotalPrice} VNĐ</Text>
					</View>
				</View>
			</CardItem>
		);
		return(
			<Container>
				<Content style={styles.wrapOrder}>
					<Card style={{width: widthDevice}}>
						<CardItem>
							<View>
								<Text style={{fontSize: 20}}>Đơn hàng</Text>
							</View>
						</CardItem>

						<CardItem>
							<View>
								<Text>Họ tên: <Text style={styles.fontBold}>{this.props.data.dataUser.use_gmail}</Text></Text>
								<Text>Số điện thoại: {this.props.data.dataUser.use_phone}</Text>
								<Text>Giờ xuất bến: <Text style={styles.fontBold}>{this.props.data.gio_xuat_ben}</Text></Text>
							</View>
						</CardItem>

						<CardItem>
							<View style={{flexDirection: 'row'}}>
								<View style={{flex: 4}}>
									<Text>Nơi đi -> Nơi đến</Text>
								</View>
								<View style={{flex: 3, alignItems: 'flex-end'}}>
									<Text>Giá</Text>
								</View>
							</View>
						</CardItem>
						{html}
						{totalHtml}
						<CardItem>
							<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
								<View style={{flex: 1}}>
									<Text>Chúng tôi có dịch vụ xe trung chuyển đón tại nhà MIỄN PHÍ.</Text>
								</View>
								<View style={{flexDirection: 'row', marginTop: 10}}>
									<TouchableOpacity onPress={() => this._handleCheckBox()} style={{flex: 1}}>
										<View style={[styles[this.state.selectCheckbox], {width: 20, height: 20, borderRadius: 100, borderWidth: 1}]}></View>
								  </TouchableOpacity>
								  <Text style={{flex: 6}}>Có sử dụng dịch vụ trung chuyển tại nhà</Text>
								</View>
								{this.state.trungChuyen &&
									<InputGroup key="group_address">
										<Icon name='ios-pin' />
										<Input placeholder="Địa chỉ cần đón" onChange={(event) => this.setState({address: event.nativeEvent.text})} />
									</InputGroup>
								}
								{this.state.loadingOrder? <Spinner /> : <Button block success onPress={() => this._handleSaveOrder()} style={{marginTop: 10}}>Thanh Toán</Button>}
							</View>
						</CardItem>
					</Card>
				</Content>
			</Container>
		);
	}

	_handleCheckBox() {
		if(this.state.selectCheckbox == 'borderCheckbox') {
			this.setState({
				selectCheckbox: 'borderCheckboxActive',
				trungChuyen: true
			});
		}else {
			this.setState({
				selectCheckbox: 'borderCheckbox',
				trungChuyen: false
			});
		}
	}

	_handleSaveOrder() {
		let dataBook = JSON.stringify(this.props.data.dataBook);
		let that = this;
		that.setState({
			loadingOrder: true
		});
		let params = 'type=insert&bvv_bvn_id='+this.props.data.id_dieu_do+'&user_id='+this.props.data.dataUser.adm_id+'&gio_xuat_ben='+JSON.stringify(this.props.data.gio_xuat_ben)+'&dataBook='+dataBook+'&address='+this.state.address;
		fetch(domain+'/api/api_user_save_order.php?'+params)
		.then((response) => response.json())
		.then((responseJson) => {
			that.setState({
				loadingOrder: false
			});
			Actions.Checkout({title: 'Thanh Toán', data: {adm_id: this.props.data.dataUser.adm_id}});
		})
		.catch((error) => {
			console.error(error);
		});
	}

   render() {

      return(
			<View style={styles.container}>
				{this._renderOrder()}
			</View>
      );
   }
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59,
		height: heightDevice,
		paddingBottom: 50
	},
   marginButton: {
      marginTop: 10
   },
   paddingContent: {
      padding: 30
   },
	fontBold: {
		fontWeight: 'bold'
	},
	borderCheckbox: {
		borderColor: '#e9967a'
	},
	borderCheckboxActive: {
		borderColor: '#e9967a',
		backgroundColor: '#e9967a'
	},
});

export default LichSu
