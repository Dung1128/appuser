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
import { domain, cache, net } from '../../Config/common';
import fetchData from '../../Components/FetchData';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge, CheckBox, List, ListItem } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import StorageHelper from '../../Components/StorageHelper';
import Modal from 'react-native-modalbox';
import Common from '../../Components/Common';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
class LichSu extends Component {

	constructor(props) {
		super(props);
		this.state = {
			layout: {
				height: heightDevice,
				width: widthDevice
			},
			sttInternet: false,
			width: widthDevice,
			height: heightDevice,
			loading: true,
			results: '',
			loadingOrder: false,
			trungChuyen: false,
			address: '',
			trungChuyen: false,
			selectCheckbox: 'borderCheckbox',
			ghi_chu: '',
			token: '',
			infoAdm: [],
			arrCodeDiscount: [],
			isDisabled: false,
			priceDiscount: 0,
			id_km: '',
			codeKM: '',
			showPriceDiscount: false,
		};
	}

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let token = results.token;
		this.setState({
			infoAdm: results,
			token: token,
			data: this.props.data,
		});

	}

	_renderOrder() {
		let dBook = this.props.data.dataBook;
		let html = [];
		let htmlpriceDiscount = [];
		let totalHtml = [];
		let total = 0;
		let codeKM = this.state.codeKM;
		let showPriceDiscount = this.state.showPriceDiscount;

		for (var i = 0; i < dBook.length; i++) {
			total += dBook[i].bvv_price;
			// let newPrice = dBook[i].bvv_price.toFixed(0).replace(/./g, function (c, i, a) {
			// 	return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			// });

			let newPrice = Common.formatPrice(dBook[i].bvv_price);

			html.push(
				<CardItem key={i}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 4, alignItems: 'flex-start' }}>
							<Text>{this.props.data.dataBen[dBook[i].bvv_bex_id_a]} -> {this.props.data.dataBen[dBook[i].bvv_bex_id_b]}</Text>
							<Text>Số Ghế: {dBook[i].labelFull}</Text>
							<Text>Số Lượng: 1</Text>
						</View>
						<View style={{ flex: 3, alignItems: 'flex-end' }}>
							<Text style={{ fontWeight: 'bold' }}>{newPrice} VNĐ</Text>
						</View>
					</View>
				</CardItem>
			);
		}

		// let newTotalPrice = (total - this.state.priceDiscount).toFixed(0).replace(/./g, function (c, i, a) {
		// 	return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		// });

		let newTotalPrice = Common.formatPrice(total - this.state.priceDiscount);

		totalHtml.push(
			<CardItem key="totalprice">
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1 }}>
						<Text></Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text></Text>
					</View>
					<View style={{ flex: 2 }}>
						<Text>Tổng Tiền</Text>
					</View>
					<View style={{ flex: 4, alignItems: 'flex-end' }}>
						<Text style={{ fontWeight: 'bold', color: 'red' }}>{newTotalPrice} VNĐ</Text>
					</View>
				</View>
			</CardItem>
		);

		if (showPriceDiscount) {
			htmlpriceDiscount.push(
				<CardItem key="totalprice">
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<Text></Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text></Text>
						</View>
						<View style={{ flex: 2 }}>
							<Text>Số tiền giảm</Text>
						</View>
						<View style={{ flex: 4, alignItems: 'flex-end' }}>
							<Text style={{ fontWeight: 'bold', color: 'red' }}>{Common.formatPrice(this.state.priceDiscount)} VNĐ</Text>
						</View>
					</View>
				</CardItem>
			);
		}

		return (
			<View>
				<ScrollView keyboardShouldPersistTaps="always">
					<Card style={{ width: this.state.widthDevice }}>
						<CardItem>
							<View>
								<Text style={{ fontSize: 20 }}>Đơn hàng</Text>
							</View>
						</CardItem>

						<CardItem>
							<View>
								<Text>Họ tên: <Text style={styles.fontBold}>{this.props.data.dataUser.adm_fullname}</Text></Text>
								<Text>Số điện thoại: <Text style={styles.fontBold}>{this.props.data.dataUser.use_phone}</Text></Text>
								<Text>Giờ xuất bến: <Text style={styles.fontBold}>{this.props.data.gio_xuat_ben}</Text></Text>
							</View>
						</CardItem>

						<CardItem>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 4 }}>
									<Text>Nơi đi -> Nơi đến</Text>
								</View>
								<View style={{ flex: 3, alignItems: 'flex-end' }}>
									<Text>Giá</Text>
								</View>
							</View>
						</CardItem>

						{html}

						<CardItem>
							<TouchableOpacity key="1" onPress={() => this._showListCodeKM()} style={{ flexDirection: 'row' }}>
								<Text style={{ textAlign: 'left', textAlignVertical: 'center' }}>
									{codeKM == '' ? 'Nhập mã khuyến mại' : codeKM}
								</Text>
							</TouchableOpacity>
						</CardItem>

						{htmlpriceDiscount}

						{totalHtml}

						<CardItem>
							<View style={{ flexDirection: 'column' }}>
								<View style={{ flex: 1 }}>
									<Text>Chúng tôi có dịch vụ xe trung chuyển đón tại nhà MIỄN PHÍ.</Text>
								</View>
								<View style={{ flexDirection: 'row', marginTop: 10, overflow: 'hidden', marginBottom: 20 }}>
									<TouchableOpacity onPress={() => this._handleCheckBox()} style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, width: widthDevice, height: 50 }}></TouchableOpacity>
									<View style={{ flex: 1 }}>
										<View style={[styles[this.state.selectCheckbox], { width: 20, height: 20, borderRadius: 100, borderWidth: 1 }]}></View>
									</View>
									<Text style={{ flex: 7, color: 'red' }}>Bạn có muốn sử dụng dịch vụ trung chuyển tại nhà</Text>
								</View>
								{this.state.trungChuyen &&
									<InputGroup key="group_address">
										<Icon name='ios-pin' />
										<Input placeholder="Địa chỉ cần đón" onChange={(event) => this.setState({ address: event.nativeEvent.text })} />
									</InputGroup>
								}

								<InputGroup key="group_ghi_chu">
									<Icon name='md-text' />
									<Input placeholder="Ghi chú" onChange={(event) => this.setState({ ghi_chu: event.nativeEvent.text })} />
								</InputGroup>
								{this.state.loadingOrder ? <Spinner /> : <Button block success onPress={() => this._handleSaveOrder()} style={{ marginTop: 10, height: 50 }}>Thanh Toán</Button>}
							</View>
						</CardItem>
					</Card>
				</ScrollView>
			</View>
		);
	}

	async _showListCodeKM() {
		var sttInternet = await Common.checkServerAlive();
		this.setState({
			sttInternet: sttInternet,
		});

		if (this.state.sttInternet != false) {
			try {

				let body = {
					token: this.state.infoAdm.token,
					adm_id: this.state.infoAdm.adm_id,
					did_id: this.props.data.id_dieu_do,
					diem_di: this.props.data.dataBook[0].bvv_bex_id_a,
					diem_den: this.props.data.dataBook[0].bvv_bex_id_b,
				}

				let data1 = await fetchData('api_get_list_discount', body, 'GET');

				if (data1.status == 404) {
					alert(data1.mes);
					Actions.welcome({ type: 'reset' });
				} else if (data1.status == 200) {
					console.log('list ma khuyen mai');
					console.log(data1);
					this.setState({
						arrCodeDiscount: Object.values(data1.data)
					});
					if (this.state.arrCodeDiscount.length == 0) {
						alert('Không có mã khuyến mãi');
					}
					else {
						this.openModalListCodeKM();
					}
				}

			} catch (error) {
				console.log(error);
			}
		}
		else {
			alert('Kết nối mạng lỗi, vui lòng kiểm tra kết nối');
		}
	}

	openModalListCodeKM(id) {
		this.refs.modalListCodeKM.open();
	}

	closeModalListCodeKM(id) {
		this.refs.modalListCodeKM.close();
	}

	_handleCheckBox() {
		if (this.state.selectCheckbox == 'borderCheckbox') {
			this.setState({
				selectCheckbox: 'borderCheckboxActive',
				trungChuyen: true
			});
		} else {
			this.setState({
				selectCheckbox: 'borderCheckbox',
				trungChuyen: false
			});
		}
	}

	async _handleSaveOrder() {
		let dataBook = JSON.stringify(this.props.data.dataBook);
		let that = this;
		this.setState({
			loadingOrder: true
		});

		try {
			let params = {
				token: this.state.token,
				type: 'insert',
				did_id: this.props.data.id_dieu_do,
				user_id: this.props.data.dataUser.adm_id,
				gio_xuat_ben: this.props.data.gio_xuat_ben,
				dataBook: dataBook,
				address: this.state.address,
				ghi_chu: this.state.ghi_chu,
				km_id: this.state.id_km,
				diem_di: this.props.data.dataBook[0].bvv_bex_id_a,
				diem_den: this.props.data.dataBook[0].bvv_bex_id_b,

			}
			let data = await fetchData('user_save_order', params, 'GET');
			if (data.status != 404) {
				if (data.status == 200) {
					Actions.Payment({ title: 'Thanh Toán', data: { adm_name: this.props.data.dataUser.adm_name, last_login: this.props.data.dataUser.last_login, adm_id: this.props.data.dataUser.adm_id, orderId: data.orderId } });
				}
			} else if (data.status == 404) {
				alert(data.mes);
				Actions.welcome({ type: 'reset' });
			}
			this.setState({
				loadingOrder: false
			});
		} catch (e) {
			console.log(e);
			this.setState({
				loadingOrder: false
			});
		}

	}

	_onLayout = event => {
		let heightDevice = Dimensions.get('window').height;
		let widthDevice = Dimensions.get('window').width;
		this.setState({
			height: heightDevice,
			width: widthDevice
		});
	}

	_renderModalListCodeKM() {
		var htmlListCodeKM = [];
		let arrCodeKM = this.state.arrCodeDiscount;
		let countData = arrCodeKM.length;
		// var itemCodeKM = '';
		for (var i = 0; i < arrCodeKM.length; i++) {
			let itemCodeKM = arrCodeKM[i];
			htmlListCodeKM.push(
				<CardItem key={'codeKm_' + i} style={{ shadowOpacity: 0, shadowColor: 'red' }} onPress={() => this._renderCodeKMActive(itemCodeKM.price_dis, itemCodeKM.id, itemCodeKM.code)} >
					<View>
						<Text>{itemCodeKM.code}</Text>
					</View>
				</CardItem>
			);
		}

		return (
			<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

				<View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalListCodeKM()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View>

				<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
					<Card key="group_card_bx" style={{ marginTop: 0 }}>{htmlListCodeKM}</Card>
				</ScrollView>
			</View>
		)
	}

	_renderCodeKMActive(discount, id, code) {
		this.setState({
			priceDiscount: discount,
			id_km: id,
			codeKM: code,
			showPriceDiscount: true,
			loading: false
		});

		this.closeModalListCodeKM();
	}

	render() {
		return (
			<View style={[styles.container, { height: this.state.height }]} onLayout={this._onLayout}>
				{this._renderOrder()}
				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalListCodeKM"} isDisabled={this.state.isDisabled}>
					{this._renderModalListCodeKM()}
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59
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
	modal: {
		alignItems: 'center'
	},
	wrapPopup: {
		paddingTop: 60
	},

});

export default LichSu
