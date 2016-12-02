import React, { Component, PropTypes } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	AsyncStorage,
	TabBarIOS,
	View,
	ScrollView,
	TouchableHighlight,
	Alert
} from 'react-native';
import { Container, Content, Header, Title, Text, Icon, Button, Card, CardItem, Spinner, Badge } from 'native-base';
import {Actions} from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
const domain = 'http://haivanexpress.com';
class ViewSoDoGiuong extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			results: [],
			isOpen: false,
			isDisabled: false,
			nameDiemDi: '',
			nameDiemDen: '',
			keyDiemDi: '',
			keyDiemDen: '',
			nameGiuong: '',
			resultsBen: [],
			priceTotal: 0,
			arrVeNumber: [],
			currentIdGiuong: 0,
			totalPriceInt: 0,
			bvv_id_can_chuyen: 0,
			bvv_bvn_id_muon_chuyen: 0,
			bvv_number_muon_chuyen: 0,
			type: '',
			infoAdm: [],
			notifiCountDanhSachCho: 0,
			chuyenVaoCho: this.props.data.chuyenVaoCho,
			arrBen: [],
			arrOrder: [],
			checkout: false,
			dataBook: [],
			arrBookGiuong: []
		};
	}

	infoAdm() {
		var that = this;
		AsyncStorage.getItem('infoAdm').then((data) => {
			let results = JSON.parse(data);
			that.setState({
				infoAdm: results
			});
		}).done();
	}

	componentDidMount() {
		this.infoAdm();
		var that = this;
		that.setState({
			loading: true
		});
		// setTimeout(() => {
			fetch(domain+'/api/api_adm_so_do_giuong.php?not_id='+this.props.data.notId+'&day='+this.props.data.day)
			.then((response) => response.json())
			.then((responseJson) => {
				that.setState({
					results:responseJson.so_do_giuong,
					arrVeNumber: responseJson.so_do_giuong.arrVeNumber,
					notifiCountDanhSachCho: responseJson.total_danh_sach_cho,
					arrBen: responseJson.arrBen,
					resultsBen: responseJson.arrBen,
					arrOrder: responseJson.so_do_giuong.arrOrder,
					loading: false
				});
				return responseJson.so_do_giuong;
			})
			.catch((error) => {
				that.setState({
					loading: true
				});
				console.error(error);
			});
		// },800);
	}

	_renderSoDoGiuong(data, tang) {
		let html = [],
		dataTang = [];
		switch (tang) {
			case 1:
			dataTang = data.arrChoTang_1;
			break;
			case 2:
			dataTang = data.arrChoTang_2;
			break;
			case 3:
			dataTang = data.arrChoTang_3;
			break;
			case 4:
			dataTang = data.arrChoTang_4;
			break;
			case 5:
			dataTang = data.arrChoTang_5;
			break;
			default:
		}
		if(dataTang != undefined) {
			for(var i = 1; i <= Object.keys(dataTang).length; i++) {
				var item = dataTang[i];
				var htmlChild = [];
				for(var j = 1; j <= Object.keys(item).length; j++) {
					var idGiuong = item[j].sdgct_number;
					var dataGiuong = this.state.arrVeNumber[idGiuong];

					if(dataGiuong.bvv_status == -1) {
						htmlChild.push(
							<Col key={i+j} style={styles.borderCol}>
								<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuongUser, styles.opacityBg]}>
									<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
								</TouchableOpacity>
							</Col>
						);
					}else {
						if(dataGiuong.bvv_status == -2) {
							htmlChild.push(
								<Col key={i+j} style={styles.borderCol}>
									<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
										<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
									</TouchableOpacity>
								</Col>
							);
						}else {
							if(dataGiuong.bvv_status == 0) {

								if(this.state.arrOrder[idGiuong] == undefined) {
									htmlChild.push(
										<Col key={i+j} style={styles.borderCol}>
											<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
												<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
											</TouchableOpacity>
										</Col>
									);
								}else {
									if(this.state.arrOrder[idGiuong].ord_status >= 0) {
										if(this.state.arrOrder[idGiuong].ord_khach_hang_id == this.state.infoAdm.adm_id) {
											htmlChild.push(
												<Col key={i+j} style={styles.borderCol}>
													<TouchableOpacity onPress={this._unsetActiveGiuong.bind(this, idGiuong)} style={[styles.activeGiuongUser, styles.opacityBg]}>
														<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
													</TouchableOpacity>
												</Col>
											);
										}else {
											htmlChild.push(
												<Col key={i+j} style={styles.borderCol}>
													<TouchableOpacity style={[styles.activeGiuong, styles.opacityBg]}>
														<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
													</TouchableOpacity>
												</Col>
											);
										}
									}else if(this.state.arrOrder[idGiuong].ord_status >= 0 && dataGiuong.bvv_status == 0) {
										htmlChild.push(
											<Col key={i+j} style={styles.borderCol}>
												<TouchableOpacity onPress={this._setActiveGiuong.bind(this, idGiuong)} style={styles.opacityBg}>
													<Text style={styles.textCenter}>{item[j].sdgct_label_full}</Text>
												</TouchableOpacity>
											</Col>
										);
									}
								}
							}else {
								htmlChild.push(
									<Col key={i+j} style={styles.borderCol}>
										<TouchableOpacity style={[styles.activeGiuong, styles.opacityBg]}>
											<Text style={[styles.textCenter, styles.textActiveGiuong]}>{item[j].sdgct_label_full}</Text>
										</TouchableOpacity>
									</Col>
								);
							}
						}
					}
				}
				html.push(<Grid key={i}>{htmlChild}</Grid>);
			}
		}
		return html;
	}

	_setActiveGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[id];

		this.getPriceBen(dataGiuong.bvv_bex_id_a, dataGiuong.bvv_bex_id_b, dataGiuong.bvv_id);
		this.setState({
			nameGiuong: id,
			type: '',
			bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
			bvv_number_muon_chuyen: dataGiuong.bvv_number,
			totalPriceInt: this.state.totalPriceInt
		});
		this.openModal();
	}

	_unsetActiveGiuong(id){
		let dataGiuong = this.state.arrVeNumber[id];
		this.setState({
			currentIdGiuong: id,
			bvv_id_can_chuyen: 0,
			bvv_bvn_id_muon_chuyen: 0,
			bvv_number_muon_chuyen: 0,
			type: 'update'
		});
		this.openModalAction();
	}

	openModal(id) {
		this.refs.modalPopup.open();
	}

	closeModal(id) {
		this.refs.modalPopup.close();
	}

	openModalAction(id) {
		this.refs.modalPopupAction.open();
	}

	closeModalAction(id) {
		this.refs.modalPopupAction.close();
	}

	openModalOrder(id) {
		this.refs.modalPopupOrder.open();
	}

	closeModalOrder(id) {
		this.refs.modalPopupOrder.close();
	}

	_renderModalBen(data) {
		let html = [],
		listItem1 = [],
		listItem2 = [],
		keyDiemDi = this.state.keyDiemDi,
		keyDiemDen = this.state.keyDiemDen,
		currentDiemDen = '',
		currentDiemDi = '',
		type = this.state.type,
		totalPriceInt = this.state.totalPriceInt;

		if(this.state.nameDiemDen != '') {
			currentDiemDen = this.state.nameDiemDen;
		}

		if(this.state.nameDiemDi != '') {
			currentDiemDi = this.state.nameDiemDi;
		}

		if(this.props.data.bvh_id_can_chuyen != undefined && this.props.data.bvh_id_can_chuyen > 0) {
			html.push(<Button key="9" block info style={styles.marginTopButton} onPress={this._handleXacNhanChuyenVaoCho.bind(this)}>Xác nhận Chuyển vào chỗ</Button>);
		}else {
			if(this.state.bvv_id_can_chuyen <= 0) {
				if(Object.keys(data).length > 0) {
					let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong],
						currentPrice = dataGiuong.bvv_price,
						priceConver = 0;
						if(type == 'update') {
							if(totalPriceInt > 0) {
								currentPrice = totalPriceInt;
							}
							if(currentPrice > 0) {
								priceConver = currentPrice.toFixed(0).replace(/./g, function(c, i, a) {
									return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
								});
							}
						}else {
							if(totalPriceInt > 0) {
								priceConver = totalPriceInt.toFixed(0).replace(/./g, function(c, i, a) {
									return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
								});
							}
						}
					Object.keys(data).map(function(key) {
						let checkSelect = false;
						if(keyDiemDi != '' && keyDiemDi == key) {
							checkSelect = true;
							if(type == 'update') {
								currentDiemDi = data[key];
							}
						}
						listItem1.push({key: key.toString(), section: checkSelect, label: data[key], value: key});
					});

					Object.keys(data).map(function(key) {
						let checkSelect = false;
						if(keyDiemDen != '' && keyDiemDen == key) {
							checkSelect = true;
							if(type == 'update') {
								currentDiemDen = data[key];
							}
						}
						listItem2.push({key: key.toString(), section: checkSelect, label: data[key], value: key});
					});

					html.push(
						<Text key="1" style={{marginTop: 20, width: 200}}>Điểm đi:</Text>
					);
					html.push(
						<ModalPicker
						key="2"
						data={listItem1}
						initValue="Chọn điểm đi"
						onChange={(option)=>{this.renderPriceBenDi(option)}}>
						<TextInput
						style={{borderWidth:1, borderColor:'#ccc', padding:10,  width: 200, height:30, marginTop: 10, marginBottom: 10}}
						editable={false}
						placeholder="Vui lòng chọn điểm đi"
						value={currentDiemDi} />
						</ModalPicker>
					);
					html.push(
						<Text key="3" style={{width: 200}}>Điểm đến:</Text>
					);
					html.push(
						<ModalPicker
						key="4"
						data={listItem2}
						initValue="Chọn điểm đến"
						onChange={(option)=>{this.renderPriceBenDen(option)}}>
						<TextInput
						style={{borderWidth:1, borderColor:'#ccc', padding:10,  width: 200, height:30, marginTop: 10, marginBottom: 10}}
						editable={false}
						placeholder="Vui lòng chọn điểm đến"
						value={currentDiemDen} />
						</ModalPicker>
					);

					html.push(
						<Text key="5" style={{color: 'red', fontSize: 20, marginTop: 10, marginBottom: 20}}>{priceConver} VNĐ</Text>
					);

					if(type == 'update') {
						html.push(
							<Button key="6" block success onPress={this.updateGiuong.bind(this, this.state.nameGiuong)}>Cập nhật</Button>
						);
					}else {
						html.push(
							<Button key="6" block success onPress={this.bookGiuong.bind(this, this.state.nameGiuong)}>Book</Button>
						);
					}
				}

			}
		}
		return html;
	}

	renderPriceBenDi(option) {
		this.setState({
			loadingModal: true
		});
		this.setState({nameDiemDi: option.label, keyDiemDi: option.value});
		var that = this;
		fetch(domain+'/api/api_adm_price_ben.php?type=notAuto&diemDi='+option.value+'&diemDen='+this.state.keyDiemDen+'&idAdm='+this.state.infoAdm.adm_id)
		.then((response) => response.json())
		.then((responseJson) => {
			var totalPriceInt = responseJson.totalPrice;
			var totalPrice = responseJson.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
				return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			});
			that.setState({
				priceTotal: totalPrice,
				totalPriceInt: totalPriceInt,
				loadingModal: false
			});
			return responseJson.totalPrice;
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	renderPriceBenDen(option) {
		this.setState({
			loadingModal: true
		});
		this.setState({nameDiemDen: option.label, keyDiemDen: option.value});
		var that = this;
		fetch(domain+'/api/api_adm_price_ben.php?type=notAuto&diemDi='+this.state.keyDiemDi+'&diemDen='+option.value+'&idAdm='+this.state.infoAdm.adm_id)
		.then((response) => response.json())
		.then((responseJson) => {
			var totalPriceInt = responseJson.totalPrice;
			var totalPrice = responseJson.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
				return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			});
			that.setState({
				priceTotal: totalPrice,
				totalPriceInt: totalPriceInt,
				loadingModal: false
			});
			return responseJson.totalPrice;
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	getPriceBen(diem_a, diem_b, bvv_id) {
		this.setState({
			loadingModal: true
		});
		var that = this;
		fetch(domain+'/api/api_adm_price_ben.php?type=auto&diemDi='+diem_a+'&diemDen='+diem_b+'&bvv_id='+bvv_id)
		.then((response) => response.json())
		.then((responseJson) => {
			var totalPriceInt = responseJson.totalPrice;
			var totalPrice = responseJson.totalPrice.toFixed(0).replace(/./g, function(c, i, a) {
				return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			});
			that.setState({
				priceTotal: totalPrice,
				totalPriceInt: totalPriceInt,
				keyDiemDi: responseJson.keyDiemDi,
				nameDiemDi: responseJson.nameDiemDi,
				nameDiemDen: responseJson.nameDiemDen,
				keyDiemDen: responseJson.keyDiemDen,
				loadingModal: false
			});
			return responseJson.totalPrice;
		})
		.catch((error) => {
			that.setState({
				loadingModal: false
			});
			console.error(error);
		});
	}

	updateGiuong(id) {
		this.closeModal();
		let arrBookGiuong = this.state.arrBookGiuong;
		let checkGiuongCurrent = false;
		for(var i = 0; i < arrBookGiuong.length; i++) {
			if(arrBookGiuong[i].numberGiuong == parseInt(this.state.currentIdGiuong)) {
				checkGiuongCurrent = true;
				let currentArrActive = this.state.arrVeNumber;
				let dataBook = this.state.dataBook;
				currentArrActive[this.state.currentIdGiuong].bvv_bex_id_a = this.state.keyDiemDi;
				currentArrActive[this.state.currentIdGiuong].bvv_bex_id_b = this.state.keyDiemDen;
				currentArrActive[this.state.currentIdGiuong].bvv_price = this.state.totalPriceInt;
				dataBook[i].bvv_bex_id_a = this.state.keyDiemDi;
				dataBook[i].bvv_bex_id_b = this.state.keyDiemDen;
				dataBook[i].bvv_price = this.state.totalPriceInt;
				this.setState({
					arrVeNumber: currentArrActive,
					dataBook: dataBook
				});
				break;
			}
		}
		if(!checkGiuongCurrent) {
			let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
			this.setState({
				loadingModal: true,
				isOpen: false
			});
			var that = this;
			let params = '?dav_did_id='+dataGiuong.bvv_bvn_id+'&dav_number='+dataGiuong.bvv_number+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen+'&price='+this.state.totalPriceInt;
			fetch(domain+'/api/api_user_ben_update.php'+params)
			.then((response) => response.json())
			.then((responseJson) => {
				let currentArrActive = that.state.arrVeNumber;
				currentArrActive[that.state.currentIdGiuong].bvv_bex_id_a = that.state.keyDiemDi;
				currentArrActive[that.state.currentIdGiuong].bvv_bex_id_b = that.state.keyDiemDen;
				currentArrActive[that.state.currentIdGiuong].bvv_price = that.state.totalPriceInt;
				that.setState({
					arrVeNumber: currentArrActive,
					loadingModal: false,
					isOpen: false,
					nameDiemDi: '',
					keyDiemDi: '',
					nameDiemDen: '',
					keyDiemDen: '',
					priceTotal: 0,
					totalPriceInt: 0,
					type: ''
				});

			})
			.catch((error) => {
				that.setState({
					loadingModal: false
				});
				console.error(error);
			});
		}
	}

	bookGiuong(id) {
		let dataGiuong = this.state.arrVeNumber[id],
		checkData = false;
		if(this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else {
			if(this.state.keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			}else {
				checkData = true;
			}
		}
		if(checkData) {
			this.closeModal();
			let currentArrActive = this.state.arrVeNumber;
			let dataBook = this.state.dataBook;
			let arrBookGiuong = this.state.arrBookGiuong;
			currentArrActive[id].bvv_status = -1;
			currentArrActive[id].bvv_bex_id_a = this.state.keyDiemDi;
			currentArrActive[id].bvv_bex_id_b = this.state.keyDiemDen;
			currentArrActive[id].bvv_price = this.state.totalPriceInt;
			dataBook.push({'numberGiuong': parseInt(id), 'bvv_bex_id_a': this.state.keyDiemDi, 'bvv_bex_id_b': this.state.keyDiemDen, 'bvv_price': parseInt(this.state.totalPriceInt)});
			arrBookGiuong.push({'numberGiuong': parseInt(id)});
			this.setState({
				loadingModal: true,
				isOpen: false,
				arrVeNumber: currentArrActive,
				loadingModal: false,
				isOpen: false,
				nameDiemDi: '',
				keyDiemDi: '',
				nameDiemDen: '',
				keyDiemDen: '',
				priceTotal: 0,
				totalPriceInt: 0,
				checkout: true,
				dataBook: dataBook,
				arrBookGiuong: arrBookGiuong
			});
		}
	}

	_renderOrder() {
		let dBook = this.state.dataBook;
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
						<View style={{flex: 1}}>
							<Text>{this.state.resultsBen[dBook[i].bvv_bex_id_a]} -> {this.state.resultsBen[dBook[i].bvv_bex_id_b]}</Text>
						</View>
						<View style={{flex: 1}}>
							<Text>{dBook[i].numberGiuong}</Text>
						</View>
						<View style={{flex: 1}}>
							<Text>1</Text>
						</View>
						<View style={{flex: 1}}>
							<Text>{newPrice} VNĐ</Text>
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
					<View style={{flex: 1}}>
						<Text>Tổng Tiền</Text>
					</View>
					<View style={{flex: 1}}>
						<Text>{newTotalPrice} VNĐ</Text>
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
								<Text>Họ tên: <Text style={styles.fontBold}>{this.state.infoAdm.use_gmail}</Text></Text>
								<Text>Số điện thoại: {this.state.infoAdm.use_phone}</Text>
								<Text>Giờ xuất bến: <Text style={styles.fontBold}>{this.props.data.gio_xuat_ben}</Text></Text>
							</View>
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
						</CardItem>
						{html}
						{totalHtml}
						<CardItem>
							<View>
								<Button block success onPress={() => this._handleSaveOrder()}>Đặt Vé</Button>
							</View>
						</CardItem>
					</Card>
				</Content>
			</Container>
		);
	}


	render() {
		return(
			<View>
				<ScrollView style={styles.container}>
					<Card style={styles.paddingContent}>
						<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
							<Text style={{fontSize: 20}}>Tầng 1</Text>
						</CardItem>

						<CardItem>
							{this.state.loading? <Spinner /> : (this._renderSoDoGiuong(this.state.results, 1))}
							{this.state.loading? <Spinner /> : (this._renderSoDoGiuong(this.state.results, 3))}
						</CardItem>
					</Card>
					<Card style={styles.paddingContent}>
						<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
							<Text style={{fontSize: 20}}>Tầng 2</Text>
						</CardItem>

						<CardItem>
							{this.state.loading? <Spinner /> : (this._renderSoDoGiuong(this.state.results, 2))}
							{this.state.loading? <Spinner /> : (this._renderSoDoGiuong(this.state.results, 4))}
						</CardItem>
					</Card>
					<Card style={styles.paddingContent}>
						<CardItem header style={{alignItems: 'center', justifyContent: 'center'}}>
							<Text style={{fontSize: 20}}>Ghế Sàn</Text>
						</CardItem>

						<CardItem>
							{this.state.loading? <Spinner /> : (this._renderSoDoGiuong(this.state.results, 5))}
						</CardItem>
					</Card>
				</ScrollView>
				<Modal style={[styles.modal, styles.modalPopup]} position={"top"} ref={"modalPopup"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModal? <Spinner /> : (this._renderModalBen(this.state.resultsBen))}
				</Modal>

				<Modal style={[styles.modal, styles.modalPopupAction]} position={"center"} ref={"modalPopupAction"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModalAction? <Spinner /> : (this._renderButtonAction())}
				</Modal>

				<Modal style={[styles.modal, styles.modalPopupOrder]} position={"top"} ref={"modalPopupOrder"} isDisabled={this.state.isDisabled}>
					{this.state.loadingModalOrder? <Spinner /> : (this._renderOrder())}
				</Modal>

				<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, left: 0}}>
 				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4}]}>
 					  <Text style={{color: 'red'}}>Chọn Chỗ</Text>
 				  </TouchableOpacity>
				  {this.state.checkout &&
 				  <TouchableOpacity style={[styles.styleTabbars, {flex: 4, backgroundColor: '#6495ed'}]} onPress={() => this.openModalOrder()}>
 					  <Text style={{color: '#fff'}}>Xác nhận đặt vé</Text>
 				  </TouchableOpacity>}
 				  <TouchableOpacity style={[styles.styleTabbars, {flex: 1}]} onPress={() => this._handleDropdown()}>
 					  <Icon name="ios-more" />
 					  {this.state.showDropdown && <View style={{position: 'absolute', width: 250, bottom: 55, right: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: '#fff', shadowOffset: {width: 0, height: 2}, shadowRadius: 2, shadowOpacity: 0.1, shadowColor: 'black'}}>
 						  <View style={{flexDirection: 'row', margin: 10}}>
 							  <Text onPress={() => [Actions.LichSu({title: 'Lịch Sử Đặt Vé', data: {day:this.props.data.day, adm_id:this.props.data.adm_id, notId:this.props.data.notId, notTuyenId: this.props.data.notTuyenId, benA: this.props.data.benA, benB: this.props.data.benB}}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Lịch Sử</Text>
 							  <TouchableOpacity style={{flex: 1,backgroundColor: '#ff4500', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-close-circle-outline" style={{color: '#fff'}} /></TouchableOpacity>
 						  </View>
 						  <View style={{flexDirection: 'row', margin: 10}}>
 							  <Text onPress={() => [Actions.DanhGia({title: 'Lịch Sử Đặt Vé', data: {day:this.props.data.day, adm_id:this.props.data.adm_id, notId:this.props.data.notId, notTuyenId: this.props.data.notTuyenId, benA: this.props.data.benA, benB: this.props.data.benB}}), this.setState({showDropdown: false}) ]} style={{padding: 10, flex: 6}}>Đánh Giá</Text>
 							  <TouchableOpacity style={{flex: 1,backgroundColor: '#00bfff', width: 20, marginRight: 20, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 100}}><Icon name="ios-cloud-done-outline" style={{color: '#fff'}} /></TouchableOpacity>
 						  </View>
 					  </View>}
 				  </TouchableOpacity>
 			  </View>
			</View>
		);
	}

	_handleSaveOrder() {
		let dataGiuong = this.state.arrVeNumber[this.state.nameGiuong];
		let dataBook = JSON.stringify(this.state.dataBook);
		let that = this;
		that.setState({
			loadingModalOrder: true
		});
		let params = 'type=insert&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&user_id='+this.state.infoAdm.adm_id+'&gio_xuat_ben='+JSON.stringify(this.props.data.gio_xuat_ben)+'&dataBook='+dataBook;
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
				checkout: false,
				loadingModalOrder: false,
				dataBook: [],
				arrBookGiuong: []
			});
			that.closeModalOrder();
		})
		.catch((error) => {
			console.error(error);
		});
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

	_renderButtonAction() {
		let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
		let html = [];
			if(this.state.currentIdGiuong != 0) {
				html.push(<Button key="huyve" block danger style={styles.marginTopButton} onPress={this._handleHuyVe.bind(this)}>Hủy Vé</Button>);

			}
			html.push(<Button key="chinhsua" block style={styles.marginTopButton} onPress={this._handleChinhSua.bind(this)}>Chỉnh sửa</Button>);
		return html;
	}

	_handleHuyVe() {
		let checkGiuongCurrent = false;
		if(this.state.checkout) {
			let arrBookGiuong = this.state.arrBookGiuong;
			for(var i in arrBookGiuong) {
				if(arrBookGiuong[i].numberGiuong == parseInt(this.state.currentIdGiuong)) {
					checkGiuongCurrent = true;
					let dataBook = this.state.dataBook;
					let setStatus = this.state.arrVeNumber;
					setStatus[this.state.currentIdGiuong].bvv_status = 0;

					arrBookGiuong.splice(i, 1);
					dataBook.splice(i, 1);

					this.setState({
						arrVeNumber: setStatus,
						loadingModalAction: false,
						arrBookGiuong: arrBookGiuong,
						dataBook: dataBook
					});

					if(dataBook.length == 0 && arrBookGiuong.length == 0) {
						this.setState({
							checkout: false
						});
					}
					break;
				}
			}
		}
		if(!checkGiuongCurrent) {
			this.setState({
				loadingModalAction: true
			});
			let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
			let that = this;
			that.closeModalAction();
			let params = '?dav_did_id='+dataGiuong.bvv_bvn_id+'&dav_number='+dataGiuong.bvv_number+'&user_id='+this.props.data.adm_id;
			fetch(domain+'/api/api_user_remove_ve.php'+params)
			.then((response) => response.json())
			.then((responseJson) => {
				let setStatus = that.state.arrVeNumber;
				setStatus[that.state.currentIdGiuong].bvv_status = -2;
				console.log('huy');
				that.setState({
					arrVeNumber: setStatus,
					loadingModalAction: false
				});
			})
			.catch((error) => {
				that.setState({
					loadingModalAction: false
				});
				console.error(error);
			});
		}else {
			this.closeModalAction();
		}
	}

	_handleChinhSua() {
		let arrBookGiuong = this.state.arrBookGiuong;
		let checkGiuongCurrent = false;
		for(var i = 0; i < arrBookGiuong.length; i++) {
			if(arrBookGiuong[i].numberGiuong == parseInt(this.state.currentIdGiuong)) {
				checkGiuongCurrent = true;
				let dataBook = this.state.dataBook;
				this.setState({
					nameDiemDi: this.state.resultsBen[dataBook[i].bvv_bex_id_a],
					nameDiemDen: this.state.resultsBen[dataBook[i].bvv_bex_id_a],
					keyDiemDi: dataBook[i].bvv_bex_id_a,
					keyDiemDen: dataBook[i].bvv_bex_id_b,
					totalPriceInt: dataBook[i].bvv_price
				});
				break;
			}
		}
		if(!checkGiuongCurrent) {
			let dataGiuong = this.state.arrVeNumber[this.state.currentIdGiuong];
			this.setState({
				loadingModal: true,
				type: 'update'
			});
			var that = this;

			fetch(domain+'/api/api_user_ben.php?type=update&notId='+this.props.data.notId+'&notTuyenId='+this.props.data.notTuyenId+'&bvv_bvn_id='+dataGiuong.bvv_bvn_id+'&bvv_id='+dataGiuong.bvv_id+'&bvv_number='+dataGiuong.bvv_number+'&day='+this.props.data.day)
			.then((response) => response.json())
			.then((responseJson) => {
				that.setState({
					resultsBen: responseJson.dataBen,
					bvv_bvn_id_muon_chuyen: dataGiuong.bvv_bvn_id,
					bvv_number_muon_chuyen: dataGiuong.bvv_number,
					nameDiemDi: responseJson.nameDiemDi,
					nameDiemDen: responseJson.nameDiemDen,
					keyDiemDi: responseJson.keyDiemDi,
					keyDiemDen: responseJson.keyDiemDen,
					totalPriceInt: responseJson.totalPrice,
					loadingModal: false
				});
				return responseJson;
			})
			.catch((error) => {
				that.setState({
					loadingModal: false
				});
				console.error(error);
			});
		}
		this.closeModalAction();
		this.openModal();
	}

}

const styles = StyleSheet.create({
	container: {
		marginTop: 64,
		marginBottom: 50
	},
	wrapOrder: {
		marginBottom: 50
	},
	paddingContent: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10
	},
	borderCol: {
		height: 100,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 5,
		marginBottom: 5
	},
	nullBorderCol: {
		height: 100,
		borderWidth: 1,
		borderColor: '#d6d7da',
		marginRight: 5,
		marginBottom: 5,
		backgroundColor: '#d6d7da'
	},
	opacityBg: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	disabled: {
		backgroundColor: 'red'
	},
	activeGiuong: {
		backgroundColor: '#d6d7da',
	},
	activeGiuongUser: {
		backgroundColor: '#7eecb5',
	},
	activeLenXe: {
		backgroundColor: '#5fb760',
	},
	activeThanhToan: {
		backgroundColor: '#60c0dc',
	},
	textActiveGiuong: {
		color: '#ffffff'
	},
	textRightGiuong: {
		fontSize: 10,
		lineHeight: 10,
		position: 'absolute',
		right: 5,
		top: 5
	},
	textCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 13
	},
	textLeft: {
		fontSize: 13,
		alignItems: 'flex-start',
		width: 80
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#000066'
	},
	welcomePress: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#ffffff'
	},
	button: {
		borderColor: '#000066',
		borderWidth: 1,
		borderRadius: 10,
	},
	buttonPress: {
		borderColor: '#000066',
		backgroundColor: '#000066',
		borderWidth: 1,
		borderRadius: 10,
	},
	modal: {
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
		height: 300,
		width: 300
	},
	modalPopupAction: {
		width: 300,
		height: 140
	},
	modalPopupOrder: {
		width:widthDevice,
		paddingRight: 0,
		paddingLeft: 0
	},
	marginTopButton: {
		marginTop: 20
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
	borderChuyenChoo: {
		borderWidth: 3,
		borderColor: '#000000'
	},
	fontWeight: {
		fontWeight: 'bold'
	}
});

export default ViewSoDoGiuong
