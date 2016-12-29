import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
   Dimensions,
   TextInput,
	View,
	ScrollView,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import {domain,cache} from '../../Config/common';

import { Text, Input, Button, Card, CardItem, Spinner, Icon} from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
import { Col, Row, Grid } from "react-native-easy-grid";
import StorageHelper from '../../Components/StorageHelper';

const heightDevice = Dimensions.get('window').height;
const widthDevice = Dimensions.get('window').width;
const urlApi = domain+'/api/api_user_so_do_giuong.php';
const currentDate = new Date();

class HomeIOS extends Component {
   constructor(props) {
      super(props);
      let date = new Date();
      this.state = {
         date: date,
         day: date.getDate(),
         month: (date.getMonth()+1),
         year: date.getFullYear(),
         fullDate: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),
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
			infoAdm: []
      };
   }

   onDateChange(date) {
      let currentSelectDate = date.date;
      this.setState({
         date: currentSelectDate,
         day: currentSelectDate.getDate(),
         month: (currentSelectDate.getMonth()+1),
         year: currentSelectDate.getFullYear(),
         fullDate: currentSelectDate.getDate()+'-'+(currentSelectDate.getMonth()+1)+'-'+currentSelectDate.getFullYear()
      });
   }

   _setDatePickerShow() {
		this.openModal();
   }

   _renderDatePicker() {
      return (
         <CalendarPicker
            selectedDate={this.state.date}
            onDateChange={(date) => this.onDateChange({date})}
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
		Object.keys(results).map(function(key) {
			data.push({laixe1: results[key].laixe1, laixe2: results[key].laixe2, tiepvien: results[key].tiepvien, gio_don: results[key].gio_don, soChoTrong: results[key].tongSoChoConLai, tenSoDo: results[key].ten_so_do,price: results[key].price, tuyen: results[key].tuyen, not_id:results[key].not_id, id_dieu_do: results[key].id_dieu_do, did_gio_xuat_ben_that: results[key].did_gio_xuat_ben_that, not_tuy_id: results[key].not_tuy_id, ben_a: results[key].diem_di, ben_b: results[key].diem_den});
		});

      return data;
   }

	async componentWillMount() {

		let results = await StorageHelper.getStore('infoUser');
		results = JSON.parse(results);
		let admId = results.adm_id;
		let token = results.token;
		this.setState({
			infoAdm: results,
			token: token
		});

		let that = this;
      fetch(domain+'/api/api_user_ben.php?token='+token+'&use_id='+admId+'&type=home', {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			let listItem1 = [],
				listItem2 = [];
			if(responseJson.status == 200) {
				Object.keys(responseJson.dataBx).map(function(key) {
					listItem1.push({key: key.toString(), label: responseJson.dataBx[key], value: key});
					listItem2.push({key: key.toString(),  label: responseJson.dataBx[key], value: key});
				});
			}
			that.setState({
				listItem1: listItem1,
				listItem2: listItem2,
				dataBx: responseJson.dataBx
			});
      })
      .catch((error) => {
         console.error(error);
      });
	}

   _getNot() {
		checkData = false;
		if(this.state.keyDiemDi == '') {
			checkData = false;
			alert('Vui lòng chọn Điểm Đi!');
		}else {
			if(this.state.keyDiemDen == '') {
				checkData = false;
				alert('Vui lòng chọn Điểm Đến!');
			}else {
				if(this.state.keyDiemDi == this.state.keyDiemDen) {
					checkData = false;
					alert('Điểm đi và Điểm đến không được trùng nhau!');
				}else {
					checkData = true;
				}
			}
		}

		if(checkData) {

			let newCurrentDate = currentDate.getDate()+(currentDate.getMonth()+1)+currentDate.getFullYear();
			let selectCurrentDate = this.state.day+this.state.month+this.state.year;
			if(newCurrentDate <= selectCurrentDate) {
		      var that = this;
				that.setState({
					loading: true,
					showContentNot: true
				});

				fetch(urlApi+'?token='+that.state.token+'&use_id='+this.state.infoAdm.adm_id+'&day='+that.state.fullDate+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen, {
					headers: {
						'Cache-Control': cache
					}
				})
            .then((response) => response.json())
            .then((responseJson) => {
					if(responseJson.status != 404) {
	               that.setState({
	                  results:responseJson.so_do_giuong,
	                  loading: false,
							showContentNot: false,
							oneSearch: true,
							editFormSearch: false
	               });
	               return responseJson.so_do_giuong;
					}else if(responseJson.status == 404){
						alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
						Actions.welcome({type: 'reset'});
					}
            })
            .catch((error) => {
               that.setState({
                  loading: false,
						showContentNot: false
               });
               console.error(error);
            });
			}else {
				alert('Ngày tháng không hợp lệ!');
			}
		}
   }

	openModal(id) {
		this.refs.modal3.open();
	}

	closeModal(id) {
		this.refs.modal3.close();
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

	_handleSearchAutocomplate1(nameDiemDi) {
		let listItem1 = this.state.listItem1;
		let listItem1_1 = this._str_slug(this.state.listItem1);
		let html = [];
		let childHtml = [];
		for(var i = 0; i < listItem1.length; i++) {
			let label = listItem1[i].label.toLowerCase();
			let convertNameDiemDi = nameDiemDi.toLowerCase();
			let check = false;

			if(listItem1_1[i].clabel.includes(convertNameDiemDi)) {
				check = true;
			}else {
				if(label.includes(convertNameDiemDi)) {
					check = true;
				}
			}

			if(check) {
				let value = listItem1[i].value;
				let label = listItem1[i].label;
				childHtml.push(
					<View key={i} style={{borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10}}>
						<TouchableOpacity onPress={() => this.setState({keyDiemDi: value, nameDiemDi: label, search1: false}) }>
							<Text>{label}</Text>
						</TouchableOpacity>
					</View>
				);
			}
		}

		html.push(
			<View key="scroll_autocomplate1" style={{minHeight:0, maxHeight:330, overflow: 'hidden', borderTopWidth: 1, borderTopColor: '#ccc'}}>
				{childHtml}
			</View>
		);
		return html;
	}

	_str_slug(data) {
		let newDataStr = [],
			title, slug;

		Object.keys(data).map(function(key) {
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

			newDataStr.push({key: key.toString(), label: data[key].label, clabel: slug, value: key});
		});

		return newDataStr;
	}

	_handleSearchAutocomplate2(nameDiemDen) {
		let listItem2 = this.state.listItem2;
		let listItem2_1 = this._str_slug(this.state.listItem2);
		let html = [],
			childHtml = [];
		for(var i = 0; i < listItem2.length; i++) {

			let label = listItem2[i].label.toLowerCase();
			let convertNameDiemDen = nameDiemDen.toLowerCase();
			let check = false;

			if(listItem2_1[i].clabel.includes(convertNameDiemDen)) {
				check = true;
			}else {
				if(label.includes(convertNameDiemDen)) {
					check = true;
				}
			}


			if(check) {
				let value = listItem2[i].value;
				let label = listItem2[i].label;
				childHtml.push(
					<View key={i} style={{borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10}}>
						<TouchableOpacity onPress={() => this.setState({keyDiemDen: value, nameDiemDen: label, search2: false}) }>
							<Text>{label}</Text>
						</TouchableOpacity>
					</View>
				);
			}
		}

		html.push(
			<View key="scroll_autocomplate2" style={{minHeight:0, maxHeight:330, overflow: 'hidden',  borderTopWidth: 1, borderTopColor: '#ccc'}}>
				{childHtml}
			</View>
		);
		return html;
	}

	_handleSetDiemDi(nameDiemDi) {
		if(nameDiemDi.length > 0) {
			this.setState({nameDiemDi: nameDiemDi, search1: true});
		}else {
			this.setState({nameDiemDi: nameDiemDi, search1: false});
		}
	}

	_handleSetDiemDen(nameDiemDen) {
		if(nameDiemDen.length > 0) {
			this.setState({nameDiemDen: nameDiemDen, search2: true});
		}else {
			this.setState({nameDiemDen: nameDiemDen, search2: false});
		}
	}

	renderFormSearch(listItem1, listItem2) {
		let html = [];
		html.push(
			<View key="form_search" style={{flexDirection: 'column', padding: 30, marginTop: 10, width: widthDevice}}>
				<View style={{position: 'relative'}}>
					<View style={{flexDirection: 'column', justifyContent: 'center'}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Icon name="md-bus" style={{width: 30}} />
							<Text style={{width: 150, fontSize: 9, marginTop: -10}}>Điểm đi</Text>
						</View>
						<View style={{borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 30}}>
							<Input autoFocus={this.state.focus} placeholder="Nhập tỉnh đi" value={this.state.nameDiemDi} onChangeText={(nameDiemDi) => this._handleSetDiemDi(nameDiemDi)}  style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15}} />
						</View>
						{this.state.search1 &&
							<View style={{marginLeft: 30, backgroundColor: '#f6fbff'}}>
								{this._handleSearchAutocomplate1(this.state.nameDiemDi)}
							</View>
						}
				 	</View>
				</View>

				<View style={{marginTop: 20, marginBottom: 20}}>
						<View style={{flexDirection: 'column', justifyContent: 'center'}}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Icon name="md-bus" style={{width: 30}} />
								<Text style={{width: 150, fontSize: 9, marginTop: -10}}>Điểm đến</Text>
							</View>
							<View style={{borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 30}}>
								<Input placeholder="Nhập tỉnh đến" value={this.state.nameDiemDen} onChangeText={(nameDiemDen) => this._handleSetDiemDen(nameDiemDen)}  style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15}} />
							</View>
							{this.state.search2 &&
								<View style={{marginLeft: 30, backgroundColor: '#f6fbff'}}>
									{this._handleSearchAutocomplate2(this.state.nameDiemDen)}
								</View>
							}
						</View>
				</View>
				<View style={{marginTop: 10, marginBottom: 20, zIndex: 1, position: 'relative'}}>
					<View>
						<TouchableOpacity onPress={() => this._setDatePickerShow()}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Icon name="md-calendar" style={{width: 30, flex: 1}} />
								<View style={{flex: 10, borderBottomColor: '#ccc', borderBottomWidth: 1, marginLeft: 0}}>
									<Text style={{height:40, alignItems: 'center', justifyContent: 'center', paddingTop: 10, marginTop: -10, paddingLeft: 15}}>{this.state.fullDate == ''? 'Chọn điểm đi' : this.state.fullDate}</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{marginTop: 20, zIndex: 0, position: 'relative'}}>
					<Button style={{height: 50}} block success onPress={() => this._getNot()}><Icon name='ios-search-outline' /> Tìm kiếm</Button>
				</View>
			</View>
		);
		return html;
	}

	showFormEditSearch() {
		if(this.state.editFormSearch) {
			this.setState({
				editFormSearch: false
			});
		}else {
			this.setState({
				editFormSearch: true
			});
		}
	}

	_handleSearchNextDay() {
		if(this.state.countClickNextDay) {
			let arrDay = this.state.fullDate.split('-');
			var today = new Date(arrDay[1]+'/'+arrDay[0]+'/'+arrDay[2]);
			var tomorrow = new Date(today);
			tomorrow.setDate(today.getDate()+1);
			let newDay = tomorrow.getDate()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getFullYear();
			this.setState({
				fullDate: newDay
			});

			var that = this;
			that.setState({
				loading: true,
				showContentNot: true,
				countClickNextDay: false
			});
			fetch(urlApi+'?token='+that.state.token+'&use_id='+this.state.infoAdm.adm_id+'&day='+newDay+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status != 404) {
					that.setState({
						results:responseJson.so_do_giuong,
						loading: false,
						showContentNot: false,
						oneSearch: true,
						editFormSearch: false,
						countClickNextDay: true
					});
				}else if(responseJson.status == 404) {
					alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
					Actions.welcome({type: 'reset'});
				}
			})
			.catch((error) => {
				that.setState({
					loading: false,
					showContentNot: false,
					countClickNextDay: true
				});
				console.error(error);
			});
		}
	}

	_handleSearchPrevDay() {
		if(this.state.countClickNextDay) {
			let arrDay = this.state.fullDate.split('-');
			var today = new Date(arrDay[1]+'/'+arrDay[0]+'/'+arrDay[2]);
			var tomorrow = new Date(today);
			tomorrow.setDate(today.getDate()-1);
			let newDay = tomorrow.getDate()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getFullYear();
			this.setState({
				fullDate: newDay
			});

			var that = this;
			that.setState({
				loading: true,
				showContentNot: true,
				countClickNextDay: false
			});
			fetch(urlApi+'?token='+that.state.token+'&use_id='+this.state.infoAdm.adm_id+'&day='+newDay+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.status != 404) {
					that.setState({
						results:responseJson.so_do_giuong,
						loading: false,
						showContentNot: false,
						oneSearch: true,
						editFormSearch: false,
						countClickNextDay: true
					});
				}else if(responseJson.status == 404) {
					alert('Tài khoản của bạn đã được đăng nhập ở thiết bị khác.');
					Actions.welcome({type: 'reset'});
				}
			})
			.catch((error) => {
				that.setState({
					loading: false,
					showContentNot: false,
					countClickNextDay: true
				});
				console.error(error);
			});
		}
	}

	editFormSearch() {
		let html = [];
		let htmlBackArrow = [];
		let month = (currentDate.getMonth()+1);
		let day = currentDate.getDate();
		if(month < 10) {
			month = '0'+month;
		}
		if(day < 10) {
			day = '0'+day;
		}
		let newCurrentDate = currentDate.getFullYear()+''+day+''+month;
		let arrDay = this.state.fullDate.split('-');
		if(parseInt(arrDay[0]) < 9) {
			arrDay[0] = '0'+arrDay[0];
		}
		if(parseInt(arrDay[1]) < 9) {
			arrDay[1] = '0'+arrDay[1];
		}
		let totalDate = arrDay[2]+''+arrDay[0]+''+arrDay[1];

		if(parseInt(totalDate) > parseInt(newCurrentDate)) {
			htmlBackArrow.push(
				<TouchableOpacity key="button_back_arrow" onPress={() => this._handleSearchPrevDay()} style={{flex: 6, alignItems: 'center'}}>
					<Icon key="back_arrow" name="ios-arrow-back" style={{backgroundColor: '#f5ac00', color: '#fff', height: 35, paddingTop: 3, paddingRight: 10, paddingLeft: 10}} />
				</TouchableOpacity>
			);
		}

		html.push(
			<View key="button_search" style={{flexDirection: 'row', paddingRight: 5, paddingLeft: 5, marginTop: 20}}>
				<View style={{flex: 4, marginRight: 5}}>
					<View style={{flexDirection: 'row'}}>
						{htmlBackArrow}
						<View style={{flex: 34, alignItems: 'center', backgroundColor: '#ffc20d'}}>
							<Text style={{backgroundColor: '#ffc20d', color: '#fff', height: 35, paddingTop: 7}}>{this.state.fullDate}</Text>
						</View>
						<TouchableOpacity key="button_next_arrow" onPress={() => this._handleSearchNextDay()} style={{flex: 6, alignItems: 'center'}}>
							<Icon key="next_arrow" name="ios-arrow-forward" style={{backgroundColor: '#f5ac00', color: '#fff', height: 35, paddingTop: 3, paddingRight: 10, paddingLeft: 10}} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{flex: 3, backgroundColor: '#42d3ff', alignItems: 'center', justifyContent: 'center'}}>
					<TouchableOpacity onPress={() => this.showFormEditSearch()}>
						<Text style={{color: '#000'}}>{this.state.editFormSearch? 'Đóng' : 'Sửa nơi đi, nơi đến'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
		return html;
	}

	convertPrice(price) {
		let newPrice = 0;
		if(price > 0) {
			newPrice = parseInt(price).toFixed(0).replace(/./g, function(c, i, a) {
				return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
			});
		}
		return(<Text style={{fontWeight: 'bold', color: '#ff931f', fontSize: 17}}>{newPrice} VNĐ</Text>);
	}

   render() {
		let listItem1 = this.state.listItem1;
		let listItem2 = this.state.listItem2;
		if(this.state.keyDiemDi != undefined) {
			for(var i = 0; i < listItem1.length; i++) {
				listItem1[i].section = false;
				if(listItem1[i].value == this.state.keyDiemDi) {
					listItem1[i].section = true;
					break;
				}
			}
		}
		if(this.state.keyDiemDen != undefined) {
			for(var i = 0; i < listItem2.length; i++) {
				listItem2[i].section = false;
				if(listItem2[i].value == this.state.keyDiemDen) {
					listItem2[i].section = true;
					break;
				}
			}
		}

      let dataNot = this._renderNot(this.state.results);
		let classContainer = 'columnContainer';
		if(this.state.oneSearch) {
			classContainer = 'container';
		}

      return(
			<View style={styles[classContainer]}>
				{!this.state.oneSearch &&
					<ScrollView keyboardShouldPersistTaps={true}>
						{this.renderFormSearch(listItem1, listItem2)}
					</ScrollView>
				}

				{this.state.oneSearch &&
					<ScrollView keyboardShouldPersistTaps={true}>
						{this.editFormSearch()}

						{this.state.editFormSearch &&
							this.renderFormSearch(listItem1, listItem2)
						}
						<View style={{flexDirection: 'row'}}>
							<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#b3b3b3', padding: 10}}>
								<Text style={{color: '#fff'}}>Thời gian</Text>
							</View>
							<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#b3b3b3', padding: 10}}>
								<Text style={{color: '#fff'}}>Giá</Text>
							</View>
						</View>
							{ this.state.showContentNot && <Spinner /> }
							{dataNot.length <= 0 &&
								<View style={{alignItems: 'center', padding: 10}}>
									<Text>Không còn chuyến nào đi từ <Text style={{color: 'red'}}>{this.state.nameDiemDi}</Text> đến <Text style={{color: 'red'}}>{this.state.nameDiemDen}</Text></Text>
									<Text style={{paddingTop: 10}}>Vui lòng chọn ngày khác.</Text>
								</View>
							}

							{ !this.state.loading && <Card  style={{marginTop: -5}} dataArray={dataNot}
			                 renderRow={(dataNot) =>

			                   <CardItem>
											<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => Actions.ViewSoDoGiuong({title: 'Chọn chỗ', data: {tuyen: dataNot.tuyen, dataBen: this.state.dataBx, id_dieu_do: dataNot.id_dieu_do, totalPriceInt: dataNot.price, adm_id: this.state.infoAdm.adm_id, adm_name: this.props.data.adm_name, last_login: this.props.data.last_login, gio_xuat_ben: dataNot.did_gio_xuat_ben_that, notId:dataNot.not_id, day:this.state.fullDate, notTuyenId: dataNot.not_tuy_id, benA: dataNot.ben_a, benB: dataNot.ben_b, laixe1: dataNot.laixe1, laixe2: dataNot.laixe2, tiepvien: dataNot.tiepvien}})}>
												<View style={{flex: 2}}>
													<Text><Text style={{fontWeight: 'bold'}}>{dataNot.gio_don}</Text> - Thời gian đón</Text>
													<Text style={{fontWeight: 'bold'}}>{this.state.dataBx[dataNot.ben_a]} -> {this.state.dataBx[dataNot.ben_b]}</Text>
													<Text><Text style={{fontWeight: 'bold'}}>{dataNot.did_gio_xuat_ben_that}</Text> - Thời gian xuất bến</Text>
													<Text>Tuyến: <Text style={{fontWeight: 'bold'}}>{dataNot.tuyen}</Text></Text>
													<Text>{dataNot.tenSoDo}</Text>
													<Text>Số chỗ trống: {dataNot.soChoTrong}</Text>
												</View>
												<View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',alignItems: 'center'}}>
													<View style={{padding: 5, alignItems: 'center', justifyContent: 'center'}}>
														{this.convertPrice(dataNot.price)}
													</View>
		  											<View style={{backgroundColor: '#f9af00', alignItems: 'center', justifyContent: 'center', padding: 10}}>
														<Text>Chọn Chỗ</Text>
													</View>
												</View>
											</TouchableOpacity>
			                   </CardItem>
			               }>
			           </Card>}
				  </ScrollView>
			  }

				<Modal style={[{height: 370, paddingTop: 50}]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
					<TouchableOpacity onPress={() => this.closeModal()} style={{width: 50, height: 40, position: 'absolute', right: 0, top: 0, padding: 10}}>
						<Icon name="ios-close-circle" />
					</TouchableOpacity>
					<ScrollView>
			  			{this._renderDatePicker()}
					</ScrollView>
	        	</Modal>
      	</View>

      );
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
});

export default HomeIOS
