import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	TextInput,
	View,
	ScrollView,
	TouchableOpacity,
	AsyncStorage,
	Image,
} from 'react-native';
import fetchData from '../../Components/FetchData';
import { Text, Input, Button, Card, CardItem, Spinner, Icon, Thumbnail } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Col, Row, Grid } from "react-native-easy-grid";
import StorageHelper from '../../Components/StorageHelper';
import { colorLogo } from '../../Config/common';
import GetInfoDevice from '../../Components/GetInfoDevice';
import Common from '../../Components/Common';
import Communications from 'react-native-communications';
import Accordion from 'react-native-collapsible/Accordion';
// import DetailNews from '../DetailNews'; 

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
const currentDate = new Date();

class HomeIOS extends Component {
	constructor(props) {
		super(props);
		let date = new Date();

		let dd = date.getDate();
		let mm = date.getMonth() + 1;
		let yyyy = date.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		this.state = {
			width: widthDevice,
			height: heightDevice,
			widthView: 0,
			heightView: 0,
			date: date,
			day: date.getDate(),
			month: (date.getMonth() + 1),
			year: date.getFullYear(),
			fullDate: dd + '-' + mm + '-' + yyyy,
			WEEKDAYS: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
			MONTHS: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
				'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
			results: [],
			dataBx: [],
			listItem1: [],
			listItem2: [],
			optionSelect: '',
			arrSoDoGiuong: [],
			loading: true,
			isDisabled: false,
			showContentNot: false,
			oneSearch: false,
			keyDiemDi: '',
			keyDiemDen: '',
			nameDiemDi: '',
			nameDiemDen: '',
			selectCheckbox: 'borderCheckbox',
			editFormSearch: false,
			countClickNextDay: true,
			search1: false,
			search2: false,
			token: '',
			infoAdm: [],
			arrProvince: [],
			arrPark: [],
			checkDiaDiem: '',
			list_pho_bien: [],
			keyDiPhoBien: '',
			keyDenPhoBien: '',
			resultsNews: [],
			page: 1,
			total: 0
		};

		GetInfoDevice();
	}

	_onPressDetailNews(id) {
		Actions.DetailNews({ title: 'Chi Tiết Tin Tức', data: { idNews: id } });
	}

	onDateChange(date) {
		let currentSelectDate = date.date;
		let dd = currentSelectDate.getDate();
		let mm = currentSelectDate.getMonth() + 1;
		let yyyy = currentSelectDate.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		this.setState({
			date: currentSelectDate,
			day: currentSelectDate.getDate(),
			month: (currentSelectDate.getMonth() + 1),
			year: currentSelectDate.getFullYear(),
			fullDate: dd + '-' + mm + '-' + yyyy,
		});
	}

	_setDatePickerShow() {
		this.openModal();
	}

	_renderDatePicker() {
		return (
			<CalendarPicker
				selectedDate={this.state.date}
				onDateChange={(date) => {
					this.onDateChange({ date });
					this.closeModal();
				}}
				months={this.state.MONTHS}
				weekdays={this.state.WEEKDAYS}
				previousTitle='Tháng trước'
				nextTitle='Tháng sau'
				screenWidth={Dimensions.get('window').width}
				selectedBackgroundColor={'#5ce600'} />
		);
	}

	_renderDatePickerSearch(keyDiemDi, keyDiemDen) {
		return (
			<CalendarPicker
				selectedDate={this.state.date}
				onDateChange={(date) => {
					let currentSelectDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
					this.searchByDay(currentSelectDate, keyDiemDi, keyDiemDen);
					this.closeModalCalendarSearch();
				}}
				months={this.state.MONTHS}
				weekdays={this.state.WEEKDAYS}
				previousTitle='Tháng trước'
				nextTitle='Tháng sau'
				screenWidth={Dimensions.get('window').width}
				selectedBackgroundColor={'#5ce600'} />
		);
	}

	_renderNot(results) {
		let data = [],
			that = this;
		Object.keys(results).map(function (key) {
			data.push({
				did_loai_xe: results[key].did_loai_xe,
				laixe1: results[key].laixe1,
				laixe2: results[key].laixe2,
				tiepvien: results[key].tiepvien,
				gio_don: results[key].gio_don,
				soChoTrong: results[key].tongSoChoConLai,
				tenSoDo: results[key].ten_so_do,
				price: results[key].price,
				price_min: results[key].price_min,
				tuyen: results[key].tuyen,
				not_id: results[key].not_id,
				did_id: results[key].did_id,
				id_dieu_do: results[key].id_dieu_do,
				did_gio_xuat_ben_that: results[key].did_gio_xuat_ben_that,
				not_tuy_id: results[key].not_tuy_id,
				ben_a: results[key].diem_di,
				ben_b: results[key].diem_den,
				loai_hinh_ban_ve: results[key].did_loai_hinh_ban_ve,
				SDT: results[key].arrSDT,
			});
		});

		return data;
	}

	async componentWillMount() {
		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		// this.setState({
		// 	infoAdm: results,
		// 	token: token
		// });
		this.state.infoAdm = results;
		this.state.token = token;

		try {
			let params = {
				token: token,
				use_id: admId,
				type: 'home',
			}

			let data = await fetchData('user_ben', params, 'GET');
			let listItem1 = [],
				listItem2 = [];
			arrProvince = [];
			arrPark = [];
			let objData = {};

			if (data.status == 200) {
				Object.keys(data.dataBx).map(function (key) {
					let arrTemp = data.dataBx[key].split('|+');
					objData[key] = arrTemp[0];
					// listItem1.push({ key: key.toString(), label: arrTemp[0], value: key });
					// listItem2.push({ key: key.toString(), label: arrTemp[0], value: key });
				});

				let arrData = Object.values(data.dataBxNew);

				for (let i = 0; i < arrData.length; i++) {
					arrProvince.push(arrData[i].name);
					let arrTemp = [];
					Object.keys(arrData[i].data).map(function (key) {
						arrTemp.push({ key: key.toString(), label: arrData[i].data[key], value: key });
					});
					arrPark.push(arrTemp);

					Object.keys(arrData[i].data).map(function (key) {
						listItem1.push({ key: key.toString(), label: arrData[i].data[key], value: key });
						listItem2.push({ key: key.toString(), label: arrData[i].data[key], value: key });
					});
				}
			}

			let params1 = {
				token: token,
				user_id: admId,
			}

			let data1 = await fetchData('api_get_list_chuyen_pho_bien', params1, 'GET');

			let listChuyen = [];

			if (data1.status == 200) {
				listChuyen = data1.list_chuyen_di;
			}

			let params2 = {
				type: '0'
			}

			let data2 = await fetchData('user_news', params2, 'GET');

			this.setState({
				listItem1: listItem1,
				listItem2: listItem2,
				// dataBx: data.dataBx
				dataBx: objData,
				arrProvince: arrProvince,
				arrPark: arrPark,
				list_pho_bien: listChuyen,
				resultsNews: data2.dataNews,
				page: data2.page,
				total: data2.total,
				loading: false,
			});
		} catch (e) {
			console.log(e);
		}
	}

	async _getNot() {
		checkData = false;
		if (this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		} else {
			if (this.state.keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			} else {
				if (this.state.keyDiemDi == this.state.keyDiemDen) {
					checkData = false;
					alert('Điểm đi và Điểm đến không được trùng nhau!');
				} else {
					checkData = true;
				}
			}
		}

		if (checkData) {
			let currentMonth = currentDate.getMonth() + 1;
			let currentDay = currentDate.getDate();
			let selectMonth = this.state.month;
			let selectDay = this.state.day;

			if (currentMonth < 10) {
				currentMonth = '0' + currentMonth;
			}
	
			if (currentDay < 10) {
				currentDay = '0' + currentDay;
			}

			if (selectMonth < 10) {
				selectMonth = '0' + selectMonth;
			}
	
			if (selectDay < 10) {
				selectDay = '0' + selectDay;
			}

			let newCurrentDate = currentDate.getFullYear().toString() + currentMonth.toString() + currentDay.toString();
			let selectCurrentDate = this.state.year.toString() + selectMonth.toString() + selectDay.toString();

			if (newCurrentDate <= selectCurrentDate) {

				this.setState({
					loading: true,
					showContentNot: true
				});
				try {
					let params = {
						token: this.state.token,
						use_id: this.state.infoAdm.adm_id,
						day: this.state.fullDate,
						diem_a: this.state.keyDiemDi,
						diem_b: this.state.keyDiemDen,
					}
					let data = await fetchData('user_so_do_giuong', params, 'GET');
					if (data.status != 404) {
						this.setState({
							results: data.so_do_giuong,
							loading: false,
							showContentNot: false,
							oneSearch: true,
							editFormSearch: false
						});
					} else if (data.status == 404) {
						alert(data.mes);
						Actions.welcome({ type: 'reset' });
					}
				} catch (e) {
					console.log(e);
					this.setState({
						loading: false,
						showContentNot: false
					});
				}
			} else {
				alert('Ngày tháng không hợp lệ!');
			}
		}
	}

	async searchByDay(date, keyDiemDi, keyDiemDen) {
		checkData = false;
		// if (this.state.keyDiemDi == '') {
		// 	checkData = false;
		// 	alert('Vui lòng chọn Điểm Đi!');
		// } else {
		// 	if (this.state.keyDiemDen == '') {
		// 		checkData = false;
		// 		alert('Vui lòng chọn Điểm Đến!');
		// 	} else {
		// 		if (this.state.keyDiemDi == this.state.keyDiemDen) {
		// 			checkData = false;
		// 			alert('Điểm đi và Điểm đến không được trùng nhau!');
		// 		} else {
		// 			checkData = true;
		// 		}
		// 	}
		// }

		if (keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		} else {
			if (keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			} else {
				if (keyDiemDi == keyDiemDen) {
					checkData = false;
					alert('Điểm đi và Điểm đến không được trùng nhau!');
				} else {
					checkData = true;
				}
			}
		}

		if (checkData) {

			let newCurrentDate = currentDate.getDate() + (currentDate.getMonth() + 1) + currentDate.getFullYear();
			let selectCurrentDate = this.state.day + this.state.month + this.state.year;
			// if (newCurrentDate <= selectCurrentDate) {

			this.setState({
				loading: true,
				showContentNot: true
			});
			try {
				let params = {
					token: this.state.token,
					use_id: this.state.infoAdm.adm_id,
					day: date,
					diem_a: keyDiemDi,
					diem_b: keyDiemDen,
				}
				let data = await fetchData('user_so_do_giuong', params, 'GET');
				if (data.status != 404) {
					this.setState({
						results: data.so_do_giuong,
						loading: false,
						showContentNot: false,
						oneSearch: true,
						editFormSearch: false,
						fullDate: date,
					});
				} else if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				}
			} catch (e) {
				console.log(e);
				this.setState({
					loading: false,
					showContentNot: false
				});
			}
			// } else {
			// 	alert('Ngày tháng không hợp lệ!');
			// }
		}
	}

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
	}

	openModalCalendarSearch(keyDiemDi, keyDiemDen) {
		this.setState({
			keyDiPhoBien: keyDiemDi,
			keyDenPhoBien: keyDiemDen,
		});
		this.refs.modalCalendarSearch.open();
	}

	closeModalCalendarSearch(id) {
		this.refs.modalCalendarSearch.close();
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

	_renderSectionTitle(section) {
		return (
			<View style={styles.content}>
				<Text>{section.content}</Text>
			</View>
		);
	}

	_renderHeader1(section) {
		return (
			// <View style={styles.header}>
			// 	<Text style={styles.headerText}>{section.title}</Text>
			// </View>
			<View style={{ alignItems: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, margin: 5 }}>
				<Icon name="md-subway" style={{ width: 30 }} />
				<Text style={{
					fontWeight: 'bold',
					// paddingTop: 5, 
					paddingLeft: 5
				}}
				>
					{section.title}
				</Text>
			</View>
		);
	}

	_renderContent1(section) {
		let html = [];

		for (let i = 0; i < section.content.length; i++) {
			html.push(
				// <Text key={i}>{section.content[i].label}</Text>
				<View key={'park_' + i} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, paddingLeft: 45, margin: 5 }}>
					<TouchableOpacity onPress={() => {
						this.closeModalDiemDi();
						this.setState({ keyDiemDi: section.content[i].value, nameDiemDi: section.content[i].label, search1: false });
					}}>
						<Text>{section.content[i].label}</Text>
					</TouchableOpacity>
				</View>
			);
		}
		return (
			<View style={styles.content}>
				{/* <Text>{section.content}</Text> */}
				{html}
			</View>
		);
	}

	_handleSearchAutocomplate1(nameDiemDi) {
		// let listItem1 = this.state.listItem1;
		// let listItem1_1 = this._str_slug(this.state.listItem1);
		let html = [];
		let childHtml = [];
		let arrProvince = this.state.arrProvince;
		let arrProvince_1 = this._str_slugArray(this.state.arrProvince);
		let arrPark = this.state.arrPark;

		let SECTIONS = [];

		// for (var i = 0; i < listItem1.length; i++) {
		// 	let label = listItem1[i].label.toLowerCase();
		// 	let convertNameDiemDi = nameDiemDi.toLowerCase();
		// 	let check = false;

		// 	if (listItem1_1[i].clabel.includes(convertNameDiemDi)) {
		// 		check = true;
		// 	} else {
		// 		if (label.includes(convertNameDiemDi)) {
		// 			check = true;
		// 		}
		// 	}

		// 	if (check) {
		// 		let value = listItem1[i].value;
		// 		let label = listItem1[i].label;
		// 		childHtml.push(
		// 			<View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
		// 				<TouchableOpacity onPress={() => this.setState({ keyDiemDi: value, nameDiemDi: label, search1: false })}>
		// 					<Text>{label}</Text>
		// 				</TouchableOpacity>
		// 			</View>
		// 		);
		// 	}
		// }

		for (var i = 0; i < arrProvince.length; i++) {
			let convertNameDiemDi = nameDiemDi.toLowerCase();
			let check = false;

			if (arrProvince_1[i].includes(convertNameDiemDi)) {
				check = true;
			} else {
				if (arrProvince[i].includes(convertNameDiemDi)) {
					check = true;
				}
			}

			if (check) {
				// childHtml.push(
				// 	<View key={'province_' + i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
				// 		<Text style={{ fontWeight: 'bold' }}>{arrProvince[i]}</Text>
				// 	</View>
				// );

				// for (let j = 0; j < arrPark[i].length; j++) {
				// 	let value = arrPark[i][j].value;
				// 	let label = arrPark[i][j].label;

				// 	childHtml.push(
				// 		<View key={'park_' + i + j} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
				// 			<TouchableOpacity onPress={() => {
				// 				this.closeModalDiemDi();
				// 				this.setState({ keyDiemDi: value, nameDiemDi: label, search1: false });
				// 			}}>
				// 				<Text>{label}</Text>
				// 			</TouchableOpacity>
				// 		</View>
				// 	);
				// }

				SECTIONS.push({
					title: arrProvince[i],
					content: arrPark[i]
				});
			}
			else {
				let arrSlugPark = this._str_slug(arrPark[i]);
				let arrSearch = [];

				for (let j = 0; j < arrPark[i].length; j++) {
					let label = arrPark[i][j].label;

					if (arrSlugPark[j].clabel.includes(convertNameDiemDi)) {
						arrSearch.push(arrPark[i][j]);
					} else {
						if (label.includes(convertNameDiemDi)) {
							arrSearch.push(arrPark[i][j]);
						}
					}
				}

				if (arrSearch.length > 0) {
					SECTIONS.push({
						title: arrProvince[i],
						content: arrSearch
					});

					// childHtml.push(
					// 	<View key={'province_' + i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
					// 		<Text style={{ fontWeight: 'bold' }}>{arrProvince[i]}</Text>
					// 	</View>
					// );

					// for (let j = 0; j < arrSearch.length; j++) {
					// 	let value = arrSearch[j].value;
					// 	let label = arrSearch[j].label;

					// 	childHtml.push(
					// 		<View key={'park_' + i + j} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
					// 			<TouchableOpacity onPress={() => {
					// 				this.closeModalDiemDi();
					// 				this.setState({ keyDiemDi: value, nameDiemDi: label, search1: false })
					// 			}}>
					// 				<Text>{label}</Text>
					// 			</TouchableOpacity>
					// 		</View>
					// 	);
					// }
				}
			}
		}

		html.push(
			<View key="scroll_autocomplate1" style={{ overflow: 'hidden' }}>
				<ScrollView>
					{/* {childHtml} */}
					<Accordion
						sections={SECTIONS}
						// renderSectionTitle={this._renderSectionTitle}
						renderHeader={this._renderHeader1.bind(this)}
						renderContent={this._renderContent1.bind(this)}
					/>
				</ScrollView>
			</View>
		);
		return html;
	}

	_str_slug(data) {
		let newDataStr = [],
			title, slug;

		Object.keys(data).map(function (key) {
			title = data[key].label;
			//Đổi chữ hoa thành chữ thường
			slug = title.toLowerCase();

			//Đổi ký tự có dấu thành không dấu
			slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
			slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
			slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
			slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
			slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
			slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
			slug = slug.replace(/đ/gi, 'd');
			//Xóa các ký tự đặt biệt
			// slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
			//Đổi khoảng trắng thành ký tự gạch ngang
			// slug = slug.replace(/ /gi, " - ");
			//Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
			//Phòng trường hợp người nhập vào quá nhiều ký tự trắng
			// slug = slug.replace(/\-\-\-\-\-/gi, '-');
			// slug = slug.replace(/\-\-\-\-/gi, '-');
			// slug = slug.replace(/\-\-\-/gi, '-');
			// slug = slug.replace(/\-\-/gi, '-');
			//Xóa các ký tự gạch ngang ở đầu và cuối
			// slug = '@' + slug + '@';
			// slug = slug.replace(/\@\-|\-\@|\@/gi, '');

			newDataStr.push({ key: key.toString(), label: data[key].label, clabel: slug, value: key });
		});

		return newDataStr;
	}

	_str_slugArray(data) {
		let newDataStr = [],
			title, slug;

		for (let i = 0; i < data.length; i++) {
			title = data[i];
			//Đổi chữ hoa thành chữ thường
			slug = title.toLowerCase();

			//Đổi ký tự có dấu thành không dấu
			slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
			slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
			slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
			slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
			slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
			slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
			slug = slug.replace(/đ/gi, 'd');
			//Xóa các ký tự đặt biệt
			// slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
			//Đổi khoảng trắng thành ký tự gạch ngang
			// slug = slug.replace(/ /gi, " - ");
			//Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
			//Phòng trường hợp người nhập vào quá nhiều ký tự trắng
			// slug = slug.replace(/\-\-\-\-\-/gi, '-');
			// slug = slug.replace(/\-\-\-\-/gi, '-');
			// slug = slug.replace(/\-\-\-/gi, '-');
			// slug = slug.replace(/\-\-/gi, '-');
			//Xóa các ký tự gạch ngang ở đầu và cuối
			// slug = '@' + slug + '@';
			// slug = slug.replace(/\@\-|\-\@|\@/gi, '');

			newDataStr.push(slug);
		}

		return newDataStr;
	}

	_renderHeader2(section) {
		return (
			// <View style={styles.header}>
			// 	<Text style={styles.headerText}>{section.title}</Text>
			// </View>
			<View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, margin: 5 }}>
				<Icon name="md-subway" style={{ width: 30 }} />
				<Text style={{ fontWeight: 'bold', paddingTop: 5, paddingLeft: 5 }}>{section.title}</Text>
			</View>
		);
	}

	_renderContent2(section) {
		let html = [];

		for (let i = 0; i < section.content.length; i++) {
			html.push(
				// <Text key={i}>{section.content[i].label}</Text>
				// <View key={'park_' + i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
				// 	<TouchableOpacity onPress={() => {
				// 		this.closeModalDiemDi();
				// 		this.setState({ keyDiemDi: section.content[i].value, nameDiemDi: section.content[i].label, search1: false });
				// 	}}>
				// 		<Text>{section.content[i].label}</Text>
				// 	</TouchableOpacity>
				// </View>
				<View key={'park_' + i} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, paddingLeft: 45, margin: 5 }}>
					<TouchableOpacity onPress={() => {
						this.closeModalDiemDen();
						this.setState({ keyDiemDen: section.content[i].value, nameDiemDen: section.content[i].label, search2: false });
					}}>
						<Text>{section.content[i].label}</Text>
					</TouchableOpacity>
				</View>
			);
		}
		return (
			<View style={styles.content}>
				{/* <Text>{section.content}</Text> */}
				{html}
			</View>
		);
	}

	_handleSearchAutocomplate2(nameDiemDen) {
		// let listItem2 = this.state.listItem2;
		// let listItem2_1 = this._str_slug(this.state.listItem2);
		let arrProvince = this.state.arrProvince;
		let arrProvince_1 = this._str_slugArray(this.state.arrProvince);
		let arrPark = this.state.arrPark;
		let html = [],
			childHtml = [];
		let SECTIONS = [];

		// for (var i = 0; i < listItem2.length; i++) {

		// 	let label = listItem2[i].label.toLowerCase();
		// 	let convertNameDiemDen = nameDiemDen.toLowerCase();
		// 	let check = false;

		// 	if (listItem2_1[i].clabel.includes(convertNameDiemDen)) {
		// 		check = true;
		// 	} else {
		// 		if (label.includes(convertNameDiemDen)) {
		// 			check = true;
		// 		}
		// 	}


		// 	if (check) {
		// 		let value = listItem2[i].value;
		// 		let label = listItem2[i].label;
		// 		childHtml.push(
		// 			<View key={i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
		// 				<TouchableOpacity onPress={() => this.setState({ keyDiemDen: value, nameDiemDen: label, search2: false })}>
		// 					<Text>{label}</Text>
		// 				</TouchableOpacity>
		// 			</View>
		// 		);
		// 	}
		// }

		for (var i = 0; i < arrProvince.length; i++) {
			let convertNameDiemDen = nameDiemDen.toLowerCase();
			let check = false;

			if (arrProvince_1[i].includes(convertNameDiemDen)) {
				check = true;
			} else {
				if (arrProvince[i].includes(convertNameDiemDen)) {
					check = true;
				}
			}

			if (check) {
				// childHtml.push(
				// 	<View key={'province_' + i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
				// 		<Text style={{ fontWeight: 'bold' }}>{arrProvince[i]}</Text>
				// 	</View>
				// );

				// for (let j = 0; j < arrPark[i].length; j++) {
				// 	let value = arrPark[i][j].value;
				// 	let label = arrPark[i][j].label;

				// 	childHtml.push(
				// 		<View key={'park_' + i + j} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
				// 			<TouchableOpacity onPress={() => {
				// 				this.closeModalDiemDen();
				// 				this.setState({ keyDiemDen: value, nameDiemDen: label, search2: false });
				// 			}}>
				// 				<Text>{label}</Text>
				// 			</TouchableOpacity>
				// 		</View>
				// 	);
				// }

				SECTIONS.push({
					title: arrProvince[i],
					content: arrPark[i]
				});
			}
			else {
				let arrSlugPark = this._str_slug(arrPark[i]);
				let arrSearch = [];

				for (let j = 0; j < arrPark[i].length; j++) {
					let label = arrPark[i][j].label;

					if (arrSlugPark[j].clabel.includes(convertNameDiemDen)) {
						arrSearch.push(arrPark[i][j]);
					} else {
						if (label.includes(convertNameDiemDen)) {
							arrSearch.push(arrPark[i][j]);
						}
					}
				}

				if (arrSearch.length > 0) {
					SECTIONS.push({
						title: arrProvince[i],
						content: arrPark[i]
					});

					// childHtml.push(
					// 	<View key={'province_' + i} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
					// 		<Text style={{ fontWeight: 'bold' }}>{arrProvince[i]}</Text>
					// 	</View>
					// );

					// for (let j = 0; j < arrSearch.length; j++) {
					// 	let value = arrSearch[j].value;
					// 	let label = arrSearch[j].label;

					// 	childHtml.push(
					// 		<View key={'park_' + i + j} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
					// 			<TouchableOpacity onPress={() => {
					// 				this.closeModalDiemDen();
					// 				this.setState({ keyDiemDen: value, nameDiemDen: label, search2: false })
					// 			}
					// 			}>
					// 				<Text>{label}</Text>
					// 			</TouchableOpacity>
					// 		</View>
					// 	);
					// }
				}
			}
		}

		html.push(
			<View key="scroll_autocomplate2" style={{ overflow: 'hidden' }}>
				<ScrollView>
					{/* {childHtml} */}
					<Accordion
						sections={SECTIONS}
						// renderSectionTitle={this._renderSectionTitle}
						renderHeader={this._renderHeader2.bind(this)}
						renderContent={this._renderContent2.bind(this)}
					/>
				</ScrollView>
			</View>
		);
		return html;
	}

	_handleSetDiemDi(nameDiemDi) {
		if (nameDiemDi.length > 0) {
			this.setState({ nameDiemDi: nameDiemDi, search1: true });
		} else {
			this.setState({ nameDiemDi: nameDiemDi, search1: false });
		}
	}

	_handleSetDiemDen(nameDiemDen) {
		if (nameDiemDen.length > 0) {
			this.setState({ nameDiemDen: nameDiemDen, search2: true });
		} else {
			this.setState({ nameDiemDen: nameDiemDen, search2: false });
		}
	}

	renderFormSearch(listItem1, listItem2) {
		let html = [];
		let htmlChuyen = [];
		let htmlNews = [];
		let dd = currentDate.getDate();
		let mm = currentDate.getMonth() + 1;
		let yyyy = currentDate.getFullYear();
		let tomorrowDd = dd + 1;

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		if (tomorrowDd < 10) {
			tomorrowDd = '0' + tomorrowDd;
		}

		let today = dd + '-' + mm + '-' + yyyy;
		let tomorrow = tomorrowDd + '-' + mm + '-' + yyyy;
		let diemdi = this.state.nameDiemDi,
			diemden = this.state.nameDiemDen;
		let listChuyen = this.state.list_pho_bien;
		let listNews = this.state.resultsNews;

		for (let i = 0; i < listChuyen.length; i++) {
			let arrTenTuyen = listChuyen[i].tuy_ten.split('-');
			let dau = '', cuoi = '';
			if (arrTenTuyen[0]) {
				dau = listChuyen[i].tuy_ten.split('-')[0].trim();
			}

			if (arrTenTuyen[1]) {
				cuoi = listChuyen[i].tuy_ten.split('-')[1].trim();
			}
			htmlChuyen.push(
				<View key={i} style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#FFFFFF' }}>
					<View style={{ flexDirection: 'column', flex: 3, margin: 10 }}>
						<Text style={{ paddingLeft: 5 }} >{dau}</Text>
						<Text style={{ paddingLeft: 5 }} >{cuoi}</Text>
					</View>
					<View style={{ flexDirection: 'column', margin: 10 }}>
						<View style={{ flexDirection: 'row', }}>
							{/* <Icon style={{ color: '#127676', }} name="logo-usd" /> */}
							<Text style={{ flex: 1, color: '#127676', fontSize: 15, fontWeight: 'bold', textAlign: 'right', paddingRight: 1 }} >{Common.formatPrice(listChuyen[i].price_thuong) + 'đ'}</Text>
						</View>
						<TouchableOpacity style={{ marginBottom: 2, flexDirection: 'row', flex: 3, backgroundColor: colorLogo, alignItems: 'center', borderRadius: 30, }} onPress={() => this.openModalCalendarSearch(listChuyen[i].tuy_ben_a, listChuyen[i].tuy_ben_b)}>
							{/* <Icon style={{ width: 30, paddingLeft: 5 }} name="md-calendar" /> */}
							<Text style={{ textAlignVertical: 'center', marginLeft: 10, marginRight: 10, marginBottom: 7, marginTop: 5 }}>
								{'Chọn ngày'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}

		let totalNews = Object.keys(listNews).length;

		if (totalNews > 0) {
			for (var key in listNews) {
				for (var i = 0; i < listNews[key].length; i++) {
					var item = listNews[key][i];
					htmlNews.push(
						<View key={i + item.new_id} style={{ alignItems: 'center', borderRadius: 5, backgroundColor: '#FFFFFF', marginRight: 10 }}>
							<TouchableOpacity onPress={this._onPressDetailNews.bind(this, item.new_id)}>
								<View style={{ width: 250, flexDirection: 'column' }}>
									<View style={{ height: 190, overflow: 'hidden' }}>
										<Image
											resizeMode="stretch"
											style={{
												minHeight: 190
											}}
											source={{ uri: item.new_avatar }}
										/>
									</View>
									<View style={{ marginTop: 10 }}>
										<Text style={{ fontSize: 12, fontWeight: 'bold', alignItems: 'flex-start', justifyContent: 'flex-start' }}>{item.new_title}</Text>

									</View>
								</View>
							</TouchableOpacity>
						</View>
					);
				}
			}
		} else {
			htmlNews.push(
				<CardItem key="null">
					<View style={{ flex: 5, alignItems: 'center' }}>
						<Text style={{ color: 'red' }}>Tin tức đang được cập nhật. Bạn vui lòng quay lại sau!</Text>
					</View>
				</CardItem>
			);
		}

		html.push(
			<View key="form_search" style={{ flexDirection: 'column', width: this.state.width }}>
				<View style={{ padding: 30, marginTop: 10 }}>
					<Text style={{ fontSize: 15, textAlign: 'left', fontWeight: 'bold', color: '#5b5b5b', marginBottom: 10, marginTop: -10 }}>MUA VÉ XE TRỰC TUYẾN TIỆN LỢI</Text>
					<Text style={{ fontSize: 12, textAlign: 'left', fontWeight: 'bold', color: '#5b5b5b', marginBottom: 10, marginTop: -10 }}>Tiện lợi không cần chờ đợi</Text>
					<View style={{ position: 'relative' }}>
						<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
							{/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Icon name="md-bus" style={{ width: 30 }} />
							<Text style={{ width: 150, fontSize: 9, marginTop: -10 }}>Điểm đi</Text>
						</View> */}
							{/* <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, }}>
							<Icon name="md-bus" style={{ width: 30 }} />
							<Input autoFocus={this.state.focus} placeholder="Nhập nơi đi" value={this.state.nameDiemDi} onChangeText={(nameDiemDi) => this._handleSetDiemDi(nameDiemDi)} style={{ height: 40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15 }} />
						</View>
						{this.state.search1 &&
							<View style={{ marginLeft: 30, backgroundColor: '#f6fbff' }}>
								{this._handleSearchAutocomplate1(this.state.nameDiemDi)}
							</View>
						} */}

							<TouchableOpacity onPress={() => { this.openModalDiemDi('diemdi') }}>
								<View style={{ flexDirection: 'row', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, alignItems: 'center' }}>
									<Icon style={{ width: 30, margin: 10 }} name="ios-pin-outline" />
									<Text style={{ marginLeft: 0, textAlignVertical: 'center', }}>
										{diemdi == '' ? 'Chọn tỉnh đi' : diemdi}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginTop: 20, marginBottom: 20 }}>
						<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
							{/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Icon name="md-bus" style={{ width: 30 }} />
							<Text style={{ width: 150, fontSize: 9, marginTop: -10 }}>Điểm đến</Text>
						</View> */}
							{/* <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, }}>
							<Icon name="md-bus" style={{ width: 30 }} />
							<Input placeholder="Nhập nơi đến" value={this.state.nameDiemDen} onChangeText={(nameDiemDen) => this._handleSetDiemDen(nameDiemDen)} style={{ height: 40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15 }} />
						</View>
						{this.state.search2 &&
							<View style={{ marginLeft: 30, backgroundColor: '#f6fbff' }}>
								{this._handleSearchAutocomplate2(this.state.nameDiemDen)}
							</View>
						} */}

							<TouchableOpacity onPress={() => { this.openModalDiemDen('diemden') }}>
								<View style={{ flexDirection: 'row', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, alignItems: 'center' }}>
									<Icon style={{ width: 30, margin: 10 }} name="ios-pin-outline" />
									<Text style={{ marginLeft: 0, textAlignVertical: 'center' }}>
										{diemden == '' ? 'Chọn tỉnh đến' : diemden}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ marginTop: 10, marginBottom: 20, zIndex: 1, position: 'relative' }}>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={{ flex: 4 }} onPress={() => this._setDatePickerShow()}>
								<View style={{ flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, borderRadius: 10 }}>
									<Icon name="md-calendar" style={{ width: 30, margin: 10 }} />
									{/* <View style={{ flexDirection: 'row', flex: 5, marginLeft: 0, alignItems: 'center' }}> */}
									<Text style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 0 }}>{this.state.fullDate == '' ? 'Chọn ngày đi' : this.state.fullDate}</Text>
									{/* </View> */}
								</View>
							</TouchableOpacity>
							<TouchableOpacity style={{ borderWidth: 2, borderRadius: 10, borderColor: '#c2c2c2', flex: 2, marginRight: 5, marginLeft: 5, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.searchByDay(today, this.state.keyDiemDi, this.state.keyDiemDen)}>
								<Text style={{ alignItems: 'center', justifyContent: 'center' }}>Hôm nay</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{ borderWidth: 2, borderRadius: 10, borderColor: '#c2c2c2', flex: 2, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.searchByDay(tomorrow, this.state.keyDiemDi, this.state.keyDiemDen)}>
								<Text style={{ alignItems: 'center', justifyContent: 'center' }}>Ngày mai</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ marginTop: 10, zIndex: 0, position: 'relative' }}>
						<Button style={{ height: 50, backgroundColor: colorLogo, borderColor: '#fdd600', borderWidth: 1, borderRadius: 10 }} textStyle={{ color: '#626054' }} block success onPress={() => this._getNot()}>
							<Icon name='ios-search-outline' style={{ color: '#626054' }} /> Tìm chuyến xe
						</Button>
					</View>
				</View>
				<View style={{ backgroundColor: '#f4f4f4', paddingLeft: 30, paddingRight: 30, paddingTop: 10, }}>
					<Text style={{ fontSize: 15, textAlign: 'left', fontWeight: 'bold', color: '#5b5b5b', marginBottom: 10, marginTop: 10 }}>
						CÁC TUYẾN XE PHỔ BIẾN
					</Text>
					{htmlChuyen}
				</View>
				<View style={{ padding: 30 }}>
					<Text style={{ fontSize: 15, textAlign: 'left', fontWeight: 'bold', color: '#5b5b5b', marginBottom: 10, marginTop: 10 }}>
						TIN TỨC MỚI NHẤT
					</Text>
					<ScrollView horizontal={true}>
						{htmlNews}
					</ScrollView>
				</View>
				<View style={{ marginTop: 10, backgroundColor: '#101727', padding: 10 }}>
					<Text style={{ fontSize: 12, textAlign: 'left', color: '#CDCDCD' }}>
						Công ty TNHH Vận tải Hà Sơn Hải Vân
					</Text>
					<Text style={{ fontSize: 12, textAlign: 'left', color: '#CDCDCD' }}>
						Người đại diện trước pháp Luật: Ông Trịnh Thắng.
					</Text>
					<Text style={{ fontSize: 12, textAlign: 'left', color: '#CDCDCD' }}>
						Email: lannd@hasonhaivan.com - Điện thoại: 02143662299
					</Text>
					<Text style={{ fontSize: 12, textAlign: 'left', color: '#CDCDCD' }}>
						Địa chỉ: Bến xe Trung tâm Lào Cai, Tổ 19, P. Bình Minh, Tp. Lào Cai, Tỉnh Lào Cai.
					</Text>
					<Text style={{ fontSize: 12, textAlign: 'left', color: '#CDCDCD' }}>
						Số đăng ký kinh doanh: 5300701005 do sở kế hoạch và đầu tư Tỉnh Lào Cai cấp lần đầu vào ngày 16/10/2015.
					</Text>
				</View>
			</View>
		);
		return html;
	}

	showFormEditSearch() {
		if (this.state.editFormSearch) {
			this.setState({
				editFormSearch: false
			});
		} else {
			this.setState({
				editFormSearch: true
			});
		}
	}

	async _handleSearchNextDay() {
		if (this.state.countClickNextDay) {
			let arrDay = this.state.fullDate.split('-');
			var today = new Date(arrDay[1] + '/' + arrDay[0] + '/' + arrDay[2]);
			var tomorrow = new Date(today);
			tomorrow.setDate(today.getDate() + 1);
			let dd = tomorrow.getDate();
			let mm = tomorrow.getMonth() + 1;
			let yyyy = tomorrow.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}

			let newDay = dd + '-' + mm + '-' + yyyy;

			this.setState({
				fullDate: newDay,
				loading: true,
				showContentNot: true,
				countClickNextDay: false
			});

			try {
				let params = {
					token: this.state.token,
					use_id: this.state.infoAdm.adm_id,
					day: newDay,
					diem_a: this.state.keyDiemDi,
					diem_b: this.state.keyDiemDen,
				}
				let data = await fetchData('user_so_do_giuong', params, 'GET');
				if (data.status != 404) {
					this.setState({
						results: data.so_do_giuong,
						loading: false,
						showContentNot: false,
						oneSearch: true,
						editFormSearch: false,
						countClickNextDay: true
					});
				} else if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				}
			} catch (e) {
				console.log(e);
				this.setState({
					loading: false,
					showContentNot: false,
					countClickNextDay: true
				});
			}

		}
	}

	async _handleSearchPrevDay() {
		if (this.state.countClickNextDay) {
			let arrDay = this.state.fullDate.split('-');
			var today = new Date(arrDay[1] + '/' + arrDay[0] + '/' + arrDay[2]);
			var tomorrow = new Date(today);
			tomorrow.setDate(today.getDate() - 1);
			let dd = tomorrow.getDate();
			let mm = tomorrow.getMonth() + 1;
			let yyyy = tomorrow.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}

			let newDay = dd + '-' + mm + '-' + yyyy;
			this.setState({
				fullDate: newDay,
				loading: true,
				showContentNot: true,
				countClickNextDay: false
			});

			try {
				let params = {
					token: this.state.token,
					use_id: this.state.infoAdm.adm_id,
					day: newDay,
					diem_a: this.state.keyDiemDi,
					diem_b: this.state.keyDiemDen,
				}
				let data = await fetchData('user_so_do_giuong', params, 'GET');
				if (data.status != 404) {
					this.setState({
						results: data.so_do_giuong,
						loading: false,
						showContentNot: false,
						oneSearch: true,
						editFormSearch: false,
						countClickNextDay: true
					});
				} else if (data.status == 404) {
					alert(data.mes);
					Actions.welcome({ type: 'reset' });
				}
			} catch (e) {
				console.log(e);
				this.setState({
					loading: false,
					showContentNot: false,
					countClickNextDay: true
				});
			}
		}
	}

	editFormSearch() {
		let html = [];
		let htmlBackArrow = [];
		let month = (currentDate.getMonth() + 1);
		let day = currentDate.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		let newCurrentDate = currentDate.getFullYear() + '' + day + '' + month;
		let arrDay = this.state.fullDate.split('-');
		if (parseInt(arrDay[0]) < 9) {
			arrDay[0] = '0' + arrDay[0];
		}
		if (parseInt(arrDay[1]) < 9) {
			arrDay[1] = '0' + arrDay[1];
		}
		let totalDate = arrDay[2] + '' + arrDay[0] + '' + arrDay[1];

		if (parseInt(totalDate) > parseInt(newCurrentDate)) {
			htmlBackArrow.push(
				<TouchableOpacity key="button_back_arrow" onPress={() => this._handleSearchPrevDay()} style={{ flex: 6, alignItems: 'center' }}>
					<Icon key="back_arrow" name="ios-arrow-back" style={{ backgroundColor: '#f5ac00', color: '#fff', height: 35, paddingTop: 3, paddingRight: 10, paddingLeft: 10 }} />
				</TouchableOpacity>
			);
		}

		html.push(
			<View key="button_search" style={{ flexDirection: 'row', paddingRight: 5, paddingLeft: 5, marginTop: 20 }}>
				<View style={{ flex: 4, marginRight: 5 }}>
					<View style={{ flexDirection: 'row' }}>
						{htmlBackArrow}
						<View style={{ flex: 34, alignItems: 'center', backgroundColor: '#ffc20d' }}>
							<Text style={{ backgroundColor: '#ffc20d', color: '#fff', height: 35, paddingTop: 7 }}>{this.state.fullDate}</Text>
						</View>
						<TouchableOpacity key="button_next_arrow" onPress={() => this._handleSearchNextDay()} style={{ flex: 6, alignItems: 'center' }}>
							<Icon key="next_arrow" name="ios-arrow-forward" style={{ backgroundColor: '#f5ac00', color: '#fff', height: 35, paddingTop: 3, paddingRight: 10, paddingLeft: 10 }} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ flex: 3, backgroundColor: '#42d3ff', alignItems: 'center', justifyContent: 'center' }}>
					<TouchableOpacity onPress={() => this.showFormEditSearch()}>
						<Text style={{ color: '#000' }}>{this.state.editFormSearch ? 'Đóng' : 'Sửa nơi đi, nơi đến'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
		return html;
	}

	convertPrice(price) {
		let newPrice = 0;
		if (price > 0) {
			newPrice = parseInt(price).toFixed(0).replace(/./g, function (c, i, a) {
				return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			});
		}
		return (<Text style={{ fontWeight: 'bold', color: '#ff931f', fontSize: 17 }}>{newPrice} Đ</Text>);
	}

	_onLayout = event => {
		let heightDevice = Dimensions.get('window').height;
		let widthDevice = Dimensions.get('window').width;
		this.setState({
			height: heightDevice,
			width: widthDevice
		});
	}

	renderSDT(arrSDT) {
		let html = []
		for (let i = 0; i < arrSDT.length; i++) {
			html.push(
				<TouchableOpacity
					key={i + '_SDT'}
					style={{ width: 120, margin: 5, backgroundColor: colorLogo, alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10 }}
					onPress={() => { Communications.phonecall('19006776', true); }}
				>
					<Text>{'Gọi: ' + arrSDT[i]}</Text>
				</TouchableOpacity>
			);
		}

		return html;
	}

	render() {
		let listItem1 = this.state.listItem1;
		let listItem2 = this.state.listItem2;
		let keyDiemDi = this.state.keyDiPhoBien;
		let keyDiemDen = this.state.keyDenPhoBien;
		if (this.state.keyDiemDi != undefined) {
			for (var i = 0; i < listItem1.length; i++) {
				listItem1[i].section = false;
				if (listItem1[i].value == this.state.keyDiemDi) {
					listItem1[i].section = true;
					break;
				}
			}
		}
		if (this.state.keyDiemDen != undefined) {
			for (var i = 0; i < listItem2.length; i++) {
				listItem2[i].section = false;
				if (listItem2[i].value == this.state.keyDiemDen) {
					listItem2[i].section = true;
					break;
				}
			}
		}

		let dataNot = this._renderNot(this.state.results);
		let classContainer = 'columnContainer';
		if (this.state.oneSearch) {
			classContainer = 'container';
		}

		return (
			<View style={styles[classContainer]} onLayout={this._onLayout}>
				{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
				{!this.state.oneSearch && !this.state.loading &&
					<ScrollView keyboardShouldPersistTaps="always">
						{this.renderFormSearch(listItem1, listItem2)}
					</ScrollView>
				}

				{this.state.oneSearch &&
					<ScrollView keyboardShouldPersistTaps="always">
						{this.editFormSearch()}

						{this.state.editFormSearch &&
							this.renderFormSearch(listItem1, listItem2)
						}

						{dataNot.length > 0 &&
							<View style={{ alignItems: 'center', padding: 10 }}>
								<Text style={{ fontWeight: 'bold' }}>{this.state.dataBx[dataNot[0].ben_a]} -> {this.state.dataBx[dataNot[0].ben_b]}</Text>
							</View>
						}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#b3b3b3', padding: 10 }}>
								<Text style={{ color: '#fff' }}>Thời gian</Text>
							</View>
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#b3b3b3', padding: 10 }}>
								<Text style={{ color: '#fff' }}>Giá</Text>
							</View>
						</View>
						{this.state.loading && <View style={{ alignItems: 'center' }}><Spinner /><Text>Đang tải dữ liệu...</Text></View>}
						{dataNot.length <= 0 &&
							<View style={{ alignItems: 'center', padding: 10 }}>
								<Text>Không còn chuyến nào đi từ <Text style={{ color: 'red' }}>{this.state.nameDiemDi}</Text> đến <Text style={{ color: 'red' }}>{this.state.nameDiemDen}</Text></Text>
								<Text style={{ paddingTop: 10 }}>Vui lòng chọn ngày khác.</Text>
							</View>
						}

						{!this.state.loading && <Card style={{ marginTop: -5 }} dataArray={dataNot}
							renderRow={(dataNot) =>
								<CardItem>
									{(dataNot.loai_hinh_ban_ve == 1) &&
										<TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.ViewSoDoGiuong({ title: 'Chọn chỗ', data: { did_loai_xe: dataNot.did_loai_xe, tuyen: dataNot.tuyen, dataBen: this.state.dataBx, id_dieu_do: dataNot.id_dieu_do, totalPriceInt: dataNot.price, adm_id: this.state.infoAdm.adm_id, adm_name: this.props.data.adm_name, last_login: this.props.data.last_login, gio_xuat_ben: dataNot.did_gio_xuat_ben_that, notId: dataNot.not_id, day: this.state.fullDate, notTuyenId: dataNot.not_tuy_id, benA: dataNot.ben_a, benB: dataNot.ben_b, laixe1: dataNot.laixe1, laixe2: dataNot.laixe2, tiepvien: dataNot.tiepvien, did_id: dataNot.did_id } })}>
											<View style={{ flex: 2 }}>
												<Text><Text style={{ fontWeight: 'bold' }}>{dataNot.gio_don}</Text> - Thời gian đón</Text>
												<Text><Text style={{ fontWeight: 'bold' }}>{dataNot.did_gio_xuat_ben_that}</Text> - Thời gian xuất bến</Text>
												<Text>Tuyến: <Text style={{ fontWeight: 'bold' }}>{dataNot.tuyen}</Text></Text>
												<Text>{dataNot.tenSoDo}</Text>
											</View>
											<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
												{dataNot.did_loai_xe == 1 &&
													<View>
														<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
													</View>
												}
												<View style={{ padding: 5, alignItems: 'center', justifyContent: 'center' }}>
													{this.convertPrice((dataNot.price_min > 0) ? dataNot.price_min : dataNot.price)}
												</View>
												<Text>Số chỗ trống: {dataNot.soChoTrong}</Text>
												<View style={{ margin: 5, backgroundColor: colorLogo, alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10 }}>
													<Text>Chọn Chỗ</Text>
												</View>
											</View>
										</TouchableOpacity>
									}

									{(dataNot.loai_hinh_ban_ve == 2) &&
										<View style={{ flexDirection: 'row' }} >
											<View style={{ flex: 2 }}>
												<Text><Text style={{ fontWeight: 'bold' }}>{dataNot.gio_don}</Text> - Thời gian đón</Text>
												{/* <Text style={{ fontWeight: 'bold' }}>{this.state.dataBx[dataNot.ben_a]} -> {this.state.dataBx[dataNot.ben_b]}</Text> */}
												<Text><Text style={{ fontWeight: 'bold' }}>{dataNot.did_gio_xuat_ben_that}</Text> - Thời gian xuất bến</Text>
												<Text>Tuyến: <Text style={{ fontWeight: 'bold' }}>{dataNot.tuyen}</Text></Text>
												<Text>{dataNot.tenSoDo}</Text>
											</View>
											<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
												{dataNot.did_loai_xe == 1 &&
													<View>
														<Thumbnail size={60} source={require('../../Skin/Images/vip.png')} />
													</View>
												}
												<View style={{ padding: 5, alignItems: 'center', justifyContent: 'center' }}>
													{this.convertPrice((dataNot.price_min > 0) ? dataNot.price_min : dataNot.price)}
												</View>
												<Text>Số chỗ trống: {dataNot.soChoTrong}</Text>
												{/* <View style={{ backgroundColor: '#f9af00', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
													<Text>Chọn Chỗ</Text>
												</View> */}

												{this.renderSDT(dataNot.SDT)}
											</View>
										</View>
									}
								</CardItem>
							}>
						</Card>}
					</ScrollView>
				}

				<Modal style={[{ height: 370, paddingTop: 50 }]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
					<TouchableOpacity onPress={() => this.closeModal()} style={{ width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10 }}>
						<Icon name="ios-close-circle" />
					</TouchableOpacity>
					<ScrollView>
						{this._renderDatePicker()}
					</ScrollView>
				</Modal>
				<Modal style={[{ height: 370, paddingTop: 50 }]} position={"center"} ref={"modalCalendarSearch"} isDisabled={this.state.isDisabled}>
					<TouchableOpacity onPress={() => this.closeModalCalendarSearch()} style={{ width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10 }}>
						<Icon name="ios-close-circle" />
					</TouchableOpacity>
					<ScrollView>
						{this._renderDatePickerSearch(keyDiemDi, keyDiemDen)}
					</ScrollView>
				</Modal>
				<Modal style={{ height: heightDevice, alignItems: 'center' }} position={"center"} ref={"modalDiemDi"} isDisabled={this.state.isDisabled}>
					{this._renderModalDiemDi()}
				</Modal>
				<Modal style={{ height: heightDevice, alignItems: 'center' }} position={"center"} ref={"modalDiemDen"} isDisabled={this.state.isDisabled}>
					{this._renderModalDiemDen()}
				</Modal>
			</View>
		);
	}

	_renderModalDiemDi() {
		return (
			<View key="1" style={{ width: widthDevice, height: heightDevice, position: 'relative', paddingBottom: 60, backgroundColor: '#ecebeb' }}>

				{/* <View style={[styles.close_popup, { borderColor: '#ccc', borderWidth: 1 }]}>
					<TouchableOpacity onPress={() => this.closeModalDiemDi()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
						<Text>Đóng</Text>
					</TouchableOpacity>
				</View> */}

				<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
					<View style={{ flexDirection: 'row', position: 'absolute', top: 0, right: 0, left: 0, zIndex: 99 }}>
						<View
							onLayout={this.onLayoutView}
							style={{
								alignItems: 'center',
								justifyContent: 'space-between',
								flexDirection: 'row',
								flex: 3,
								borderColor: '#ccc',
								borderWidth: 1,
								borderRadius: 10,
								marginLeft: 10,
								marginTop: 30,
								// marginBottom: 10, 
								backgroundColor: '#FFFFFF',
								padding: 5,
								height: 60,
							}}
						>
							<Icon name="md-bus" style={{ paddingLeft: 10 }} />

							<View style={{
								// flexDirection: 'row',
								position: 'absolute',
								zIndex: 99,
								// top: 10,
								left: 40,
								// borderWidth: 1,
								width: this.state.widthView - 70,
								height: 50,
								// justifyContent: 'center', 
								// alignItems: 'center',
							}}>
								<Input
									autoFocus={true}
									placeholder="Nhập nơi đi"
									value={this.state.nameDiemDi}
									onChangeText={(nameDiemDi) => this._handleSetDiemDi(nameDiemDi)}
									style={{
										position: 'relative',
										paddingLeft: 10,
										paddingRight: 10,
										// borderWidth: 1,
										marginTop: 5
									}}
								/>
							</View>
							<TouchableOpacity onPress={() => { this.setState({ keyDiemDi: '', nameDiemDi: '' }); }}
								style={{
									alignItems: 'flex-end',
									justifyContent: 'center',
									paddingRight: 5
								}}>
								<Icon name="md-close" />
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							onPress={() => this.closeModalDiemDi()}
							style={{
								alignItems: 'center', justifyContent: 'center', borderColor: colorLogo, borderWidth: 1, flex: 1, borderRadius: 10, marginHorizontal: 10, marginTop: 30,
								// marginBottom: 10, 
								backgroundColor: colorLogo, padding: 5
							}}
						>
							<Text>Đóng</Text>
						</TouchableOpacity>
					</View>
					<View style={{ marginHorizontal: 10, backgroundColor: '#f6fbff', marginTop: 100 }}>
						{this._handleSearchAutocomplate1(this.state.nameDiemDi)}
					</View>
				</View>
			</View>
		)
	}

	onLayoutView = event => {
		let { width, height } = event.nativeEvent.layout;
		this.setState({
			widthView: width,
			heightView: height,
		});
	}

	openModalDiemDi(id) {
		this.refs.modalDiemDi.open();
	}

	closeModalDiemDi(id) {
		// this.setState({ keyDiemDi: '', nameDiemDi: '' });
		this.refs.modalDiemDi.close();
	}

	_renderModalDiemDen() {
		return (
			<View key="1" style={{ width: widthDevice, height: heightDevice, position: 'relative', paddingBottom: 60, backgroundColor: '#ecebeb' }}>

				{/* <View style={styles.close_popup}>
					<TouchableOpacity onPress={() => this.closeModalDiemDen()} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
						<Icon name="md-close" style={{ fontSize: 30 }} />
					</TouchableOpacity>
				</View> */}

				<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
					{/* <View style={{ flexDirection: 'row', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, marginHorizontal: 10, marginTop: 30, marginBottom: 10, backgroundColor: '#FFFFFF', padding: 5 }}>
						<Icon name="md-bus" style={{ width: 30 }} />
						<Input autoFocus={true} placeholder="Nhập nơi đến" value={this.state.nameDiemDen} onChangeText={(nameDiemDen) => this._handleSetDiemDen(nameDiemDen)} style={{ height: 40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15 }} />
					</View> */}
					<View style={{ flexDirection: 'row', position: 'absolute', top: 0, right: 0, left: 0, zIndex: 99 }}>
						<View
							onLayout={this.onLayoutView}
							style={{
								flexDirection: 'row',
								flex: 3,
								borderColor: '#ccc',
								borderWidth: 1,
								borderRadius: 10,
								marginLeft: 10,
								marginTop: 30,
								// marginBottom: 10, 
								backgroundColor: '#FFFFFF',
								padding: 5,
								height: 60,
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Icon name="md-bus" style={{ paddingLeft: 10 }} />

							<View style={{
								position: 'absolute',
								zIndex: 99,
								// top: 10,
								left: 40,
								// borderWidth: 1,
								width: this.state.widthView - 70,
								height: 50,
							}}>
								<Input
									autoFocus={true}
									placeholder="Nhập nơi đến"
									value={this.state.nameDiemDen}
									onChangeText={(nameDiemDen) => this._handleSetDiemDen(nameDiemDen)}
									style={{
										position: 'relative',
										paddingLeft: 10,
										paddingRight: 10,
										// borderWidth: 1,
										marginTop: 5
									}}
								/>
							</View>

							{/* <View style={styles.close_popup}> */}
							<TouchableOpacity
								onPress={() => { this.setState({ keyDiemDen: '', nameDiemDen: '' }); }}
								style={{ 
									alignItems: 'flex-end', 
									justifyContent: 'center',
									paddingRight: 5,
								}}>
									<Icon name="md-close" style={{ fontSize: 30 }}
								/>
							</TouchableOpacity>
							{/* </View> */}
						</View>

						<TouchableOpacity
							onPress={() => this.closeModalDiemDen()}
							style={{
								alignItems: 'center', justifyContent: 'center', borderColor: colorLogo, borderWidth: 1, flex: 1, borderRadius: 10, marginHorizontal: 10, marginTop: 30,
								// marginBottom: 10, 
								backgroundColor: colorLogo, padding: 5
							}}
						>
							<Text>Đóng</Text>
						</TouchableOpacity>
					</View>

					<View style={{ marginHorizontal: 10, backgroundColor: '#f6fbff', marginTop: 100 }}>
						{this._handleSearchAutocomplate2(this.state.nameDiemDen)}
					</View>
				</View>
			</View>
		)
	}

	openModalDiemDen(id) {
		this.refs.modalDiemDen.open();
	}

	closeModalDiemDen(id) {
		this.refs.modalDiemDen.close();
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 59,
		position: 'relative',
	},
	columnContainer: {
		flex: 1,
		marginTop: 59,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentAbsolute: {
		position: 'absolute',
		top: 0
	},
	selectedDate: {
		backgroundColor: 'rgba(0,0,0,0)',
		color: '#000',
	},
	modal: {
		alignItems: 'center',
		top: 80,
		paddingRight: 20,
		paddingLeft: 20
	},
	modalPopup: {
	},
	close_popup: {
		position: 'absolute',
		zIndex: 99,
		top: 5,
		right: 10,
		// width: 50,
		// height: 50
	},
});

export default HomeIOS
