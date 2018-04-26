import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	AsyncStorage,
	KeyboardAvoidingView
} from 'react-native';
import PropTypes from 'prop-types';
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
			price: 0,
			// arrKM: [{ key: 6, value: 'Mã khuyến mại' }, { key: 7, value: 'Giá vé linh hoạt' }],
			arrKM: [{ key: 0, value: 'Hình thức KM' }, { key: 4, value: 'Trẻ em' }, { key: 6, value: 'Mã khuyến mại' }],
			key_KM: 0,
			nameKM: '',
			dBook: [],
			index: -1,
			mesKM: '',
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
			key_KM: 7,
			// nameKM: 'Giá vé linh hoạt',
			dBook: this.props.data.dataBook
		});
	}

	_renderOrder() {
		let dBook = this.state.dBook;
		let html = [];
		let htmlKM = [];
		let htmlpriceDiscount = [];
		let totalHtml = [];
		let total = 0;
		let totaldisPrice = 0;
		let codeKM = this.state.codeKM;
		let showPriceDiscount = false;
		let newPrice = 0;
		let newDiscount = 0;
		let currentKM = '';
		let key_KM = 0;
		let diemdi = '';
		let diemden = '';
		console.log('ma kM');
		console.log(this.state.mesKM);

		if (this.state.nameKM != '') {
			currentKM = this.state.nameKM;
		}
		// else {
		// 	currentKM = this.state.arrKM[this.state.arrKM.length - 1].value;
		// 	this.state.nameKM = currentKM;
		// }

		if (this.state.key_KM > 0) {
			key_KM = this.state.key_KM;
		}
		// else {
		// 	key_KM = this.state.arrKM[this.state.arrKM.length - 1].key;
		// 	this.state.key_KM = key_KM;
		// }

		// if (key_KM == 6) {
		// 	htmlKM.push(
		// 		<CardItem key="km">
		// 			<TouchableOpacity key="1" onPress={() => this._showListCodeKM()} style={{ flexDirection: 'row' }}>
		// 				<Text style={{ textAlign: 'left', textAlignVertical: 'center' }}>
		// 					{codeKM == '' ? 'Nhập mã khuyến mại' : codeKM}
		// 				</Text>
		// 			</TouchableOpacity>
		// 		</CardItem>
		// 	);
		// }
		// else {
		// 	showPriceDiscount = false;
		// }

		for (let i = 0; i < dBook.length; i++) {

			// let newPrice = dBook[i].bvv_price_ly_thuyet.toFixed(0).replace(/./g, function (c, i, a) {
			// 	return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			// });
			diemdi = dBook[0].bvv_bex_id_a;
			diemden = dBook[0].bvv_bex_id_b;
			newPrice = dBook[i].bvv_price_ly_thuyet;
			newDiscount = dBook[i].bvv_price_discount
			total += dBook[i].bvv_price_ly_thuyet;
			let rPrive = (newPrice - newDiscount) > this.props.data.priceMin ? (newPrice - newDiscount) : this.props.data.priceMin;
			totaldisPrice += newPrice - rPrive;

			if (dBook[i].hinh_thuc_KM > 0) {
				showPriceDiscount = true
			}

			html.push(
				<CardItem key={i}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 4, alignItems: 'flex-start' }}>
							{/* <Text>{this.props.data.dataBen[dBook[i].bvv_bex_id_a]} -> {this.props.data.dataBen[dBook[i].bvv_bex_id_b]}</Text> */}
							<Text style={{ color: '#3561BF' }}>{dBook[i].labelFull}</Text>
							{/* <Text>Số Lượng: 1</Text> */}
						</View>
						<View style={{ flexDirection: 'row', flex: 3, alignItems: 'flex-end' }}>
							<View style={{ flex: 4, alignItems: 'flex-start' }}>
								<Text style={{ fontWeight: 'bold' }}>{' '}</Text>
								<Text style={{ fontWeight: 'bold' }}>{'Giảm '}</Text>
								<Text style={{ fontWeight: 'bold' }}>{'Còn '}</Text>
							</View>
							<View style={{ flex: 9, alignItems: 'flex-end' }}>
								<Text style={{ fontWeight: 'bold' }}>{Common.formatPrice(newPrice)} VNĐ</Text>
								<Text style={{ fontWeight: 'bold' }}>{Common.formatPrice(newDiscount)} VNĐ</Text>
								<Text style={{ fontWeight: 'bold' }}>{Common.formatPrice(rPrive)} VNĐ</Text>
							</View>
						</View>
					</View>

					<TouchableOpacity onPress={() => this._showKM(i)} >
						<View style={styles.form_mdp_discount}>
							<Icon style={styles.form_update_icon} name="ios-menu" />
							<Text style={styles.form_mdp_label}>KM:</Text>
							<Text style={{ textAlignVertical: 'center', paddingLeft: 10 }}>{this.state.dBook[i].name_KM == '' ? 'Hình thức KM' : this.state.dBook[i].name_KM}</Text>
						</View>
					</TouchableOpacity>

					{/* {(dBook[i].hinh_thuc_KM == 6) &&
						<TouchableOpacity key="1" onPress={() => this._showListCodeKM(i)} style={{ flexDirection: 'row' }}>
							<Text style={{ textAlign: 'left', textAlignVertical: 'center' }}>
								{this.state.dBook[i].code_KM == '' ? 'Nhập mã khuyến mại' : this.state.dBook[i].code_KM}
							</Text>
						</TouchableOpacity>
					} */}

					{(dBook[i].hinh_thuc_KM == 6) &&
						<View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 3, borderWidth: 1, borderRadius: 10, marginRight: 5 }} >
									<Input
										placeholder="Nhập mã khuyến mại"
										onChange={(event) => this.setState({ codeKM: event.nativeEvent.text })}
									/>
								</View>
								<View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginLeft: 5, backgroundColor: '#5cb85c', borderColor: '#5cb85c' }} >
									<TouchableOpacity key="1" onPress={() => this.checkCodeKM(i)} style={{ flex: 1, justifyContent: 'center' }}>
										<Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>
											Sử dụng
										</Text>
									</TouchableOpacity>
								</View>
							</View>
							{(this.state.mesKM != null) && (this.state.mesKM != '') &&
								<Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'red', margin: 5 }}>
									{this.state.mesKM}
								</Text>
							}
						</View>
					}
				</CardItem>
			);
		}

		// let newTotalPrice = (total - this.state.priceDiscount).toFixed(0).replace(/./g, function (c, i, a) {
		// 	return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		// });

		let newTotalPrice = Common.formatPrice(total - totaldisPrice);

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
							<Text style={{ fontWeight: 'bold', color: 'red' }}>{Common.formatPrice(totaldisPrice)} VNĐ</Text>
						</View>
					</View>
				</CardItem>
			);
		}

		return (
			<KeyboardAvoidingView
				behavior="padding"
				style={{ padding: 20 }}>
				<ScrollView keyboardShouldPersistTaps="never">
					<Card style={{ width: this.state.widthDevice }}>
						<CardItem>
							<View>
								<Text style={{ fontSize: 20 }}>Đơn hàng</Text>
							</View>
						</CardItem>

						<CardItem>
							<View>
								<Text>Nơi đi -> Nơi đến: <Text style={styles.fontBold}>{this.props.data.dataBen[diemdi]} -> {this.props.data.dataBen[diemden]}</Text></Text>
								<Text>Họ tên: <Text style={styles.fontBold}>{this.props.data.dataUser.adm_fullname}</Text></Text>
								<Text>Số điện thoại: <Text style={styles.fontBold}>{this.props.data.dataUser.use_phone}</Text></Text>
								<Text>Giờ xuất bến: <Text style={styles.fontBold}>{this.props.data.gio_xuat_ben}</Text></Text>
								<Text>Số chỗ đã đặt: <Text style={styles.fontBold}>{dBook.length}</Text></Text>
							</View>
						</CardItem>

						<CardItem>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 4 }}>
									<Text>Số ghế</Text>
								</View>
								<View style={{ flex: 3, alignItems: 'flex-end' }}>
									<Text>Giá</Text>
								</View>
							</View>
						</CardItem>

						{html}

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
			</KeyboardAvoidingView>
		);
	}

	async _showKM(i) {
		this.state.index = i;
		this.openModalKM();
	}

	openModalKM(id) {
		this.refs.modalKM.open();
	}

	closeModalKM(id) {
		this.state.index = -1;
		this.refs.modalKM.close();
	}

	async checkCodeKM(index) {
		// gửi mã km lên và lấy id, price_dis về
		let codeKM = this.state.codeKM,
			discount = 0;

		try {
			let dataBook = this.state.dBook;
			// let index = this.state.index;

			if (index >= 0) {
				let flag = true;

				for (let i = 0; i < dataBook.length; i++) {
					if (dataBook[i].code_KM == codeKM && (i != index))
						flag = false
				}

				if (flag) {
					let params = {
						token: this.state.infoAdm.token,
						user_id: this.state.infoAdm.adm_id,
						did_id: this.props.data.id_dieu_do,
						diem_di: dataBook[index].bvv_bex_id_a,
						diem_den: dataBook[index].bvv_bex_id_b,
						bvv_id: dataBook[index].bvv_id,
						giam_gia_text: codeKM,
					}

					let data = await fetchData('api_get_discount_code', params, 'GET');

					if (data.status == 404) {
						// alert(data.mes);
						this.setState({
							mesKM: data.mes,
						})
					} else if (data.status != 200) {
						this.setState({
							mesKM: data.mes,
						})
					} 
					else if (data.status == 200) {
						dataBook[index].bvv_price_discount = data.price_discount;
						dataBook[index].code_KM = codeKM;
						// dataBook[this.state.index].key_KM = data.id;
						discount = data.price_discount;
						this.setState({
							mesKM: '',
						})
					}
				} else {
					// alert('Mã khuyến mãi đã dùng');
					this.setState({
						mesKM: 'Mã khuyến mãi đã dùng',
					})
				}
			}

			this.setState({
				priceDiscount: discount,
				// id_km: id,
				codeKM: codeKM,
				showPriceDiscount: true,
				loading: false,
				price: this.props.data.rootPrice,
				dBook: dataBook
			});

		} catch (error) {

		}
	}

	async _showListCodeKM(index) {
		var sttInternet = await Common.checkServerAlive();
		// this.setState({
		// 	sttInternet: sttInternet,
		// });

		this.state.sttInternet = sttInternet;
		this.state.index = index;

		if (sttInternet != false) {
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
					// Actions.welcome({ type: 'reset' });
				} else if (data1.status == 200) {
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
		// let dataBook = JSON.stringify(this.props.data.dataBook);
		let dataBook = JSON.stringify(this.state.dBook);
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
				diem_di: this.state.dBook[0].bvv_bex_id_a,
				diem_den: this.state.dBook[0].bvv_bex_id_b,
			}

			let data = await fetchData('user_save_order', params, 'GET');
			if (data.status != 404) {
				if (data.status == 200) {
					Actions.Payment({ title: 'Thanh Toán', data: { adm_name: this.props.data.dataUser.adm_name, last_login: this.props.data.dataUser.last_login, adm_id: this.props.data.dataUser.adm_id, orderId: data.orderId } });
					// Actions.home({ type: 'reset' });
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

	async _renderCodeKMActive(discount, id, code) {
		let dataBook = this.state.dBook;
		let index = this.state.index;

		// let i = this.state.index;
		// let priceDiscount = discount;

		if (this.state.index >= 0) {
			let flag = true;
			for (let i = 0; i < dataBook.length; i++) {
				if (dataBook[i].code_KM == code && (i != index))
					flag = false
			}

			if (flag) {
				let params = {
					token: this.state.infoAdm.token,
					user_id: this.state.infoAdm.adm_id,
					did_id: this.props.data.id_dieu_do,
					diem_di: dataBook[index].bvv_bex_id_a,
					diem_den: dataBook[index].bvv_bex_id_b,
					bvv_id: dataBook[index].bvv_id,
					giam_gia_id: id,
				}

				let data = await fetchData('api_get_discount_code', params, 'GET');

				if (data.status == 404) {
					alert(data.mes);
				} else if (data.status == 200) {
					dataBook[this.state.index].bvv_price_discount = data.price_discount;
					dataBook[this.state.index].code_KM = code;
					// dataBook[this.state.index].key_KM = id;
					// console.log(data);
				}
			} else {
				alert('Mã khuyến mãi đã dùng');
			}
		}

		// while (priceDiscount > 0) {
		// 	if (dataBook[i].bvv_price_ly_thuyet - priceDiscount > Number(this.props.data.priceMin)) {
		// 		dataBook[i].bvv_price_discount = priceDiscount;
		// 	} else {
		// 		dataBook[i].bvv_price_discount = dataBook[i].bvv_price_ly_thuyet - Number(this.props.data.priceMin);
		// 	}

		// 	priceDiscount = priceDiscount - dataBook[i].bvv_price_discount;
		// 	i++;
		// }

		// for (let i = 0; i < dataBook.length; i++) {
		// 	if (dataBook[i].bvv_price_ly_thuyet - discount > this.props.data.priceMin) {
		// 		dataBook[i].priceDiscount = discount;
		// 	}
		// }

		this.setState({
			priceDiscount: discount,
			id_km: id,
			codeKM: code,
			showPriceDiscount: true,
			loading: false,
			price: this.props.data.rootPrice,
			dBook: dataBook
		});

		this.closeModalListCodeKM();
	}

	render() {
		return (
			<View style={[styles.container, { height: this.state.height }]} onLayout={this._onLayout}>
				{this._renderOrder()}
				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalKM"} isDisabled={this.state.isDisabled}>
					{this._renderModalKM()}
				</Modal>
				<Modal style={[styles.modal, styles.wrapPopup, { height: this.state.layout.height }]} position={"center"} ref={"modalListCodeKM"} isDisabled={this.state.isDisabled}>
					{this._renderModalListCodeKM()}
				</Modal>
			</View>
		);
	}

	_renderModalKM() {
		var htmlKM = [];
		let arrKM = this.state.arrKM;
		let countData = arrKM.length;
		var itemKM = {};

		for (var i = 0; i < countData; i++) {
			itemKM = arrKM[i];
			let keyKM = itemKM.key;
			htmlKM.push(
				<CardItem key={'km_' + i} style={{ shadowOpacity: 0, shadowColor: 'red', paddingTop: 10 }} onPress={() => this._renderKMActive(keyKM)} >
					<View>
						<Text>{itemKM.value}</Text>
					</View>
				</CardItem>
			);
		}

		return (
			<View key="1" style={{ width: this.state.layout.width, height: this.state.layout.height, paddingTop: 10, position: 'relative', paddingBottom: 120 }}>

				<View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalKM()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View>

				<ScrollView style={{ width: this.state.layout.width }} keyboardShouldPersistTaps="always">
					<Card key="group_card_km" style={{ marginTop: 0 }}>{htmlKM}</Card>
				</ScrollView>
			</View>
		)
	}

	async _renderKMActive(key) {
		let nameKM = '';
		var dataKM = this.state.arrKM;
		let index = this.state.index;
		this.state.dBook[index].bvv_price_discount = 0;
		this.state.dBook[index].code_KM = '';
		// this.state.dBook[index].key_KM = '';

		for (let i = 0; i < dataKM.length; i++) {
			if (dataKM[i].key == key)
				nameKM = dataKM[i].value;
		}

		// trẻ em
		if (index >= 0) {
			this.state.dBook[index].hinh_thuc_KM = key;
			this.state.dBook[index].name_KM = nameKM;

			if (key == 4) {
				this.state.dBook[index].bvv_price_discount = this.state.dBook[index].bvv_price_ly_thuyet / 2;

				try {
					let params = {
						token: this.state.infoAdm.token,
						user_id: this.state.infoAdm.adm_id,
						did_id: this.props.data.id_dieu_do,
						diem_di: this.state.dBook[index].bvv_bex_id_a,
						diem_den: this.state.dBook[index].bvv_bex_id_b,
						bvv_id: this.state.dBook[index].bvv_id,
					}

					let data = await fetchData('api_get_discount_children', params, 'GET');

					if (data.status == 404) {
						alert(data1.mes);
						// Actions.welcome({ type: 'reset' });
					} else if (data.status == 200) {
						this.state.dBook[index].bvv_price_discount = data.price_discount;
					}
				} catch (error) {
					console.log(error);
				}
			}

			if (key == 0) {
				this.state.index = -1;
			}
		}

		this.setState({
			// key_KM: key,
			// nameKM: nameKM,
			loading: false,
			// priceDiscount: 0,
			// codeKM: '',
			// id_km: '',
		});

		this.closeModalKM();
		return key;
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

	form_mdp_content: {
		flexDirection: 'row', alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 5,
		paddingTop: 5, paddingBottom: 5
	},

	form_mdp_discount: {
		flexDirection: 'row', alignItems: 'center', marginLeft: 5,
		paddingTop: 5, paddingBottom: 5
	},

	form_update_icon: {
		marginLeft: 0,
		marginTop: 5
	},

	form_mdp_label: {
		marginLeft: 5, color: '#666'
	},
});

export default LichSu
