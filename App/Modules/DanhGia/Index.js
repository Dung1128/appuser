import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	TextInput,
	AsyncStorage,
	Image,
} from 'react-native';
import { domain, cache, colorLogo } from '../../Config/common';
import fetchData from '../../Components/FetchData';
import { Container, Content, InputGroup, Icon, Input, Button, Spinner, Card, CardItem, Badge } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import Rating from 'react-native-easy-rating';
import Modal from 'react-native-modalbox';
import Base64 from 'Base64';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
import StorageHelper from '../../Components/StorageHelper';
const selectStar = require('../../../App/Skin/Images/select_star.png');
const unSelectStar = require('../../../App/Skin/Images/unselect_star.png');

const url = domain + '/api/api_user_rating.php';
const rate1 = require('../../Skin/Images/1.png');
const rate2 = require('../../Skin/Images/11.png');
const rate3 = require('../../Skin/Images/2.png');
const rate4 = require('../../Skin/Images/22.png');
const icon1 = require('../../Skin/Images/icon11.png');
const icon2 = require('../../Skin/Images/icon22.png');

class DanhGia extends Component {

	constructor(props) {
		super(props);
		this.state = {
			token: '',
			height: heightDevice,
			width: widthDevice,
			showDropdown: false,
			results: [],
			dataBen: [],
			rating: 0,
			benA: '',
			benB: '',
			benAA: '',
			benBB: '',
			gio_xuat_ben: '',
			did_id: '',
			textRating: '',
			hanh_trinh: '',
			infoAdm: [],
			rat_values: 5,
			imageRate1: rate2,
			imageRate2: rate3,
			check: true,
			list_chuyen_rating: [],
			list_tieu_chi: [],
			list_danh_gia: [],
			list_view_rate: [],
			tuyen: '',
		};
	}

	async _getRating(token, admId) {
		// let data = [];
		let data1 = [];
		let data2 = [];
		let list_tieu_chi = [];
		let list_danh_gia = [];

		// try {
		// 	let params = {
		// 		token: token,
		// 		type: '0',
		// 		user_id: admId,
		// 	}
		// 	data = await fetchData('user_rating', params, 'GET');
		// } catch (e) {
		// 	console.log(e);
		// }

		try {
			let params1 = {
				token: token,
				user_id: admId,
			}

			data1 = await fetchData('api_get_list_chuyen_rating', params1, 'GET');

			let params2 = {
				token: token,
				user_id: admId,
			}

			data2 = await fetchData('api_get_list_tieu_chi', params2, 'GET');

			if (data2.status == 200) {
				list_tieu_chi = data2.tieu_chi_danh_gia;
				for (let i = 0; i < list_tieu_chi.length; i++) {
					list_danh_gia.push({
						id: list_tieu_chi[i].urd_id,
						stt: true,
						img: icon1,
						name: 'tieu_chi_' + list_tieu_chi[i].urd_id,
						urd_name: list_tieu_chi[i].urd_name,
						borderColor: '#537921',
						backgroundColor: '#537921',
						textColor: '#ffffff',
					});
				}
			}
			else {
				alert(data2.mes);
				Actions.welcome({ type: 'reset' });
			}

		} catch (error) {
			console.log(error);
		}

		let that = this;
		setTimeout(() => {
			if (data1.status != 404) {
				that.setState({
					// results: (data.dataRating != null) ? data.dataRating : [],
					// dataBen: (data.dataBen != null) ? data.dataBen : [],
					list_chuyen_rating: data1.list_chuyen_di,
					list_tieu_chi: list_tieu_chi,
					list_danh_gia: list_danh_gia,
					loading: false
				});
			} else if (data1.status == 404) {
				alert(data1.mes);
				Actions.welcome({ type: 'reset' });
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

		this._getRating(token, admId);
	}

	_handleDropdown() {
		if (this.state.showDropdown) {
			this.setState({
				showDropdown: false
			});
		} else {
			this.setState({
				showDropdown: true
			});
		}
	}

	getListRating(data) {
		let html = [],
			htmlItem = [],
			gio_xuat_ben = '',
			tuyen = '';

		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				let tieuchi = (item.tong_tieu_chi > 0) ? (item.tieu_chi_tot + '/' + item.tong_tieu_chi) : '';
				let day = new Date(1970, 0, 1);
				day.setSeconds(item.did_time);
				gio_xuat_ben = day.toLocaleDateString() + ' ' + item.did_gio_xuat_ben_that;
				tuyen = item.tuy_ten;

				htmlItem.push(
					<CardItem key={item.did_time + i}>
						{/* <TouchableOpacity onPress={this._getFormRating.bind(this, item.ten_bks, item.dav_did_id, dataBen[item.tuy_ben_a], dataBen[item.tuy_ben_b], item.diem_a, item.diem_b, item.gio_xuat_ben, item.tuy_hanh_trinh, item.laixe1, item.laixe2, item.tiepvien, item.number_ghe, item.disable, item.rat_comment, item.rat_values)}> */}
						{/* <TouchableOpacity > */}
						<View style={{ flex: 5, flexDirection: 'row' }}>
							<View style={{ flex: 5 }}>
								<Text style={{ marginBottom: 10 }}>Chuyến: <Text style={{ fontWeight: 'bold' }}>{item.tuy_ten}</Text></Text>
								<Text style={{ marginBottom: 10 }}>Thời gian: <Text style={{ fontWeight: 'bold' }}>{day.toLocaleDateString() + ' ' + item.did_gio_xuat_ben_that}</Text></Text>
							</View>

							{/* <Text style={{ marginBottom: 10 }}>Số ghế: <Text style={{ fontWeight: 'bold' }}>{item.number_ghe}</Text></Text> */}
							{/* <Text style={{ marginBottom: 5 }}>Đánh giá: <Text style={{ fontWeight: 'bold' }}>{item.totalRating}/5</Text></Text> */}
							{/* <View style={{ width: 24 * item.totalRating, overflow: 'hidden' }}>
									<Rating
										rating={item.totalRating}
										max={5}
										iconWidth={24}
										iconHeight={24}
										iconSelected={selectStar}
										iconUnselected={unSelectStar}
										editable={false} />
								</View> */}
							<TouchableOpacity
								style={{ flex: 2, borderWidth: 1, padding: 10, borderRadius: 5, backgroundColor: colorLogo, justifyContent: 'center', height: 40 }}
								onPress={this.getFormRatingNew.bind(this, item.did_id, tieuchi, gio_xuat_ben, tuyen)}>
								<Text style={{ textAlign: 'center' }}>Đánh giá <Text style={{ fontWeight: 'bold' }}>{tieuchi}</Text></Text>
							</TouchableOpacity>
						</View>
						{/* </TouchableOpacity> */}
					</CardItem>
				);
			}
		} else {
			htmlItem.push(
				<CardItem key="null">
					<View style={{ flex: 5, alignItems: 'center' }}>
						<Text style={{ color: 'red' }}>Bạn chưa có chuyến đi nào. Không thể đánh giá!</Text>
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

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

	_getFormRating(ten_bks, did_id, benA, benB, benAA, benBB, gio_xuat_ben, hanh_trinh, laixe1, laixe2, tiepvien, number_ghe, disable, rat_comment, rat_values) {
		this.setState({
			did_id: did_id,
			benA: benA,
			benB: benB,
			benAA: benAA,
			benBB: benBB,
			ten_bks: ten_bks,
			hanh_trinh: hanh_trinh,
			gio_xuat_ben: gio_xuat_ben,
			laixe1: laixe1,
			laixe2: laixe2,
			tiepvien: tiepvien,
			number_ghe: number_ghe,
			disable: disable,
			rat_comment: rat_comment,
			rat_values: rat_values
		})
		this.openModal();
	}

	async getFormRatingNew(did_id, tieu_chi, gio_xuat_ben, tuyen) {
		// this.setState({
		// 	did_id: did_id,
		// })
		let disable = false;

		let params = {
			token: this.state.token,
			user_id: this.state.infoAdm.adm_id,
			did_id: did_id,
		}

		data = await fetchData('api_view_rating', params, 'GET');

		if (tieu_chi == '') {
			disable = false;
		}
		else {
			disable = true;
		}

		this.setState({
			did_id: did_id,
			disable: disable,
			list_view_rate: data.arData,
			tuyen: tuyen,
			gio_xuat_ben: gio_xuat_ben,
		});

		this.openModal();
	}

	async _saveRating() {
		// let rating = this.state.rating;
		// if (rating == 0) {
		// 	rating = 5;
		// }

		// try {
		// 	let params = {
		// 		token: this.state.token,
		// 		type: '1',
		// 		user_id: this.state.infoAdm.adm_id,
		// 		did_id: this.state.did_id,
		// 		rat_values: rating,
		// 		rat_comment: this.state.textRating,
		// 	}
		// 	let data = await fetchData('user_rating', params, 'GET');
		// 	this._getRating(this.state.token, this.state.infoAdm.adm_id);
		// 	alert(data.mes);
		// } catch (e) {
		// 	console.log(e);
		// }

		let dataDanhGia = {};
		let list_danh_gia = this.state.list_danh_gia;


		try {
			for (let i = 0; i < list_danh_gia.length; i++) {
				dataDanhGia[list_danh_gia[i].name] = list_danh_gia[i].stt ? 1 : 0;
			}

			let objJsonStr = JSON.stringify(dataDanhGia);
			let objJsonB64 = Base64.btoa(JSON.stringify(dataDanhGia));

			let params = {
				token: this.state.token,
				user_id: this.state.infoAdm.adm_id,
				did_id: this.state.did_id,
				dataDanhGia: objJsonB64,
				rat_comment: this.state.textRating,
				tieu_chi_tot: this.state.check ? 1 : 0,
			}

			let data = await fetchData('api_save_rating', params, 'GET');

			if (data.status != 200) {
				alert(data.mes);
			}

			if (data.status == 200) {
				alert('Cám ơn quý khách đã đánh giá dịch vụ!');
			}

			// this._getRating(this.state.token, this.state.infoAdm.adm_id);
			// alert(data.mes);
			// Actions.welcome({ type: 'reset' });
		} catch (e) {
			console.log(e);
			alert(e);
		}

		this.closeModal();
		this.setState({
			rating: 0,
		})
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
		let html_tieu_chi = [];
		let list_tieu_chi = this.state.list_tieu_chi;
		let list_danh_gia = this.state.list_danh_gia;
		let html_view_hl = [];
		let html_view_tieu_chi = [];
		let list_view_rate = this.state.list_view_rate;

		for (let i = 0; i < list_danh_gia.length; i++) {
			let item = list_danh_gia[i];

			html_tieu_chi.push(
				<TouchableOpacity key={i}
					style={{ alignItems: 'center', margin: 5 }}
					onPress={() => {
						this.state.list_danh_gia[i].stt = !this.state.list_danh_gia[i].stt;
						if (this.state.list_danh_gia[i].stt) {
							this.state.list_danh_gia[i].img = icon1;
							this.state.list_danh_gia[i].borderColor = '#537921';
							this.state.list_danh_gia[i].backgroundColor = '#537921';
							this.state.list_danh_gia[i].textColor = '#ffffff';

							this.setState({
								// list_danh_gia: list_danh_gia,
							});
						}
						else {
							this.state.list_danh_gia[i].img = icon2;
							this.state.list_danh_gia[i].borderColor = '#2a63b2';
							this.state.list_danh_gia[i].backgroundColor = '#ffffff';
							this.state.list_danh_gia[i].textColor = '#2a63b2';
							this.setState({
								// list_danh_gia: list_danh_gia,
							});
						}

					}}>
					<View style={{ flexDirection: 'row', borderColor: item.borderColor, borderWidth: 1, borderRadius: 30, alignItems: 'center', backgroundColor: item.backgroundColor }}>
						<Text style={{ margin: 10, marginLeft: 15, textAlignVertical: 'center', color: item.textColor, fontWeight: '800' }}>{item.urd_name}</Text>
						<Image style={{ width: 12, resizeMode: 'contain', marginRight: 15 }} source={item.img} />
					</View>
				</TouchableOpacity>
			);
		}

		if (list_view_rate && list_view_rate.data) {
			for (let i = 0; i < list_view_rate.data.length; i++) {
				let item = list_view_rate.data[i];
				let img = (item.value == '1') ? icon1 : icon2;
				let sty = (item.value == '1') ? styles.gd : styles.bd;
				let textColor = (item.value == '1') ? '#ffffff' : '#2a63b2';

				html_view_tieu_chi.push(
					<View key={i}
						style={[sty, { alignItems: 'center', margin: 5 }]}
					>
						{/* <View style={sty}> */}
						<Text style={{ margin: 10, marginLeft: 15, textAlignVertical: 'center', color: textColor, fontWeight: '800' }}>{item.tieu_chi}</Text>
						<Image style={{ width: 12, resizeMode: 'contain', marginRight: 15 }} source={img} />
						{/* </View> */}
					</View>
				);
			}
		}

		if (list_view_rate && list_view_rate.rat_status == '1') {
			html_view_hl.push(
				<View key={1} style={{ flexDirection: 'column', marginBottom: 15 }}>
					<View style={{ flexDirection: 'row', marginBottom: 15 }}>
						<View
							style={{ flex: 1, alignItems: 'center', marginRight: 10 }}
						>
							<Image style={{ margin: 5, width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={rate2} />
						</View>
						{/* <View
							style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}
						>
							<Image style={{ margin: 5, width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={rate3} />
						</View> */}
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', }} >
						{html_view_tieu_chi}
					</View>
				</View>
			);
		}
		else {
			html_view_hl.push(
				<View key={1} style={{ flexDirection: 'column', marginBottom: 15 }}>
					<View style={{ flexDirection: 'row', marginBottom: 15 }}>
						<View
							style={{ flex: 1, alignItems: 'center', marginRight: 10 }}
						>
							<Image style={{ margin: 5, width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={rate4} />
						</View>
						{/* <View
							style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}
						>
							<Image style={{ margin: 5, width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={rate4} />
						</View> */}
					</View>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} >
						{html_view_tieu_chi}
					</View>
				</View>
			);
		}

		return (
			<View style={[styles.container, { height: this.state.height }]} onLayout={this._onLayout}>
				<ScrollView keyboardShouldPersistTaps="always">
					{this.state.loading &&
						<View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>
					}
					{!this.state.loading &&
						// this.getListRating(this.state.results, this.state.dataBen)
						this.getListRating(this.state.list_chuyen_rating)
					}
				</ScrollView>

				<Modal style={[styles.modal, styles.modalPopup, { paddingTop: 50, height: (this.state.height - 20) }]} position={"top"} ref={"modal3"} swipeToClose={false}>

					<TouchableOpacity onPress={() => this.closeModal()} style={{ width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10 }}>
						<Icon name="ios-close-circle" />
					</TouchableOpacity>
					<View style={{ paddingBottom: 50 }}>
						<ScrollView keyboardShouldPersistTaps="always">
							<View style={{ width: (this.state.width - 20), paddingBottom: 50 }}>
								<View style={{ flexDirection: 'column', marginBottom: 15 }}>
									{!this.state.disable &&
										<Text style={{ marginBottom: 10 }}>Thông tin chuyến đi</Text>}
									{this.state.disable &&
										<Text style={{ marginBottom: 10 }}>Bạn đã đánh giá chuyến đi</Text>}

									<Text style={{ marginBottom: 10 }}>Chuyến: <Text style={{ fontWeight: 'bold' }}>{this.state.tuyen}</Text></Text>
									<Text style={{ marginBottom: 10 }}>Thời gian: <Text style={{ fontWeight: 'bold' }}>{this.state.gio_xuat_ben}</Text></Text>
								</View>

								{this.state.disable &&
									<View>
										{/* <View style={{ flexDirection: 'column' }}>
											<View style={{ flexDirection: 'row' }}>
												<View
													style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}
												>
													<Image style={{ margin: 5, width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={this.state.imageRate1} />
												</View>
												<View
													style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}
												>
													<Image style={{ margin: 5, width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={this.state.imageRate2} />
												</View>
											</View>
											<View style={{ flexDirection: 'row', justifyContent: 'center' }} >
												{html_tieu_chi}
											</View>
										</View> */}

										{html_view_hl}

										<View style={{ marginTop: 10, marginBottom: 20 }}>
											<Text style={{ marginBottom: 10 }}>Nội dung đánh giá:</Text>
											<Text style={{ fontWeight: 'bold' }}>{this.state.list_view_rate.rat_comment}</Text>
										</View>
									</View>
								}

								{!this.state.disable &&
									<View>
										<View style={{ flexDirection: 'column', marginBottom: 15 }}>
											<View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'center' }}>
												<TouchableOpacity
													style={{ width: widthDevice / 4 + 10, height: widthDevice / 4, alignItems: 'flex-end', marginRight: 10, }}
													onPress={() => {
														this.state.check = !this.state.check;
														if (this.state.check) {
															this.setState({
																imageRate1: rate2,
																imageRate2: rate3,
															});
														}
														else {
															this.setState({
																imageRate1: rate1,
																imageRate2: rate4,
															});
														}
													}}>
													<Image style={{ width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={this.state.imageRate1} />
												</TouchableOpacity>
												<TouchableOpacity
													style={{ width: widthDevice / 4 + 10, height: widthDevice / 4, alignItems: 'flex-start', marginLeft: 10 }}
													onPress={() => {
														this.state.check = !this.state.check;
														if (this.state.check) {
															this.setState({
																imageRate2: rate3,
																imageRate1: rate2,
															});
														}
														else {
															this.setState({
																imageRate2: rate4,
																imageRate1: rate1,
															});
														}
													}}>
													<Image style={{ width: widthDevice / 4, height: widthDevice / 4, resizeMode: 'contain' }} source={this.state.imageRate2} />
												</TouchableOpacity>
											</View>
											<View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', }} >
												{html_tieu_chi}
											</View>
										</View>
										<View>
											<View style={{ marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', flexDirection: 'row' }}>
												<Input placeholder="Viết đánh giá" style={{ height: 60 }} multiline={true} numberOfLines={4} onChange={(event) => this.setState({ textRating: event.nativeEvent.text })} />
											</View>
											<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
												<Button block success style={{ marginTop: 20, backgroundColor: colorLogo, width: 200, height: 40, }} textStyle={{ color: '#3b310a', fontWeight: '600' }} onPress={() => this._saveRating()}>Gửi Đánh Giá</Button>
											</View>
										</View>
									</View>
								}
							</View>
						</ScrollView>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 59
	},
	modal: {
		alignItems: 'center',
		top: 60,
	},
	modalPopup: {
		padding: 10
	},

	gd: {
		flexDirection: 'row',
		borderColor: '#537921',
		borderWidth: 1,
		borderRadius: 30,
		alignItems: 'center',
		backgroundColor: '#537921'
	},

	bd: {
		flexDirection: 'row',
		borderColor: '#2a63b2',
		borderWidth: 1,
		borderRadius: 30,
		alignItems: 'center',
		backgroundColor: '#ffffff'
	},
});

export default DanhGia
