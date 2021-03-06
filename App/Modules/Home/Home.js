import React, { Component } from 'react';
import {
   AppRegistry,
   StyleSheet,
   Dimensions,
   TextInput,
	View,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import {domain,cache} from '../../Config/common';
import { Text, Button, Card, CardItem, Spinner, Icon } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import ModalPicker from 'react-native-modal-picker';
import { Col, Row, Grid } from "react-native-easy-grid";

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
			countClickNextDay: true
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
			data.push({soChoTrong: results[key].tongSoChoConLai, tenSoDo: results[key].ten_so_do,price: results[key].price, tuyen: results[key].tuyen, not_id:results[key].not_id, id_dieu_do: results[key].id_dieu_do, did_gio_xuat_ben_that: results[key].did_gio_xuat_ben_that, not_tuy_id: results[key].not_tuy_id, ben_a: results[key].diem_di, ben_b: results[key].diem_den});
		});

      return data;
   }

	componentDidMount() {
		let that = this;
      fetch(domain+'/api/api_user_ben.php?type=home', {
			headers: {
				'Cache-Control': cache
			}
		})
      .then((response) => response.json())
      .then((responseJson) => {
			let listItem1 = [],
				listItem2 = [];
			Object.keys(responseJson.dataBx).map(function(key) {
				listItem1.push({key: key.toString(), label: responseJson.dataBx[key], value: key});
				listItem2.push({key: key.toString(),  label: responseJson.dataBx[key], value: key});
			});
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
				fetch(urlApi+'?day='+that.state.fullDate+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen, {
					headers: {
						'Cache-Control': cache
					}
				})
            .then((response) => response.json())
            .then((responseJson) => {
               that.setState({
                  results:responseJson.so_do_giuong,
                  loading: false,
						showContentNot: false,
						oneSearch: true,
						editFormSearch: false
               });
               return responseJson.so_do_giuong;
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

	renderFormSearch(listItem1, listItem2) {
		let html = [];
		html.push(
			<View key="form_search" style={{flexDirection: 'column', padding: 30, marginTop: 10}}>
				<View>
					<Text style={{marginBottom: 5}}>Điểm đi:</Text>
					<View style={{flexDirection: 'row'}}>
						<ModalPicker
							key="diemdi"
							data={listItem1}
							initValue="Chọn điểm đi"
							onChange={(option)=>{ this.setState({nameDiemDi: option.label, keyDiemDi: option.value}) }}>
							<TextInput
							style={{borderWidth:1, borderColor:'#ccc', padding:10, height:39, width: (widthDevice-60), marginBottom: 10}}
							editable={false}
							placeholder="Vui lòng chọn điểm đi"
							value={this.state.nameDiemDi} />
						</ModalPicker>
					</View>
				</View>
				<View>
					<Text style={{marginBottom: 5}}>Điểm đến:</Text>
					<View style={{flexDirection: 'row'}}>
						<ModalPicker
							key="diemden"
							data={listItem2}
							initValue="Chọn điểm đến"
							onChange={(option2)=>{ this.setState({nameDiemDen: option2.label, keyDiemDen: option2.value}) }}>
							<TextInput
							style={{borderWidth:1, borderColor:'#ccc', padding:10, height:39, width: (widthDevice-60), marginBottom: 10}}
							editable={false}
							placeholder="Vui lòng chọn điểm đến"
							value={this.state.nameDiemDen} />
						</ModalPicker>
					</View>
				</View>
				<View>
					<Text style={{marginBottom: 5}}>Ngày đi:</Text>
					<View style={{flexDirection: 'row'}}>
						<Text style={{flex: 4, borderWidth:1, borderColor:'#ccc', padding:10, height:39}} onPress={() => this._setDatePickerShow()}>{this.state.fullDate}</Text>
					</View>
				</View>
				<View style={{marginTop: 20}}>
					<Button block success onPress={() => this._getNot()}><Icon name='ios-search-outline' /> Tìm kiếm</Button>
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
			let arrNewDay = tomorrow.toLocaleDateString().split('/');
			let newDay = arrNewDay[1]+'-'+arrNewDay[0]+'-'+arrNewDay[2];

			this.setState({
				fullDate: newDay
			});

			var that = this;
			that.setState({
				loading: true,
				showContentNot: true,
				countClickNextDay: false
			});
			fetch(urlApi+'?day='+newDay+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				that.setState({
					results:responseJson.so_do_giuong,
					loading: false,
					showContentNot: false,
					oneSearch: true,
					editFormSearch: false,
					countClickNextDay: true
				});
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
			let arrNewDay = tomorrow.toLocaleDateString().split('/');
			let newDay = arrNewDay[1]+'-'+arrNewDay[0]+'-'+arrNewDay[2];

			this.setState({
				fullDate: newDay
			});

			var that = this;
			that.setState({
				loading: true,
				showContentNot: true,
				countClickNextDay: false
			});
			fetch(urlApi+'?day='+newDay+'&diem_a='+this.state.keyDiemDi+'&diem_b='+this.state.keyDiemDen, {
				headers: {
					'Cache-Control': cache
				}
			})
			.then((response) => response.json())
			.then((responseJson) => {
				that.setState({
					results:responseJson.so_do_giuong,
					loading: false,
					showContentNot: false,
					oneSearch: true,
					editFormSearch: false,
					countClickNextDay: true
				});
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
				<TouchableOpacity key="button_back_arrow" onPress={() => this._handleSearchPrevDay()} style={{flex: 1}}>
					<Icon key="back_arrow" name="ios-arrow-back" style={{backgroundColor: '#f5ac00', color: '#fff', height: 35, paddingTop: 3, paddingLeft: 4}} />
				</TouchableOpacity>
			);
		}

		html.push(
			<View key="button_search" style={{flexDirection: 'row', paddingRight: 5, paddingLeft: 5, marginTop: 20}}>
				<View style={{flex: 2, marginRight: 50}}>
					<View style={{flexDirection: 'row'}}>
						{htmlBackArrow}
						<Text style={{flex: 5, backgroundColor: '#ffc20d', color: '#fff', height: 35, paddingTop: 7, paddingLeft: 15}}>{this.state.fullDate}</Text>
						<TouchableOpacity onPress={() => this._handleSearchNextDay()} style={{flex: 1}}>
							<Icon key="next_arrow" name="ios-arrow-forward" style={{backgroundColor: '#f5ac00', color: '#fff', height: 35, paddingTop: 3, paddingLeft: 5}} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{flex: 3, backgroundColor: '#ffc20d', alignItems: 'center', justifyContent: 'center'}}>
					<TouchableOpacity onPress={() => this.showFormEditSearch()}>
						<Text style={{color: '#fff'}}>{this.state.editFormSearch? 'Đóng' : 'Sửa nơi đi, nơi đến, ngày đi'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
		return html;
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
					this.renderFormSearch(listItem1, listItem2)
				}

				{this.state.oneSearch &&
					<ScrollView>
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
							{ !this.state.loading && <Card  style={{marginTop: -5}} dataArray={dataNot}
			                 renderRow={(dataNot) =>
			                   <CardItem>
											<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => Actions.ViewSoDoGiuong({title: 'Chọn chỗ', data: {dataBen: this.state.dataBx, id_dieu_do: dataNot.id_dieu_do, totalPriceInt: dataNot.price, adm_id: this.props.data.adm_id, gio_xuat_ben: dataNot.did_gio_xuat_ben_that, notId:dataNot.not_id, day:this.state.fullDate, notTuyenId: dataNot.not_tuy_id, benA: dataNot.ben_a, benB: dataNot.ben_b}})}>
												<View style={{flex: 2}}>
													<Text style={{fontWeight: 'bold'}}>{dataNot.did_gio_xuat_ben_that}</Text>
													<Text>{this.state.dataBx[dataNot.ben_a]} -> {this.state.dataBx[dataNot.ben_b]}</Text>
													<Text>{dataNot.tenSoDo}</Text>
													<Text>Số chỗ trống: {dataNot.soChoTrong}</Text>
												</View>
												<View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',alignItems: 'center'}}>
													<View style={{padding: 5, alignItems: 'center', justifyContent: 'center'}}>
														<Text style={{fontWeight: 'bold', color: '#ff931f'}}>{dataNot.price} VNĐ</Text>
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
